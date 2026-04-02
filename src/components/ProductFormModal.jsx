import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Image,
  Modal,
  Switch,
  Alert,
  FlatList,
} from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import { useSelector } from 'react-redux';
import { Colors } from '../utils/Colors';
import { H1, Body3, Caption } from '../utils/fonts';
import { UploadIcon, ArrowDownIcon } from '../assets/Images';
import styles from '../screens/app/InventoryManagementStyles';
import { CREATE_PRODUCT, GET_ALL_CATEGORIES } from '../services/ProductService';

const ProductFormModal = ({ visible, onClose, formType, initialData, onSubmit }) => {
  const [formData, setFormData] = useState({});
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [categories, setCategories] = useState([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(false);
  const [isFetchingMoreCategories, setIsFetchingMoreCategories] = useState(false);
  const [categoryPage, setCategoryPage] = useState(1);
  const [hasMoreCategories, setHasMoreCategories] = useState(true);
  const { store_id, business_id } = useSelector(state => state.user);

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  const handleImageUpload = () => {
    launchImageLibrary({ mediaType: 'photo', quality: 0.8 }, response => {
      if (response.didCancel || response.errorMessage) {
        return;
      }
      if (response.assets && response.assets.length > 0) {
        setFormData({ ...formData, image: response.assets[0].uri });
      }
    });
  };

  const fetchCategories = async (page = 1) => {
    if (!hasMoreCategories && page !== 1) return;

    if (page === 1) setIsLoadingCategories(true);
    else setIsFetchingMoreCategories(true);

    try {
      const response = await GET_ALL_CATEGORIES({
        storeId: store_id,
        page,
        itemsPerPage: 10,
        getAll: 'false',
      });
      if (response?.items) {
        if (page === 1) {
          setCategories(response.items);
        } else {
          setCategories(prev => [...prev, ...response.items]);
        }
        if (response.items.length < 10 || (response.totalPages && page >= response.totalPages)) {
          setHasMoreCategories(false);
        }
        setCategoryPage(page);
      } else {
        setHasMoreCategories(false);
      }
    } catch (error) {
      console.log('Failed to fetch categories', error);
    } finally {
      if (page === 1) setIsLoadingCategories(false);
      else setIsFetchingMoreCategories(false);
    }
  };

  const handleCategoryPress = async () => {
    setShowCategoryDropdown(!showCategoryDropdown);
    if (!showCategoryDropdown && categories.length === 0) {
      fetchCategories(1);
    }
  };

  const loadMoreCategories = () => {
    if (!isFetchingMoreCategories && hasMoreCategories && !isLoadingCategories) {
      fetchCategories(categoryPage + 1);
    }
  };

  const handleSubmit = async () => {
    const payload = {
      product_name: formData.name || '',
      sku_code: formData.sku || '',
      bar_code: formData.barcode || '',
      category: formData.category || '',
      status: formData.status || 'Active',
      product_price: formData.price || '',
      product_tax: formData.tax || '',
      quantity: formData.qty || 0,
      product_image: formData.image || null,
      product_description: formData.description || '',
      store_id: store_id || '',
      business_id: business_id || '',
    };

    try {
      const response = await CREATE_PRODUCT(payload);
      console.log('Product Creation', response);
      if (response) {
        Alert.alert('Success', 'Product created successfully');
        onSubmit(payload);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to create product');
      console.log(error, 'Product Creation Error');
      console.log(payload, 'payload'); // Passing the submitted payload back to InventoryManagement to close modal and refresh
    }
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.modalOverlay}>
        <View style={styles.formModalContent}>
          <TouchableOpacity style={styles.modalCloseBtn} onPress={onClose}>
            <Text style={styles.modalCloseText}>✕</Text>
          </TouchableOpacity>

          <Text style={[styles.modalTitle, H1]}>
            {formType === 'add' ? 'Add new Product' : 'Edit Product'}
          </Text>

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.formScrollContent}
          >
            <View style={styles.formRow}>
              <View style={styles.formCol}>
                <View style={styles.formLabelRow}>
                  <Text style={[styles.formLabel, Body3]}>Product Name</Text>
                </View>
                <TextInput
                  style={[styles.formInput, Body3]}
                  placeholder="Men's Leather Jacket"
                  value={formData.name}
                  onChangeText={t => setFormData({ ...formData, name: t })}
                  placeholderTextColor="lightgrey"
                />
              </View>
              <View style={styles.formCol}>
                <View style={styles.formLabelRow}>
                  <Text style={[styles.formLabel, Body3]}>SKU Code</Text>
                </View>
                <TextInput
                  style={[styles.formInput, Body3]}
                  placeholder="avbd4562536"
                  value={formData.sku}
                  onChangeText={t => setFormData({ ...formData, sku: t })}
                  placeholderTextColor="lightgrey"
                />
              </View>
            </View>

            <View style={styles.formRow}>
              <View style={styles.formCol}>
                <View style={styles.formLabelRow}>
                  <Text style={[styles.formLabel, Body3]}>Barcode</Text>
                </View>
                <TextInput
                  style={[styles.formInput, Body3]}
                  placeholder="avbd4562536"
                  value={formData.barcode}
                  onChangeText={t => setFormData({ ...formData, barcode: t })}
                  placeholderTextColor="lightgrey"
                />
              </View>
              <View style={styles.formCol}>
                <View style={styles.formLabelRow}>
                  <Text style={[styles.formLabel, Body3]}>Select Category</Text>
                </View>
                <TouchableOpacity style={styles.dropdownInput} onPress={handleCategoryPress}>
                  <Text style={[styles.dropdownText, Body3]}>
                    {formData.categoryName || formData.category || 'Select'}
                  </Text>
                  <Image source={ArrowDownIcon} style={styles.dropdownIcon} resizeMode="contain" />
                </TouchableOpacity>
                {showCategoryDropdown && (
                  <View style={[styles.dropdownList, { maxHeight: 200 }]}>
                    <FlatList
                      data={categories}
                      keyExtractor={(cat, i) => (cat._id ? cat._id.toString() : i.toString())}
                      nestedScrollEnabled={true}
                      onEndReached={loadMoreCategories}
                      onEndReachedThreshold={0.5}
                      renderItem={({ item: cat }) => (
                        <TouchableOpacity
                          style={styles.dropdownItem}
                          onPress={() => {
                            setFormData({
                              ...formData,
                              category: cat._id,
                              categoryName: cat.category_name || cat.name,
                            });
                            setShowCategoryDropdown(false);
                          }}
                        >
                          <Text style={[styles.dropdownText, Body3]}>
                            {cat.category_name || cat.name}
                          </Text>
                        </TouchableOpacity>
                      )}
                      ListEmptyComponent={
                        isLoadingCategories ? (
                          <View style={{ padding: 10 }}>
                            <Text style={[Body3, { textAlign: 'center' }]}>Loading...</Text>
                          </View>
                        ) : (
                          <View style={{ padding: 10 }}>
                            <Text style={[Body3, { textAlign: 'center' }]}>
                              No categories found
                            </Text>
                          </View>
                        )
                      }
                      ListFooterComponent={
                        isFetchingMoreCategories ? (
                          <View style={{ padding: 10 }}>
                            <Text style={[Body3, { textAlign: 'center' }]}>Loading more...</Text>
                          </View>
                        ) : null
                      }
                    />
                  </View>
                )}
              </View>
            </View>

            <View style={styles.formRow}>
              <View style={[styles.formCol, styles.zIndexHigh]}>
                <View style={styles.formLabelRow}>
                  <Text style={[styles.formLabel, Body3]}>Status</Text>
                </View>
                <TouchableOpacity
                  style={styles.dropdownInput}
                  onPress={() => setShowStatusDropdown(!showStatusDropdown)}
                >
                  <View
                    style={
                      formData.status === 'Active'
                        ? styles.statusActiveBg2
                        : styles.statusInactiveBg2
                    }
                  >
                    <Text
                      style={[
                        formData.status === 'Active'
                          ? styles.statusActiveText2
                          : styles.statusInactiveText2,
                        Body3,
                      ]}
                    >
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
                          setFormData({ ...formData, status: stat });
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
                <View style={styles.formLabelRow}>
                  <Text style={[styles.formLabel, Body3]}>Price</Text>
                </View>
                <TextInput
                  style={[styles.formInput, Body3]}
                  placeholder="$ 20.00"
                  value={formData.price}
                  onChangeText={t => setFormData({ ...formData, price: t })}
                  keyboardType="numeric"
                  placeholderTextColor="lightgrey"
                />
              </View>
            </View>

            <View style={styles.formRow}>
              <View style={styles.formCol}>
                <View style={styles.formLabelRow}>
                  <Text style={[styles.formLabel, Body3]}>Tax</Text>
                </View>
                <TextInput
                  style={[styles.formInput, Body3]}
                  placeholder="$ 2.00"
                  value={formData.tax}
                  onChangeText={t => setFormData({ ...formData, tax: t })}
                  keyboardType="numeric"
                  placeholderTextColor="lightgrey"
                />
              </View>
              <View style={styles.formCol}>
                <View style={styles.formLabelRow}>
                  <Text style={[styles.formLabel, Body3]}>Qty</Text>
                </View>
                <TextInput
                  style={[styles.formInput, Body3]}
                  placeholder="2000"
                  value={String(formData.qty)}
                  onChangeText={t => setFormData({ ...formData, qty: t })}
                  keyboardType="numeric"
                  placeholderTextColor="lightgrey"
                />
              </View>
            </View>

            <View style={styles.formRow}>
              {/* <View style={styles.formCol}> */}
              {/* <View style={styles.formLabelRow}>
                  <Text style={[styles.formLabel, Body3]}>Discount Title</Text>
                  <Switch
                    value={formData.discountEnabled}
                    onValueChange={val => setFormData({ ...formData, discountEnabled: val })}
                    trackColor={{ false: '#E0E0E0', true: '#4FC3F7' }}
                    thumbColor={Colors.white}
                  />
                </View> */}
              {/* <TextInput
                  style={[styles.formInput, Body3]}
                  placeholder="End of year"
                  value={formData.discountTitle}
                  onChangeText={t => setFormData({ ...formData, discountTitle: t })}
                />
              </View> */}
              {/* <View style={styles.formCol}>
                <View style={styles.formLabelRow}>
                  <Text style={[styles.formLabel, Body3]}>Discount Amount</Text>
                </View>
                <TextInput
                  style={[styles.formInput, Body3]}
                  placeholder="$ 5.00"
                  value={formData.discountAmount}
                  onChangeText={t => setFormData({ ...formData, discountAmount: t })}
                  keyboardType="numeric"
                />
              </View> */}
            </View>

            <View style={styles.formRow}>
              <View style={styles.formCol}>
                <View style={styles.formLabelRow}>
                  <Text style={[styles.formLabel, Body3]}>Product Image</Text>
                </View>
                <TouchableOpacity style={styles.uploadImageContainer} onPress={handleImageUpload}>
                  {formData.image ? (
                    <Image
                      source={{ uri: formData.image }}
                      style={styles.uploadedImage}
                      resizeMode="cover"
                    />
                  ) : (
                    <>
                      <Image
                        source={UploadIcon}
                        style={styles.uploadImageIcon}
                        resizeMode="contain"
                      />
                      <Text style={[styles.uploadImageText, Body3]}>Upload Image</Text>
                      <Text style={[styles.uploadImageSubText, Caption]}>
                        you can upload upto 2MB, Image{'\n'}(JPG, PNG)
                      </Text>
                    </>
                  )}
                </TouchableOpacity>
              </View>
              <View style={styles.formCol}>
                <View style={styles.formLabelRow}>
                  <Text style={[styles.formLabel, Body3]}>Product Description</Text>
                </View>
                <TextInput
                  style={[styles.textAreaInput, Body3]}
                  multiline
                  placeholder="Context description goes here..."
                  value={formData.description}
                  onChangeText={t => setFormData({ ...formData, description: t })}
                  placeholderTextColor="lightgrey"
                />
              </View>
            </View>
          </ScrollView>

          <TouchableOpacity style={styles.catSubmitBtn} onPress={handleSubmit}>
            <Text style={[styles.catSubmitBtnText, Body3]}>
              {formType === 'add' ? 'Add Product' : 'Save Changes'}
            </Text>
            <Text style={styles.catSubmitBtnText}>→</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default ProductFormModal;
