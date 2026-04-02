import React, { useState, useMemo, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Image,
  Modal,
  Switch,
  ActivityIndicator,
} from 'react-native';
import { useSelector } from 'react-redux';
import { GET_ALL_PRODUCTS_WITH_INVENTORY, GET_ALL_CATEGORIES } from '../../services/ProductService';
import { Colors } from '../../utils/Colors';
import { Subtitle2, Body3, Caption, H1 } from '../../utils/fonts';
import { IconSize12, IconSize24, IconSize40 } from '../../utils/IconSizes';
import {
  SearchIcon,
  LeftArrowIcon,
  RightArrowIcon,
  DeleteCircleIcon,
  EditCircleIcon,
  UploadIcon,
  DeleteIcon,
  ArrowDownIcon,
} from '../../assets/Images';
import ConfirmationModal from '../../components/ConfirmationModal';
import SuccessModal from '../../components/SuccessModal';
import styles from './InventoryManagementStyles';
import SortModal, { applySort } from '../../components/SortModal';
import ProductFormModal from '../../components/ProductFormModal';
import { SvgUri } from 'react-native-svg';

const InventoryManagement = () => {
  const { store_id } = useSelector(state => state.user);

  const [searchQuery, setSearchQuery] = useState('');
  const [showSortModal, setShowSortModal] = useState(false);
  const [sortType, setSortType] = useState('a-z');
  const [viewType, setViewType] = useState('products'); // products or categories

  const [showFormModal, setShowFormModal] = useState(false);
  const [formType, setFormType] = useState('add');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const [showCatFormModal, setShowCatFormModal] = useState(false);
  const [catFormData, setCatFormData] = useState({
    name: '',
    status: 'Active',
    products: '',
    vendor: '',
    image: null,
  });
  const [showCatStatusDropdown, setShowCatStatusDropdown] = useState(false);

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(false);
  const [isLoadingCategories, setIsLoadingCategories] = useState(false);

  const [productQuery, setProductQuery] = useState({
    page: 1,
    itemsPerPage: 20,
    searchText: '',
    getAll: 'false',
    limited: 'false',
    storeId: store_id,
    category_id: '',
  });

  const [categoryQuery, setCategoryQuery] = useState({
    page: 1,
    itemsPerPage: 10,
    searchText: '',
    getAll: 'false',
    limited: 'false',
    storeId: store_id,
  });

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoadingProducts(true);
      try {
        const response = await GET_ALL_PRODUCTS_WITH_INVENTORY(productQuery);
        console.log(response, 'productsssss');
        const mappedProducts = (response?.items || []).map(p => ({
          ...p,
          id: p._id,
          name: p.product_name || p.name || 'Unknown',
          sku: p.sku || p.sku_code || 'N/A',
          barcode: p.bar_code || 'N/A',
          categoryName: p.category?.category_name || p.category || 'N/A',
          discount: p.discount || 'N/A',
          qty: p.quantity || 0,
          priceValue: p.price ? `$ ${p.price}` : '$ 0.00',
          status: p.status || 'Active',
          image: p.product_image || null,
        }));
        setProducts(mappedProducts);
      } catch (error) {
        console.error('Error fetching products with inventory:', error);
      } finally {
        setIsLoadingProducts(false);
      }
    };
    fetchProducts();
  }, [productQuery]);

  useEffect(() => {
    const fetchCategories = async () => {
      setIsLoadingCategories(true);
      try {
        const response = await GET_ALL_CATEGORIES(categoryQuery);
        const mappedCategories = (response?.items || []).map(c => ({
          ...c,
          id: c._id,
          name: c.category_name || c.name || 'Unknown',
          status: c.status || 'Active',
        }));
        setCategories(mappedCategories);
      } catch (error) {
        console.error('Error fetching categories:', error);
      } finally {
        setIsLoadingCategories(false);
      }
    };
    fetchCategories();
  }, [categoryQuery]);

  const sortedData = useMemo(() => {
    let data = viewType === 'products' ? [...products] : [...categories];

    if (searchQuery.trim() !== '') {
      data = data.filter(item => item.name.toLowerCase().includes(searchQuery.toLowerCase()));
    }

    return applySort(data, sortType, item => item.name);
  }, [sortType, searchQuery, viewType, products, categories]);

  const handleSortSelect = type => {
    setSortType(type);
    setShowSortModal(false);
  };

  const handleCreateNew = () => {
    setFormType('add');
    if (viewType === 'products') {
      setSelectedProduct({
        name: '',
        sku: '',
        barcode: '',
        category: "Men's Wear",
        status: 'Active',
        price: '',
        tax: '',
        qty: '0',
        discountEnabled: true,
        discountTitle: '',
        discountAmount: '',
        image: null,
        description: '',
      });
      setShowFormModal(true);
    } else {
      setCatFormData({
        name: '',
        status: 'Active',
        products: '',
        vendor: '',
        image: null,
      });
      setShowCatFormModal(true);
    }
  };

  const handleEdit = item => {
    setFormType('edit');
    if (viewType === 'products') {
      setSelectedProduct({
        name: item.name || '',
        sku: item.sku || '',
        barcode: item.barcode || '',
        category: item.categoryName || "Men's Wear",
        status: item.status || 'Active',
        price: item.priceValue ? String(item.priceValue).replace(/[^0-9.]/g, '') : '',
        tax: '',
        qty: String(item.qty) || '0',
        discountEnabled: !!item.discount,
        discountTitle: item.discount || '',
        discountAmount: '',
        image: item.image || null,
        description: item.description || '',
      });
      setShowFormModal(true);
    } else {
      setCatFormData({
        name: item.name || '',
        status: item.status || 'Active',
        products: item.products || '',
        vendor: item.vendor || '',
        image: item.image || null,
      });
      setShowCatFormModal(true);
    }
  };

  const handleDelete = () => {
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    setShowDeleteModal(false);
    setTimeout(() => {
      setShowSuccessModal(true);
    }, 500);
  };

  const handleFormSubmit = data => {
    // Here you would handle the API call to create or update a product
    console.log('Submitting data:', data);
    setShowFormModal(false);
    // After a successful API call, you might want to refetch products and show a success message.
    // For now, we'll just close the modal.
  };

  return (
    <View style={styles.root}>
      {/* Header Row */}
      <View style={styles.headerRow}>
        <View style={styles.headerTitleGroup}>
          <Text style={[styles.headerTitle, H1]}>Inventory Management</Text>
          <View style={styles.toggleGroup}>
            <TouchableOpacity
              style={[styles.toggleBtn, viewType === 'products' && styles.toggleBtnActive]}
              onPress={() => setViewType('products')}
            >
              <Text
                style={[
                  styles.toggleText,
                  viewType === 'products' && styles.toggleTextActive,
                  Body3,
                ]}
              >
                Products
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.toggleBtn, viewType === 'categories' && styles.toggleBtnActive]}
              onPress={() => setViewType('categories')}
            >
              <Text
                style={[
                  styles.toggleText,
                  viewType === 'categories' && styles.toggleTextActive,
                  Body3,
                ]}
              >
                Categories
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.sortBtn} onPress={() => setShowSortModal(true)}>
            <Text style={[styles.sortText, Caption]}>Sort by ⇅</Text>
          </TouchableOpacity>

          <View style={styles.searchBar}>
            <Image source={SearchIcon} style={IconSize12} />
            <TextInput
              style={[styles.searchInput, Body3]}
              placeholder="Search Merchant"
              placeholderTextColor="#3B4B8A"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>

          <TouchableOpacity style={styles.createBtn} onPress={handleCreateNew}>
            <Text style={[styles.createBtnText, Caption]}>
              {viewType === 'products' ? 'Create Merchant +' : 'Create Category +'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Table Container */}
      <View style={styles.tableContainer}>
        {/* Table Header */}
        <View style={styles.tableHeader}>
          {viewType === 'products' ? (
            <>
              <Text style={[styles.colProductHeader, styles.headerText, Subtitle2]}>Product</Text>
              <Text style={[styles.colSKU, styles.headerText, Subtitle2]}>SKU Code</Text>
              <Text style={[styles.colBarcode, styles.headerText, Subtitle2]}>Barcode</Text>
              <Text style={[styles.colCategory, styles.headerText, Subtitle2]}>Category</Text>
              <Text style={[styles.colDiscount, styles.headerText, Subtitle2]}>Discount Code</Text>
              <Text style={[styles.colQty, styles.headerText, Subtitle2]}>Quantity</Text>
              <Text style={[styles.colPrice, styles.headerText, Subtitle2]}>Price</Text>
              <Text
                style={[styles.colStatus, styles.headerText, Subtitle2, styles.centerTextAlign]}
              >
                Status
              </Text>
              <Text
                style={[styles.colAction, styles.headerText, Subtitle2, styles.centerTextAlign]}
              >
                Actions
              </Text>
            </>
          ) : (
            <>
              <Text style={[styles.colCatNameHeader, styles.headerText, Subtitle2]}>
                Category Name
              </Text>
              <Text style={[styles.colCatStatus, styles.headerText, Subtitle2]}>Status</Text>
              <Text
                style={[styles.colCatAction, styles.headerText, Subtitle2, styles.centerTextAlign]}
              >
                Actions
              </Text>
            </>
          )}
        </View>

        {/* Table Content */}
        <ScrollView showsVerticalScrollIndicator={false}>
          {(viewType === 'products' && isLoadingProducts) ||
          (viewType === 'categories' && isLoadingCategories) ? (
            <View style={{ padding: 40, justifyContent: 'center', alignItems: 'center' }}>
              <ActivityIndicator size="large" color={Colors.primary} />
            </View>
          ) : (
            sortedData.map((item, index) => (
              <View key={index} style={styles.tableRow}>
                {viewType === 'products' ? (
                  <>
                    <View style={styles.colProductRow}>
                      {item.image ? (
                        <SvgUri style={styles.productImage} uri={item.image} />
                      ) : (
                        <View style={[styles.productImagePlaceholder, styles.placeholderImage]} />
                      )}
                      <Text style={[styles.rowText, Body3]} numberOfLines={2}>
                        {item.name}
                      </Text>
                    </View>

                    <Text style={[styles.colSKU, styles.rowText, Body3]}>{item.sku}</Text>
                    <Text style={[styles.colBarcode, styles.rowText, Body3]}>{item.barcode}</Text>
                    <Text style={[styles.colCategory, styles.rowText, Body3]}>
                      {item.categoryName}
                    </Text>
                    <Text style={[styles.colDiscount, styles.rowText, Body3]}>{item.discount}</Text>
                    <Text style={[styles.colQty, styles.rowText, Body3]}>{item.qty}</Text>
                    <Text style={[styles.colPrice, styles.rowText, Body3]}>{item.priceValue}</Text>

                    <View style={styles.colStatus}>
                      <View
                        style={[
                          styles.statusPill,
                          item.status === 'Active'
                            ? styles.statusActiveBg
                            : styles.statusInactiveBg,
                        ]}
                      >
                        <Text
                          style={[
                            Caption,
                            item.status === 'Active'
                              ? styles.statusActiveText
                              : styles.statusInactiveText,
                          ]}
                        >
                          {item.status}
                        </Text>
                      </View>
                    </View>

                    <View style={styles.colAction}>
                      <TouchableOpacity style={styles.infoCircle}>
                        <Text style={styles.infoText}>i</Text>
                      </TouchableOpacity>
                      <TouchableOpacity onPress={() => handleEdit(item)}>
                        <Image source={EditCircleIcon} style={[IconSize24]} />
                      </TouchableOpacity>
                      <TouchableOpacity onPress={() => handleDelete(item)}>
                        <Image source={DeleteCircleIcon} style={[IconSize24]} />
                      </TouchableOpacity>
                    </View>
                  </>
                ) : (
                  <>
                    <View style={styles.colCatNameRow}>
                      <View style={[styles.productImagePlaceholder, styles.placeholderImage]} />
                      <Text style={[styles.rowText, Body3]} numberOfLines={2}>
                        {item.name}
                      </Text>
                    </View>

                    <View style={styles.colCatStatus}>
                      <View
                        style={[
                          styles.statusPill,
                          item.status === 'Active'
                            ? styles.statusActiveBg
                            : styles.statusInactiveBg,
                          styles.alignSelfStart,
                        ]}
                      >
                        <Text
                          style={[
                            Caption,
                            item.status === 'Active'
                              ? styles.statusActiveText
                              : styles.statusInactiveText,
                          ]}
                        >
                          {item.status}
                        </Text>
                      </View>
                    </View>

                    <View style={styles.colCatAction}>
                      <TouchableOpacity style={styles.catRightCircle}>
                        <Text style={styles.catRightText}>&gt;</Text>
                      </TouchableOpacity>
                      <TouchableOpacity onPress={() => handleEdit(item)}>
                        <Image source={EditCircleIcon} style={[IconSize24]} />
                      </TouchableOpacity>
                      <TouchableOpacity onPress={() => handleDelete(item)}>
                        <Image source={DeleteCircleIcon} style={[IconSize24]} />
                      </TouchableOpacity>
                    </View>
                  </>
                )}
              </View>
            ))
          )}
        </ScrollView>
      </View>

      {/* Pagination Footer */}
      <View style={styles.paginationRow}>
        <TouchableOpacity style={styles.pageBtn}>
          <Image source={LeftArrowIcon} style={styles.actionIcon} />
        </TouchableOpacity>
        <Text style={[styles.pageText, Body3]}>01</Text>
        <TouchableOpacity style={styles.pageBtn}>
          <Image source={RightArrowIcon} style={styles.actionIcon} />
        </TouchableOpacity>
        <Text style={[styles.pageText, Body3]}>out of 20</Text>
      </View>

      <SortModal
        visible={showSortModal}
        onClose={() => setShowSortModal(false)}
        onSelect={handleSortSelect}
        currentSort={sortType}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        visible={showDeleteModal}
        icon={DeleteIcon}
        iconStyle={[IconSize40, styles.largeIconStyle]}
        title="Want to Delete this Product!"
        subtitle="Are you sure you want to delete this product?"
        confirmText="Delete Product →"
        confirmButtonColor="#B71C1C"
        onConfirm={confirmDelete}
        onCancel={() => setShowDeleteModal(false)}
      />

      {/* Success Modal */}
      <SuccessModal
        visible={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        message="Product Deleted Successfully!"
        title="Deleted Successfully"
      />

      {/* Add / Edit Form Modal */}
      {showFormModal && (
        <ProductFormModal
          visible={showFormModal}
          onClose={() => setShowFormModal(false)}
          formType={formType}
          initialData={selectedProduct}
          onSubmit={handleFormSubmit}
        />
      )}

      {/* Category Add/Edit Form Modal */}
      <Modal visible={showCatFormModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.catModalContent}>
            <TouchableOpacity
              style={styles.modalCloseBtn}
              onPress={() => setShowCatFormModal(false)}
            >
              <Text style={styles.modalCloseText}>✕</Text>
            </TouchableOpacity>

            <Text style={[styles.modalTitle, H1]}>
              {formType === 'add' ? 'Create Category' : 'Edit Category'}
            </Text>

            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.formScrollContent}
            >
              <View style={styles.formLabelRow}>
                <Text style={[styles.formLabel, Body3]}>Category Image</Text>
              </View>
              <TouchableOpacity style={styles.catUploadContainer} onPress={() => {}}>
                {catFormData.image ? (
                  <>
                    <Image
                      source={{ uri: catFormData.image }}
                      style={styles.catActiveUploadedImage}
                      resizeMode="cover"
                    />
                    <View style={styles.catChangeImageBtn}>
                      <Text style={styles.catChangeImageText}>Change Image</Text>
                    </View>
                  </>
                ) : (
                  <>
                    <Image
                      source={UploadIcon}
                      style={styles.catUploadImageIcon}
                      resizeMode="contain"
                    />
                    <Text style={[styles.catUploadImageHint, Body3]}>Upload Image</Text>
                    <Text style={[styles.catUploadImageSubHint, Caption]}>
                      you can upload upto 2MB, Image{'\n'}(JPG, PNG)
                    </Text>
                  </>
                )}
              </TouchableOpacity>

              <View style={styles.catFormRow}>
                <View style={styles.catFormCol}>
                  <View style={styles.formLabelRow}>
                    <Text style={[styles.formLabel, Body3]}>Category Name</Text>
                  </View>
                  <TextInput
                    style={[styles.formInput, Body3]}
                    placeholder="Men's Wear"
                    value={catFormData.name}
                    onChangeText={t => setCatFormData({ ...catFormData, name: t })}
                  />
                </View>
                <View style={[styles.catFormCol, styles.zIndexHigh]}>
                  <View style={styles.formLabelRow}>
                    <Text style={[styles.formLabel, Body3]}>Status</Text>
                  </View>
                  <TouchableOpacity
                    style={styles.dropdownInput}
                    onPress={() => setShowCatStatusDropdown(!showCatStatusDropdown)}
                  >
                    <View
                      style={
                        catFormData.status === 'Active'
                          ? styles.statusActiveBg2
                          : styles.statusInactiveBg2
                      }
                    >
                      <Text
                        style={[
                          catFormData.status === 'Active'
                            ? styles.statusActiveText2
                            : styles.statusInactiveText2,
                          Body3,
                        ]}
                      >
                        {catFormData.status || 'Select'}
                      </Text>
                    </View>
                    <Image
                      source={ArrowDownIcon}
                      style={styles.dropdownIcon}
                      resizeMode="contain"
                    />
                  </TouchableOpacity>
                  {showCatStatusDropdown && (
                    <View style={styles.dropdownList}>
                      {['Active', 'Inactive'].map((stat, i) => (
                        <TouchableOpacity
                          key={i}
                          style={styles.dropdownItem}
                          onPress={() => {
                            setCatFormData({ ...catFormData, status: stat });
                            setShowCatStatusDropdown(false);
                          }}
                        >
                          <Text style={[styles.dropdownText, Body3]}>{stat}</Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  )}
                </View>
              </View>

              <View style={styles.catFormRow}>
                <View style={styles.catFormCol}>
                  <View style={styles.formLabelRow}>
                    <Text style={[styles.formLabel, Body3]}>Products</Text>
                  </View>
                  <TextInput
                    style={[styles.formInput, Body3]}
                    placeholder="20"
                    value={catFormData.products}
                    onChangeText={t => setCatFormData({ ...catFormData, products: t })}
                  />
                </View>
                <View style={styles.catFormCol}>
                  <View style={styles.formLabelRow}>
                    <Text style={[styles.formLabel, Body3]}>Vendor</Text>
                  </View>
                  <TextInput
                    style={[styles.formInput, Body3]}
                    placeholder="Gucci"
                    value={catFormData.vendor}
                    onChangeText={t => setCatFormData({ ...catFormData, vendor: t })}
                  />
                </View>
              </View>

              <TouchableOpacity style={styles.catSubmitBtn}>
                <Text style={[styles.catSubmitBtnText, Body3]}>
                  {formType === 'add' ? 'Add Category' : 'Save Changes'}
                </Text>
                <Text style={styles.catSubmitBtnText}>→</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default InventoryManagement;
