import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, TextInput, Image, Modal } from 'react-native';
import { H1, Body3, Caption } from '../utils/fonts';
import { UploadIcon, ArrowDownIcon } from '../assets/Images';
import styles from '../screens/app/InventoryManagementStyles';
import { useSelector } from 'react-redux';
import { CREATE_CATEGORY, UPDATE_CATEGORY } from '../services/ProductService';
import { launchImageLibrary } from 'react-native-image-picker';
import Toast from 'react-native-toast-message';

const CategoryFormModal = ({ visible, onClose, formType, initialData, onSubmit }) => {
  const { store_id, business_id } = useSelector(state => state.user);
  const [catFormData, setCatFormData] = useState({
    _id: null,
    category_name: '',
    status: 'Active',
    category_image: null,
    store: store_id || '',
    business_id: business_id || '',
  });
  const [showCatStatusDropdown, setShowCatStatusDropdown] = useState(false);

  useEffect(() => {
    if (initialData) {
      setCatFormData({
        _id: initialData.id || initialData._id,
        category_name: initialData.name || '',
        status: initialData.status || 'Active',
        category_image: initialData.image || null,
        store: store_id || '',
        business_id: business_id || '',
      });
    } else {
      setCatFormData({
        _id: null,
        category_name: '',
        status: 'Active',
        category_image: null,
        store: store_id || '',
        business_id: business_id || '',
      });
    }
  }, [initialData, visible, store_id, business_id]);

  const payload = {
    category_name: catFormData.category_name || '',
    status: catFormData.status || 'Active',
    category_image: catFormData.category_image || null,
    business_id: catFormData.business_id || '',
    store: catFormData.store || '',
  };

  const handleImageUpload = () => {
    launchImageLibrary({ mediaType: 'photo', quality: 0.8 }, response => {
      if (response.didCancel || response.errorMessage) {
        return;
      }
      if (response.assets && response.assets.length > 0) {
        setCatFormData({ ...catFormData, category_image: response.assets[0].uri });
      }
    });
  };

  const handleCreateCategory = async () => {
    try {
      const response = await CREATE_CATEGORY(payload);
      if (response) {
        Toast.show({
          type: 'success',
          text1: 'Success',
          text2: 'Category created successfully',
        });
        onSubmit(payload);
        onClose();
      }
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: error?.message || 'Failed to create category',
      });
    }
  };

  const handleUpdateCategory = async () => {
    try {
      const response = await UPDATE_CATEGORY(catFormData._id, payload);
      if (response) {
        Toast.show({
          type: 'success',
          text1: 'Success',
          text2: 'Category updated successfully',
        });
        onSubmit(payload);
        onClose();
      }
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: error?.message || 'Failed to update category',
      });
    }
  };

  const handleSubmit = () => {
    if (formType === 'add') {
      handleCreateCategory();
    } else {
      handleUpdateCategory();
    }
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <View style={styles.catModalContent}>
          <TouchableOpacity style={styles.modalCloseBtn} onPress={onClose}>
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
            <TouchableOpacity style={styles.catUploadContainer} onPress={handleImageUpload}>
              {catFormData.category_image ? (
                <>
                  <Image
                    source={{ uri: catFormData.category_image }}
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
                  value={catFormData.category_name}
                  onChangeText={t => setCatFormData({ ...catFormData, category_name: t })}
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
                  <Image source={ArrowDownIcon} style={styles.dropdownIcon} resizeMode="contain" />
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

            <TouchableOpacity style={styles.catSubmitBtn} onPress={handleSubmit}>
              <Text style={[styles.catSubmitBtnText, Body3]}>
                {formType === 'add' ? 'Add Category' : 'Save Changes'}
              </Text>
              <Text style={styles.catSubmitBtnText}>→</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

export default CategoryFormModal;
