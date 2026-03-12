import React, { useState, useMemo } from 'react';
import { View, Text, TouchableOpacity, ScrollView, TextInput, Image, Modal, Switch } from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import { Colors } from '../../utils/Colors';
import { S, VS, MS } from '../../utils/Responsive';
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
import SortModal from '../../components/SortModal';

const dummyData = [
  { id: '1', name: "Men's Leather Jacket", sku: 'avbd4562536', barcode: 'avbd4562536', category: "Men's Wear", discount: 'End of Year (521426)', qty: '1000', price: '$ 5,956.00', status: 'Active' },
  { id: '2', name: "Men's Leather Jacket", sku: 'avbd4562536', barcode: 'avbd4562536', category: "Men's Wear", discount: 'End of Year (521426)', qty: '1000', price: '$ 5,956.00', status: 'Active' },
  { id: '3', name: "Men's Leather Jacket", sku: 'avbd4562536', barcode: 'avbd4562536', category: "Men's Wear", discount: '50% off Sale (521426)', qty: '1000', price: '$ 5,956.00', status: 'Active' },
  { id: '4', name: "Men's Leather Jacket", sku: 'avbd4562536', barcode: 'avbd4562536', category: "Men's Wear", discount: 'End of Year (521426)', qty: '1000', price: '$ 5,956.00', status: 'Inavtive' },
  { id: '5', name: "Men's Leather Jacket", sku: 'avbd4562536', barcode: 'avbd4562536', category: "Men's Wear", discount: 'End of Year (521426)', qty: '1000', price: '$ 5,956.00', status: 'Active' },
  { id: '6', name: "Men's Leather Jacket", sku: 'avbd4562536', barcode: 'avbd4562536', category: "Men's Wear", discount: '50% off Sale (521426)', qty: '1000', price: '$ 5,956.00', status: 'Active' },
  { id: '7', name: "Men's Leather Jacket", sku: 'avbd4562536', barcode: 'avbd4562536', category: "Winter Collection", discount: 'End of Year (521426)', qty: '1000', price: '$ 5,956.00', status: 'Inavtive' },
  { id: '8', name: "Men's Leather Jacket", sku: 'avbd4562536', barcode: 'avbd4562536', category: "Winter Collection", discount: '50% off Sale (521426)', qty: '1000', price: '$ 5,956.00', status: 'Inavtive' },
  { id: '9', name: "Men's Leather Jacket", sku: 'avbd4562536', barcode: 'avbd4562536', category: "Winter Collection", discount: 'End of Year (521426)', qty: '1000', price: '$ 5,956.00', status: 'Active' },
];

const dummyCategories = [
  { id: '1', name: "Men's Wear", status: 'Active' },
  { id: '2', name: "Business casual", status: 'Active' },
  { id: '3', name: "Cloths", status: 'Inactive' },
  { id: '4', name: "Men's Shoes", status: 'Active' },
  { id: '5', name: "Baby Shoes", status: 'Inactive' },
  { id: '6', name: "Girly style", status: 'Active' },
  { id: '7', name: "Artsy fashion", status: 'Active' },
  { id: '8', name: "Artsy fashion", status: 'Active' },
];

