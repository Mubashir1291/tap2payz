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
import {
  GET_ALL_PRODUCTS_WITH_INVENTORY,
  GET_ALL_CATEGORIES,
  DELETE_PRODUCT,
  DELETE_CATEGORY,
} from '../../services/ProductService';
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
import CategoryFormModal from '../../components/CategoryFormModal';
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
  const [selectedCategory, setSelectedCategory] = useState(null);

  const [showCatFormModal, setShowCatFormModal] = useState(false);

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [productData, setProductData] = useState(null);
  const [categoryData, setCategoryData] = useState(null);
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
        setProductData(response);
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
        console.log(response, 'categories');
        const mappedCategories = (response?.items || []).map(c => ({
          ...c,
          id: c._id,
          name: c.category_name || c.name || 'Unknown',
          status: c.status || 'Active',
        }));
        setCategories(mappedCategories);
        setCategoryData(response);
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
      setSelectedCategory(null);
      setShowCatFormModal(true);
    }
  };

  const handleEdit = item => {
    setFormType('edit');
    if (viewType === 'products') {
      setSelectedProduct({
        _id: item._id || item.id,
        name: item.name || '',
        sku: item.sku || '',
        barcode: item.barcode || '',
        category: item.categoryName || "Men's Wear",
        category_id: item.category || '',
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
      setSelectedCategory(item);
      setShowCatFormModal(true);
    }
  };

  const handleDelete = item => {
    if (viewType === 'products') {
      setSelectedProduct(item);
    } else {
      setSelectedCategory(item);
    }
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      if (viewType === 'products') {
        const response = await DELETE_PRODUCT(selectedProduct._id);
        console.log('Product Delete response', response);
      } else {
        const response = await DELETE_CATEGORY(selectedCategory._id || selectedCategory.id);
        console.log('Category Delete response', response);
      }
    } catch (error) {
      console.error('Error deleting:', error);
    }

    setShowDeleteModal(false);
    setTimeout(() => {
      setShowSuccessModal(true);
      // Refresh the list after deletion - reset to page 1
      if (viewType === 'products') {
        setProductQuery({
          page: 1,
          itemsPerPage: 20,
          searchText: '',
          getAll: 'false',
          limited: 'false',
          storeId: store_id,
          category_id: '',
        });
      } else {
        setCategoryQuery({
          page: 1,
          itemsPerPage: 10,
          searchText: '',
          getAll: 'false',
          limited: 'false',
          storeId: store_id,
        });
      }
    }, 500);
  };

  const handleFormSubmit = data => {
    // Here you would handle the API call to create or update a product
    console.log('Submitting data:', data);
    setShowFormModal(false);
    // After a successful API call, you might want to refetch products and show a success message.
    // For now, we'll just close the modal.
  };

  const handleCategorySubmit = data => {
    console.log('Submitting category data:', data);
    setShowCatFormModal(false);
    // After a successful API call, you might want to refetch products and show a success message.
    // For now, we'll just close the modal.
  };

  const currentPage = viewType === 'products' ? productQuery.page : categoryQuery.page;
  const totalPages =
    viewType === 'products' ? productData?.lastPage || 1 : categoryData?.lastPage || 1;
  const canGoPrev = currentPage > 1;
  const canGoNext = viewType === 'products' ? productData?.hasNextPage : categoryData?.hasNextPage;

  const handlePrevPage = () => {
    if (viewType === 'products') {
      if (productQuery.page > 1) setProductQuery(prev => ({ ...prev, page: prev.page - 1 }));
    } else {
      if (categoryQuery.page > 1) setCategoryQuery(prev => ({ ...prev, page: prev.page - 1 }));
    }
  };

  const handleNextPage = () => {
    if (viewType === 'products') {
      if (productData?.hasNextPage) setProductQuery(prev => ({ ...prev, page: prev.page + 1 }));
    } else {
      if (categoryData?.hasNextPage) setCategoryQuery(prev => ({ ...prev, page: prev.page + 1 }));
    }
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
        <TouchableOpacity
          style={[styles.pageBtn, !canGoPrev && { opacity: 0.5 }]}
          onPress={handlePrevPage}
          disabled={!canGoPrev}
        >
          <Image source={LeftArrowIcon} style={styles.actionIcon} />
        </TouchableOpacity>
        <Text style={[styles.pageText, Body3]}>{String(currentPage).padStart(2, '0')}</Text>
        <TouchableOpacity
          style={[styles.pageBtn, !canGoNext && { opacity: 0.5 }]}
          onPress={handleNextPage}
          disabled={!canGoNext}
        >
          <Image source={RightArrowIcon} style={styles.actionIcon} />
        </TouchableOpacity>
        <Text style={[styles.pageText, Body3]}>out of {String(totalPages).padStart(2, '0')}</Text>
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
        title={`Want to Delete this ${viewType === 'products' ? 'Product' : 'Category'}!`}
        subtitle={`Are you sure you want to delete this ${
          viewType === 'products' ? 'product' : 'category'
        }?`}
        confirmText={`Delete ${viewType === 'products' ? 'Product' : 'Category'} →`}
        confirmButtonColor="#B71C1C"
        onConfirm={confirmDelete}
        onCancel={() => setShowDeleteModal(false)}
      />

      {/* Success Modal */}
      <SuccessModal
        visible={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        message={`${viewType === 'products' ? 'Product' : 'Category'} Deleted Successfully!`}
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
      {showCatFormModal && (
        <CategoryFormModal
          visible={showCatFormModal}
          onClose={() => setShowCatFormModal(false)}
          formType={formType}
          initialData={selectedCategory}
          onSubmit={handleCategorySubmit}
        />
      )}
    </View>
  );
};

export default InventoryManagement;
