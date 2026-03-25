import React from 'react';
import { View, Text, Modal, TouchableOpacity, Image, ScrollView, StyleSheet } from 'react-native';
import { Colors } from '../utils/Colors';
import { S, VS, MS } from '../utils/Responsive';
import { H4, Subtitle1, Subtitle2, Caption } from '../utils/fonts';
import { ImageFrameIcon } from '../assets/Images';

const SalesRefundDetailModal = ({
  visible = false,
  type = 'sale', // 'sale' or 'refund'
  transaction = null,
  onClose,
}) => {
  if (!transaction) {
    return null;
  }

  const title = type === 'refund' ? 'Refund Details' : 'Sales Details';

  return (
    <Modal animationType="fade" transparent={true} visible={visible} onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.container}>
          {/* Close Button */}
          <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
            <Text style={[styles.closeBtnText, Subtitle2]}>✕</Text>
          </TouchableOpacity>

          <ScrollView showsVerticalScrollIndicator={false}>
            {/* Title */}
            <Text style={[styles.title, H4]}>{title}</Text>

            {/* Transaction Detail Card */}
            <View style={styles.detailCard}>
              <Text style={[styles.detailTitle, Subtitle1]}>Transaction Detail:</Text>
              <View style={styles.detailGrid}>
                <View style={styles.detailCol}>
                  <Text style={[styles.detailLabel, Caption]}>Serial Number:</Text>
                  <Text style={[styles.detailValue, Subtitle2]}>{transaction.serialNumber}</Text>
                </View>
                <View style={styles.detailCol}>
                  <Text style={[styles.detailLabel, Caption]}>Transaction Number:</Text>
                  <Text style={[styles.detailValue, Subtitle2]}>
                    {transaction.transactionNumber}
                  </Text>
                </View>
                <View style={[styles.detailCol, styles.detailColBorder]}>
                  <Text style={[styles.detailLabel, Caption]}>Customer:</Text>
                  <Text style={[styles.detailValue, Subtitle2]}>{transaction.customer}</Text>
                </View>
                <View style={styles.detailCol}>
                  <Text style={[styles.detailLabel, Caption]}>Total Items:</Text>
                  <Text style={[styles.detailValue, Subtitle2]}>
                    {transaction.totalItems} Items
                  </Text>
                </View>
                <View style={[styles.detailCol, styles.detailColBorder]}>
                  <Text style={[styles.detailLabel, Caption]}>By Date & Time:</Text>
                  <Text style={[styles.detailValue, Subtitle2]}>{transaction.dateTime}</Text>
                </View>
                <View style={styles.detailCol}>
                  <Text style={[styles.detailLabel, Caption]}>
                    Total {type === 'refund' ? 'refund' : 'sales'}:
                  </Text>
                  <Text style={[styles.detailValue, Subtitle2]}>${transaction.totalSales}</Text>
                </View>
              </View>
            </View>

            {/* Purchased Items */}
            <Text style={[styles.purchasedTitle, Subtitle1]}>Purchased Items:</Text>
            <View style={styles.itemsGrid}>
              {transaction.items.map((item, index) => (
                <View key={index} style={styles.itemCard}>
                  <Image source={ImageFrameIcon} style={styles.itemImage} />
                  <View style={styles.itemInfo}>
                    <Text style={[styles.itemName, Subtitle2]}>{item.name}</Text>
                    <Text style={[styles.itemSku, Caption]}>SKU: {item.sku}</Text>
                    <Text style={[styles.itemQty, Caption]}>
                      Qty: {item.qty < 10 ? `0${item.qty}` : item.qty}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  container: {
    width: '60%',
    maxHeight: '85%',
    backgroundColor: Colors.white,
    borderRadius: MS(20),
    padding: MS(28),
    position: 'relative',
  },
  closeBtn: {
    position: 'absolute',
    top: VS(14),
    right: S(14),
    zIndex: 10,
    width: S(28),
    height: VS(28),
    borderRadius: MS(14),
    backgroundColor: '#F5F7FA',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeBtnText: {
    color: Colors.grey,
  },
  title: {
    textAlign: 'center',
    color: Colors.black,
    marginBottom: VS(16),
  },
  detailCard: {
    backgroundColor: '#F8F9FB',
    borderRadius: MS(14),
    padding: MS(16),
    marginBottom: VS(16),
  },
  detailTitle: {
    color: Colors.black,
    marginBottom: VS(12),
  },
  detailGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  detailCol: {
    width: '33.33%',
    paddingVertical: VS(4),
    paddingHorizontal: S(4),
  },
  detailColBorder: {
    borderLeftWidth: 1,
    borderLeftColor: Colors.lightGrey,
  },
  detailLabel: {
    color: Colors.grey,
    marginBottom: VS(2),
  },
  detailValue: {
    color: Colors.black,
  },
  purchasedTitle: {
    color: Colors.black,
    marginBottom: VS(12),
  },
  itemsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: MS(10),
  },
  itemCard: {
    width: '31%',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.lightGrey,
    borderRadius: MS(12),
    padding: MS(10),
  },
  itemImage: {
    width: S(40),
    height: VS(40),
    resizeMode: 'contain',
    opacity: 0.4,
    marginRight: S(10),
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    color: Colors.black,
  },
  itemSku: {
    color: Colors.grey,
  },
  itemQty: {
    color: Colors.grey,
  },
});

export default SalesRefundDetailModal;