const InventoryManagement = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showSortModal, setShowSortModal] = useState(false);
  const [sortType, setSortType] = useState('a-z');
  const [viewType, setViewType] = useState('products'); // products or categories
  
  const [showFormModal, setShowFormModal] = useState(false);
  const [formType, setFormType] = useState('add');
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const [formData, setFormData] = useState({
    name: '', sku: '', barcode: '', category: "Men's Wear", status: 'Active', 
    price: '', tax: '', qty: '', discountEnabled: true, discountTitle: '', 
    discountAmount: '', image: null, description: ''
  });

  const [showCatFormModal, setShowCatFormModal] = useState(false);
  const [catFormData, setCatFormData] = useState({
    name: '', status: 'Active', products: '', vendor: '', image: null
  });
  const [showCatStatusDropdown, setShowCatStatusDropdown] = useState(false);

  const sortedData = useMemo(() => {
    let data = viewType === 'products' ? [...dummyData] : [...dummyCategories];
    if (sortType === 'a-z' || sortType === 'name') {
      data.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortType === 'z-a') {
      data.sort((a, b) => b.name.localeCompare(a.name));
    }
    
    if (searchQuery.trim() !== '') {
      data = data.filter(item => item.name.toLowerCase().includes(searchQuery.toLowerCase()));
    }
    
    return data;
  }, [sortType, searchQuery, viewType]);

  const handleSortSelect = (type) => {
    setSortType(type);
    setShowSortModal(false);
  };

  const handleCreateNew = () => {
    setFormType('add');
    if (viewType === 'products') {
      setFormData({
        name: '', sku: '', barcode: '', category: "Men's Wear", status: 'Active', 
        price: '', tax: '', qty: '', discountEnabled: true, discountTitle: '', 
        discountAmount: '', image: null, description: ''
      });
      setShowFormModal(true);
    } else {
      setCatFormData({
        name: '', status: 'Active', products: '', vendor: '', image: null
      });
      setShowCatFormModal(true);
    }
  };

  const handleEdit = (item) => {
    setFormType('edit');
    if (viewType === 'products') {
      setFormData({
        name: item.name || '', sku: item.sku || '', barcode: item.barcode || '', 
        category: item.category || "Men's Wear", status: item.status || 'Active', 
        price: item.price || '', tax: '', qty: item.qty || '', discountEnabled: true, 
        discountTitle: item.discount || '', discountAmount: '', image: null, description: ''
      });
      setShowFormModal(true);
    } else {
      setCatFormData({
        name: item.name || '', status: item.status || 'Active', products: item.products || '', 
        vendor: item.vendor || '', image: item.image || null
      });
      setShowCatFormModal(true);
    }
  };

  const handleDelete = (item) => {
    setSelectedProduct(item);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    setShowDeleteModal(false);
    setTimeout(() => {
      setShowSuccessModal(true);
    }, 500);
  };

  const handleImageUpload = () => {
    launchImageLibrary({ mediaType: 'photo', quality: 0.8 }, (response) => {
      if (response.didCancel || response.errorMessage) return;
      if (response.assets && response.assets.length > 0) {
        if (showCatFormModal) {
          setCatFormData({ ...catFormData, image: response.assets[0].uri });
        } else {
          setFormData({ ...formData, image: response.assets[0].uri });
        }
      }
    });
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
              <Text style={[styles.toggleText, viewType === 'products' && styles.toggleTextActive, Body3]}>Products</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.toggleBtn, viewType === 'categories' && styles.toggleBtnActive]}
              onPress={() => setViewType('categories')}
            >
              <Text style={[styles.toggleText, viewType === 'categories' && styles.toggleTextActive, Body3]}>Categories</Text>
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
              <Text style={[styles.colStatus, styles.headerText, Subtitle2, { textAlign: 'center' }]}>Status</Text>
              <Text style={[styles.colAction, styles.headerText, Subtitle2, { textAlign: 'center' }]}>Actions</Text>
            </>
          ) : (
            <>
              <Text style={[styles.colCatNameHeader, styles.headerText, Subtitle2]}>Category Name</Text>
              <Text style={[styles.colCatStatus, styles.headerText, Subtitle2]}>Status</Text>
              <Text style={[styles.colCatAction, styles.headerText, Subtitle2, { textAlign: 'center' }]}>Actions</Text>
            </>
          )}
        </View>

        {/* Table Content */}
        <ScrollView showsVerticalScrollIndicator={false}>
          {sortedData.map((item, index) => (
            <View key={index} style={styles.tableRow}>
              {viewType === 'products' ? (
                <>
                  <View style={styles.colProductRow}>
                    <View style={[styles.productImagePlaceholder, { backgroundColor: Colors.lightGrey }]} />
                    <Text style={[styles.rowText, Body3]} numberOfLines={2}>{item.name}</Text>
                  </View>
                  
                  <Text style={[styles.colSKU, styles.rowText, Body3]}>{item.sku}</Text>
                  <Text style={[styles.colBarcode, styles.rowText, Body3]}>{item.barcode}</Text>
                  <Text style={[styles.colCategory, styles.rowText, Body3]}>{item.category}</Text>
                  <Text style={[styles.colDiscount, styles.rowText, Body3]}>{item.discount}</Text>
                  <Text style={[styles.colQty, styles.rowText, Body3]}>{item.qty}</Text>
                  <Text style={[styles.colPrice, styles.rowText, Body3]}>{item.price}</Text>
                  
                  <View style={styles.colStatus}>
                    <View style={[styles.statusPill, item.status === 'Active' ? styles.statusActiveBg : styles.statusInactiveBg]}>
                      <Text style={[Caption, item.status === 'Active' ? styles.statusActiveText : styles.statusInactiveText]}>
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
                    <View style={[styles.productImagePlaceholder, { backgroundColor: Colors.lightGrey }]} />
                    <Text style={[styles.rowText, Body3]} numberOfLines={2}>{item.name}</Text>
                  </View>
                  
                  <View style={styles.colCatStatus}>
                    <View style={[styles.statusPill, item.status === 'Active' ? styles.statusActiveBg : styles.statusInactiveBg, { alignSelf: 'flex-start' }]}>
                      <Text style={[Caption, item.status === 'Active' ? styles.statusActiveText : styles.statusInactiveText]}>
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
          ))}
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
        iconStyle={[IconSize40, { width: S(80), height: S(80), tintColor: '#333333' }]}
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
      <Modal visible={showFormModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.formModalContent}>
            <TouchableOpacity style={styles.modalCloseBtn} onPress={() => setShowFormModal(false)}>
              <Text style={styles.modalCloseText}>✕</Text>
            </TouchableOpacity>

            <Text style={[styles.modalTitle, H1]}>
              {formType === 'add' ? 'Add new Product' : 'Edit Product'}
            </Text>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.formScrollContent}>
              <View style={styles.formRow}>
                <View style={styles.formCol}>
                  <View style={styles.formLabelRow}><Text style={[styles.formLabel, Body3]}>Product Name</Text></View>
                  <TextInput style={[styles.formInput, Body3]} placeholder="Men's Leather Jacket" value={formData.name} onChangeText={(t) => setFormData({...formData, name: t})} />
                </View>
                <View style={styles.formCol}>
                  <View style={styles.formLabelRow}><Text style={[styles.formLabel, Body3]}>SKU Code</Text></View>
                  <TextInput style={[styles.formInput, Body3]} placeholder="avbd4562536" value={formData.sku} onChangeText={(t) => setFormData({...formData, sku: t})} />
                </View>
              </View>

              <View style={styles.formRow}>
                <View style={styles.formCol}>
                  <View style={styles.formLabelRow}><Text style={[styles.formLabel, Body3]}>Barcode</Text></View>
                  <TextInput style={[styles.formInput, Body3]} placeholder="avbd4562536" value={formData.barcode} onChangeText={(t) => setFormData({...formData, barcode: t})} />
                </View>
                <View style={styles.formCol}>
                  <View style={styles.formLabelRow}><Text style={[styles.formLabel, Body3]}>Select Category</Text></View>
                  <TouchableOpacity 
                    style={styles.dropdownInput} 
                    onPress={() => setShowCategoryDropdown(!showCategoryDropdown)}
                  >
                    <Text style={[styles.dropdownText, Body3]}>{formData.category || 'Select'}</Text>
                    <Image source={ArrowDownIcon} style={styles.dropdownIcon} resizeMode="contain" />
                  </TouchableOpacity>
                  {showCategoryDropdown && (
                    <View style={styles.dropdownList}>
                      {['Men\'s Wear', 'Winter Collection', 'Summer Collection'].map((cat, i) => (
                        <TouchableOpacity 
                          key={i} 
                          style={styles.dropdownItem} 
                          onPress={() => {
                            setFormData({...formData, category: cat});
                            setShowCategoryDropdown(false);
                          }}
                        >
                          <Text style={[styles.dropdownText, Body3]}>{cat}</Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  )}
                </View>
              </View>

              <View style={styles.formRow}>
                <View style={[styles.formCol, { zIndex: 10 }]}>
                  <View style={styles.formLabelRow}><Text style={[styles.formLabel, Body3]}>Status</Text></View>
                  <TouchableOpacity 
                    style={styles.dropdownInput} 
                    onPress={() => setShowStatusDropdown(!showStatusDropdown)}
                  >
                    <View style={formData.status === 'Active' ? styles.statusActiveBg2 : styles.statusInactiveBg2}>
                      <Text style={[formData.status === 'Active' ? styles.statusActiveText2 : styles.statusInactiveText2, Body3]}>
                        {formData.status || 'Select'}
                      </Text>
                    </View>
                    <Image source={ArrowDownIcon} style={styles.dropdownIcon} resizeMode="contain" />
                  </TouchableOpacity>
                  {showStatusDropdown && (
                    <View style={styles.dropdownList}>
                      {['Active', 'Inactive'].map((stat, i) => (
                        <TouchableOpacity 
                          key={i} 
                          style={styles.dropdownItem} 
                          onPress={() => {
                            setFormData({...formData, status: stat});
                            setShowStatusDropdown(false);
                          }}
                        >
                          <Text style={[styles.dropdownText, Body3]}>{stat}</Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  )}
                </View>
                <View style={styles.formCol}>
                  <View style={styles.formLabelRow}><Text style={[styles.formLabel, Body3]}>Price</Text></View>
                  <TextInput style={[styles.formInput, Body3]} placeholder="$ 20.00" value={formData.price} onChangeText={(t) => setFormData({...formData, price: t})} />
                </View>
              </View>

              <View style={styles.formRow}>
                <View style={styles.formCol}>
                  <View style={styles.formLabelRow}><Text style={[styles.formLabel, Body3]}>Tax</Text></View>
                  <TextInput style={[styles.formInput, Body3]} placeholder="$ 20.00" value={formData.tax} onChangeText={(t) => setFormData({...formData, tax: t})} />
                </View>
                <View style={styles.formCol}>
                  <View style={styles.formLabelRow}><Text style={[styles.formLabel, Body3]}>Qty</Text></View>
                  <TextInput style={[styles.formInput, Body3]} placeholder="2,000" value={formData.qty} onChangeText={(t) => setFormData({...formData, qty: t})} />
                </View>
              </View>

              <View style={styles.formRow}>
                <View style={styles.formCol}>
                  <View style={styles.formLabelRow}>
                    <Text style={[styles.formLabel, Body3]}>Discount Title</Text>
                    <Switch
                      value={formData.discountEnabled}
                      onValueChange={(val) => setFormData({ ...formData, discountEnabled: val })}
                      trackColor={{ false: '#E0E0E0', true: '#4FC3F7' }}
                      thumbColor={Colors.white}
                    />
                  </View>
                  <TextInput style={[styles.formInput, Body3]} placeholder="End of year" value={formData.discountTitle} onChangeText={(t) => setFormData({...formData, discountTitle: t})} />
                </View>
                <View style={styles.formCol}>
                  <View style={styles.formLabelRow}><Text style={[styles.formLabel, Body3]}>Discount Amount</Text></View>
                  <TextInput style={[styles.formInput, Body3]} placeholder="$ 5.00" value={formData.discountAmount} onChangeText={(t) => setFormData({...formData, discountAmount: t})} />
                </View>
              </View>

              <View style={styles.formRow}>
                <View style={styles.formCol}>
                  <View style={styles.formLabelRow}><Text style={[styles.formLabel, Body3]}>Product Image</Text></View>
                  <TouchableOpacity style={styles.uploadImageContainer} onPress={handleImageUpload}>
                    {formData.image ? (
                      <Image source={{ uri: formData.image }} style={styles.uploadedImage} resizeMode="cover" />
                    ) : (
                      <>
                        <Image source={UploadIcon} style={styles.uploadImageIcon} resizeMode="contain" />
                        <Text style={[styles.uploadImageText, Body3]}>Upload Image</Text>
                        <Text style={[styles.uploadImageSubText, Caption]}>you can upload upto 2MB, Image{'\n'}(JPG, PNG)</Text>
                      </>
                    )}
                  </TouchableOpacity>
                </View>
                <View style={styles.formCol}>
                  <View style={styles.formLabelRow}><Text style={[styles.formLabel, Body3]}>Product Description</Text></View>
                  <TextInput 
                    style={[styles.textAreaInput, Body3]} 
                    multiline 
                    placeholder="Context description goes here..." 
                    value={formData.description} 
                    onChangeText={(t) => setFormData({...formData, description: t})} 
                  />
                </View>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Category Add/Edit Form Modal */}
      <Modal visible={showCatFormModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.catModalContent}>
            <TouchableOpacity style={styles.modalCloseBtn} onPress={() => setShowCatFormModal(false)}>
              <Text style={styles.modalCloseText}>✕</Text>
            </TouchableOpacity>

            <Text style={[styles.modalTitle, H1]}>
              {formType === 'add' ? 'Create Category' : 'Edit Category'}
            </Text>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.formScrollContent}>
              <View style={styles.formLabelRow}><Text style={[styles.formLabel, Body3]}>Category Image</Text></View>
              <TouchableOpacity style={styles.catUploadContainer} onPress={handleImageUpload}>
                {catFormData.image ? (
                  <>
                    <Image source={{ uri: catFormData.image }} style={styles.catActiveUploadedImage} resizeMode="cover" />
                    <View style={styles.catChangeImageBtn}>
                      <Text style={styles.catChangeImageText}>Change Image</Text>
                    </View>
                  </>
                ) : (
                  <>
                    <Image source={UploadIcon} style={styles.catUploadImageIcon} resizeMode="contain" />
                    <Text style={[styles.catUploadImageHint, Body3]}>Upload Image</Text>
                    <Text style={[styles.catUploadImageSubHint, Caption]}>you can upload upto 2MB, Image{'\n'}(JPG, PNG)</Text>
                  </>
                )}
              </TouchableOpacity>

              <View style={styles.catFormRow}>
                <View style={styles.catFormCol}>
                  <View style={styles.formLabelRow}><Text style={[styles.formLabel, Body3]}>Category Name</Text></View>
                  <TextInput 
                    style={[styles.formInput, Body3]} 
                    placeholder="Men's Wear" 
                    value={catFormData.name} 
                    onChangeText={(t) => setCatFormData({...catFormData, name: t})} 
                  />
                </View>
                <View style={[styles.catFormCol, { zIndex: 10 }]}>
                  <View style={styles.formLabelRow}><Text style={[styles.formLabel, Body3]}>Status</Text></View>
                  <TouchableOpacity 
                    style={styles.dropdownInput} 
                    onPress={() => setShowCatStatusDropdown(!showCatStatusDropdown)}
                  >
                    <View style={catFormData.status === 'Active' ? styles.statusActiveBg2 : styles.statusInactiveBg2}>
                      <Text style={[catFormData.status === 'Active' ? styles.statusActiveText2 : styles.statusInactiveText2, Body3]}>
                        {catFormData.status || 'Select'}
                      </Text>
                    </View>
                    <Image source={ArrowDownIcon} style={styles.dropdownIcon} resizeMode="contain" />
                  </TouchableOpacity>
                  {showCatStatusDropdown && (
                    <View style={styles.dropdownList}>
                      {['Active', 'Inactive'].map((stat, i) => (
                        <TouchableOpacity 
                          key={i} 
                          style={styles.dropdownItem} 
                          onPress={() => {
                            setCatFormData({...catFormData, status: stat});
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
                  <View style={styles.formLabelRow}><Text style={[styles.formLabel, Body3]}>Products</Text></View>
                  <TextInput 
                    style={[styles.formInput, Body3]} 
                    placeholder="20" 
                    value={catFormData.products} 
                    onChangeText={(t) => setCatFormData({...catFormData, products: t})} 
                  />
                </View>
                <View style={styles.catFormCol}>
                  <View style={styles.formLabelRow}><Text style={[styles.formLabel, Body3]}>Vendor</Text></View>
                  <TextInput 
                    style={[styles.formInput, Body3]} 
                    placeholder="Gucci" 
                    value={catFormData.vendor} 
                    onChangeText={(t) => setCatFormData({...catFormData, vendor: t})} 
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
