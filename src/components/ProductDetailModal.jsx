import React from 'react';
import { View, Text, TouchableOpacity, Image, Modal, ScrollView, StyleSheet } from 'react-native';
import { H1, Body3, Subtitle2 } from '../utils/fonts';
import { EditCircleIcon, DeleteCircleIcon } from '../assets/Images';
import styles from '../screens/app/InventoryManagementStyles';
import { SvgUri } from 'react-native-svg';

const ProductDetailModal = ({ visible, onClose, product, onEdit, onDelete }) => {
  if (!product) { return null; }

  const renderImage = () => {
    const uri = product.product_image || product.image;
    if (uri) {
      if (uri.endsWith('.svg')) {
        return <SvgUri style={styles.detailLargeImage} uri={uri} />;
      }
      return <Image source={{ uri }} style={styles.detailLargeImage} />;
    }
    return <View style={[styles.detailLargeImage, styles.emptyImageBg]} />;
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.modalOverlay}>
        <View style={styles.detailModalContent}>
          <TouchableOpacity style={styles.modalCloseBtn} onPress={onClose}>
            <Text style={styles.modalCloseText}>✕</Text>
          </TouchableOpacity>

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.detailScrollContent}
          >
            <Text style={[H1, styles.detailModalTitle]}>Product Detail</Text>

            <View style={styles.detailMainRow}>
              {/* Product Image */}
              <View style={styles.detailImageContainer}>{renderImage()}</View>

              {/* Product Info */}
              <View style={styles.detailInfoContainer}>
                <View style={styles.detailHeaderRow}>
                  <Text style={[H1, styles.detailProductName]}>
                    {product.product_name || product.name}
                  </Text>
                  <View style={styles.detailActionButtons}>
                    <TouchableOpacity style={styles.detailEditBtn} onPress={() => onEdit(product)}>
                      <Image
                        source={EditCircleIcon}
                        style={[styles.detailActionIcon, localStyles.whiteTint]}
                      />
                      <Text style={styles.detailEditBtnText}>Edit Product</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.detailDeleteBtn}
                      onPress={() => onDelete(product)}
                    >
                      <Image
                        source={DeleteCircleIcon}
                        style={[styles.detailActionIcon, localStyles.redTint]}
                      />
                      <Text style={styles.detailDeleteBtnText}>Delete Product</Text>
                    </TouchableOpacity>
                  </View>
                </View>

                <View style={styles.detailGrid}>
                  <View style={styles.detailGridCol}>
                    <Text style={[Subtitle2, styles.detailLabel]}>SKU Code:</Text>
                    <Text style={[Body3, styles.detailValue]}>
                      {product.sku_code || product.sku || 'N/A'}
                    </Text>
                  </View>
                  <View style={styles.detailGridCol}>
                    <Text style={[Subtitle2, styles.detailLabel]}>Barcode:</Text>
                    <Text style={[Body3, styles.detailValue]}>
                      {product.bar_code || product.barcode || 'N/A'}
                    </Text>
                  </View>
                </View>

                <View style={[styles.detailGrid, localStyles.gridMarginBottom]}>
                  <View style={styles.detailGridCol}>
                    <Text style={[Subtitle2, styles.detailLabel]}>Category:</Text>
                    <Text style={[Body3, styles.detailValue]}>
                      {product.category?.category_name || product.categoryName || 'N/A'}
                    </Text>
                  </View>
                </View>

                <View style={styles.detailGrid}>
                  <View style={styles.detailGridCol}>
                    <Text style={[Subtitle2, styles.detailLabel]}>Sub Category:</Text>
                    <Text style={[Body3, styles.detailValue]}>
                      {product.sub_category_name || 'Leather Jacket'}
                    </Text>
                  </View>
                  <View style={styles.detailGridCol}>
                    <Text style={[Subtitle2, styles.detailLabel]}>Discount:</Text>
                    <Text style={[Body3, styles.detailValue]}>
                      {product.discount || 'End of Year ($ 5.00)'}
                    </Text>
                  </View>
                </View>

                <View style={styles.detailSummaryRow}>
                  <View style={styles.detailSummaryItem}>
                    <Text style={[Subtitle2, styles.detailLabel]}>Status:</Text>
                    <Text style={[Body3, styles.detailValue]}>{product.status || 'Active'}</Text>
                  </View>
                  <View style={styles.detailSummaryItem}>
                    <Text style={[Subtitle2, styles.detailLabel]}>Price:</Text>
                    <Text style={[Body3, styles.detailValue]}>
                      $ {product.price || product.product_price || '0.00'}
                    </Text>
                  </View>
                  <View style={styles.detailSummaryItem}>
                    <Text style={[Subtitle2, styles.detailLabel]}>Tax:</Text>
                    <Text style={[Body3, styles.detailValue]}>
                      $ {product.product_tax || '0.00'}
                    </Text>
                  </View>
                  <View style={styles.detailSummaryItem}>
                    <Text style={[Subtitle2, styles.detailLabel]}>Qty:</Text>
                    <Text style={[Body3, styles.detailValue]}>
                      {product.quantity || product.qty || '0'}
                    </Text>
                  </View>
                </View>
              </View>
            </View>

            <View style={styles.detailDescriptionSection}>
              <Text style={[Subtitle2, styles.detailDescriptionTitle]}>Product Description</Text>
              <Text style={[Body3, styles.detailDescriptionText]}>
                {product.product_description || product.description || 'No description available.'}
              </Text>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const localStyles = StyleSheet.create({
  whiteTint: {
    tintColor: 'white',
  },
  redTint: {
    tintColor: '#E53935',
  },
  gridMarginBottom: {
    marginBottom: 24,
  },
});

export default ProductDetailModal;
