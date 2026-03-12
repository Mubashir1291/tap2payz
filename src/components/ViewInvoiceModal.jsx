import React from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  FlatList,
  Image,
} from 'react-native';
import { H1, H4, Subtitle1, Subtitle2, Body3, Caption, Body2 } from '../utils/fonts';
import { Colors } from '../utils/Colors';
import { IconSize16 } from '../utils/IconSizes';
import { PrinterIcon } from '../assets/Images';
import { StyleSheet } from 'react-native';
import { MS, S, VS } from '../utils/Responsive';

const dummyInvoiceItems = [
  { id: '1', no: '01', item: 'Sodavand (25cl)', qty: '01', price: '8.00', totals: '8.00' },
  { id: '2', no: '02', item: 'Sodavand (25cl)', qty: '01', price: '8.00', totals: '8.00' },
];

const ViewInvoiceModal = ({ visible, onClose, orderNumber = '5660' }) => {
  const renderItem = ({ item }) => (
    <View style={styles.tableRow}>
      <View style={styles.colNo}>
        <Text style={[styles.rowText, Body3]}>{item.no}</Text>
      </View>
      <View style={styles.colItem}>
        <Text style={[styles.rowText, Body3]}>{item.item}</Text>
      </View>
      <View style={styles.colQty}>
        <Text style={[styles.rowText, Body3]}>{item.qty}</Text>
      </View>
      <View style={styles.colPrice}>
        <Text style={[styles.rowText, Body3]}>$ {item.price}</Text>
      </View>
      <View style={styles.colTotals}>
        <Text style={[styles.rowText, Body3]}>$ {item.totals}</Text>
      </View>
    </View>
  );

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          {/* Close Button */}
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeText}>✕</Text>
          </TouchableOpacity>

          {/* Header */}
          <View style={styles.headerRow}>
            <Text style={[styles.titleText, H1]}>Invoice</Text>
            <Text style={[styles.orderTitle, H4]}>Order #{orderNumber}</Text>
          </View>

          {/* Info Section */}
          <View style={styles.infoSection}>
            <View style={styles.infoLeft}>
              <Text style={[styles.infoTextList, Body3]}>ETA Transact</Text>
              <Text style={[styles.infoTextList, Body3]}>400 Applewood Crescent Suite 200</Text>
              <Text style={[styles.infoTextList, Body3]}>Opens at 10:15 AM - Closed at 04:15 PM</Text>
              <Text style={[styles.infoTextList, Body3]}>
                <Text style={styles.infoLabel}>Waiter: </Text>
                <Text style={styles.infoValue}>None</Text>
              </Text>
            </View>
            <View style={styles.infoRight}>
              <Text style={[styles.infoTextList, Body3]}>
                <Text style={styles.infoLabel}>Table Details: </Text>
                <Text style={styles.infoValue}>134</Text>
              </Text>
              <Text style={[styles.infoTextList, Body3]}>
                <Text style={styles.infoLabel}>No of Peoples: </Text>
                <Text style={styles.infoValue}>04</Text>
              </Text>
              <Text style={[styles.infoTextList, Body3]}>
                <Text style={styles.infoLabel}>Order Date: </Text>
                <Text style={styles.infoValue}>30 Apr 2024, 04:06 PM</Text>
              </Text>
              <Text style={[styles.infoTextList, Body3]}>
                <Text style={styles.infoLabel}>Transaction Type: </Text>
                <Text style={styles.infoValue}>Cash</Text>
              </Text>
            </View>
          </View>

          {/* Order Summary Header */}
          <View style={styles.summaryHeaderRow}>
            <Text style={[styles.summaryTitle, Subtitle1]}>Order Summary</Text>
            <View style={styles.statusBadge}>
              <View style={styles.statusDot} />
              <Text style={Body2}>In Processing</Text>
            </View>
          </View>
          <Text style={[styles.summarySubtitle, Body3]}>All Items here cannot be deleted.</Text>

          {/* Table Header */}
          <View style={styles.tableHeader}>
            <View style={styles.colNo}>
              <Text style={[styles.headerText, Caption]}>#</Text>
            </View>
            <View style={styles.colItem}>
              <Text style={[styles.headerText, Caption]}>Item</Text>
            </View>
            <View style={styles.colQty}>
              <Text style={[styles.headerText, Caption]}>Quantity</Text>
            </View>
            <View style={styles.colPrice}>
              <Text style={[styles.headerText, Caption]}>Price</Text>
            </View>
            <View style={styles.colTotals}>
              <Text style={[styles.headerText, Caption]}>Totals</Text>
            </View>
          </View>

          {/* Items List */}
          <FlatList
            data={dummyInvoiceItems}
            keyExtractor={item => item.id}
            renderItem={renderItem}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
          />

          {/* Totals Section */}
          <View style={styles.totalsSection}>
            <View style={styles.totalsRow}>
              <Text style={[styles.totalsLabel, Body3]}>Tip:</Text>
              <Text style={[styles.totalsValue, Body3]}>$ 8.00</Text>
            </View>
            <View style={styles.totalsRow}>
              <Text style={[styles.totalsLabel, Body3]}>Promotion:</Text>
              <Text style={[styles.totalsValue, Body3]}>$ 8.00</Text>
            </View>
            <View style={styles.totalsRow}>
              <Text style={[styles.totalsLabel, Body3]}>Subtotal:</Text>
              <Text style={[styles.totalsValue, Body3]}>$ 8.00</Text>
            </View>
            <View style={styles.totalsRow}>
              <Text style={[styles.totalsLabel, Body3]}>Tax:</Text>
              <Text style={[styles.totalsValue, Body3]}>$ 1.04</Text>
            </View>

            <View style={styles.grandTotalRow}>
              <Text style={[styles.grandTotalLabel, Subtitle1]}>Total:</Text>
              <Text style={[styles.grandTotalValue, H4]}>$ 9.04</Text>
            </View>
            
            <TouchableOpacity style={styles.printBtn}>
              <Text style={styles.printBtnText}>Print Bill</Text>
              <Image source={PrinterIcon} style={[IconSize16, styles.printIcon]} />
            </TouchableOpacity>
          </View>
          
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '75%',
    backgroundColor: Colors.white,
    borderRadius: MS(16),
    padding: MS(15),
    maxHeight: '98%',
  },

  // ─── Header ───
  closeButton: {
    alignSelf: 'flex-end',
    borderWidth: 1,
    borderColor: '#eee',
    borderRadius: MS(90),
    height: MS(26),
    width: MS(26),
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: VS(5),
  },
  closeText: {
    color: '#888',
    fontSize: MS(12),
  },

  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: VS(24),
    // marginTop: VS(-10),
  },
  titleText: {
    color: '#333',
    fontWeight: 'bold',
  },
  orderTitle: {
    color: '#333',
    fontWeight: 'bold',
  },

  // ─── Info Section ───
  infoSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: VS(24),
  },
  infoLeft: {
    flex: 1,
  },
  infoRight: {
    flex: 1,
    alignItems: 'flex-end',
  },
  infoTextList: {
    color: '#666',
    marginBottom: VS(6),
  },
  infoLabel: {
    fontWeight: 'normal',
  },
  infoValue: {
    fontWeight: 'bold',
    color: '#444',
  },

  // ─── Order Summary Section ───
  summaryHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: VS(12),
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    paddingTop: VS(16),
  },
  summaryTitle: {
    color: '#333',
    fontWeight: 'bold',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F7E7CE', // Light beige/orange tint
    paddingHorizontal: S(12),
    paddingVertical: VS(6),
    borderRadius: MS(16),
    borderWidth: 1,
    borderColor: '#E8D0AA',
  },
  statusDot: {
    width: MS(8),
    height: MS(8),
    borderRadius: MS(4),
    backgroundColor: '#C8933A', // Matches processing color
    marginRight: S(6),
  },
  statusText: {
    color: '#666',
    fontSize: MS(10),
  },
  summarySubtitle: {
    color: '#777',
    marginBottom: VS(16),
  },

  // ─── Items Table ───
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#F9F9F9',
    paddingVertical: VS(12),
    paddingHorizontal: S(16),
    borderRadius: MS(8),
    marginBottom: VS(8),
  },
  colNo: { flex: 0.5 },
  colItem: { flex: 2 },
  colQty: { flex: 1, alignItems: 'center' },
  colPrice: { flex: 1, alignItems: 'center' },
  colTotals: { flex: 1, alignItems: 'flex-end' },
  
  headerText: {
    color: '#555',
    fontWeight: 'bold',
  },

  listContent: {
    paddingBottom: VS(16),
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    paddingVertical: VS(16),
    paddingHorizontal: S(16),
  },
  rowText: {
    color: '#555',
  },

  // ─── Bottom Totals Section ───
  totalsSection: {
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    paddingTop: VS(16),
    marginTop: VS(16),
  },
  totalsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: VS(8),
  },
  totalsLabel: {
    color: '#555',
    fontWeight: '600',
  },
  totalsValue: {
    color: '#333',
    fontWeight: '600',
  },
  grandTotalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: VS(8),
    alignItems: 'center',
  },
  grandTotalLabel: {
    color: '#555',
  },
  grandTotalValue: {
    color: '#333',
    fontWeight: 'bold',
  },

  // ─── Print Button ───
  printBtn: {
    flexDirection: 'row',
    backgroundColor: '#36469A',
    alignSelf: 'flex-start',
    paddingHorizontal: S(24),
    paddingVertical: VS(12),
    borderRadius: MS(8),
    marginTop: VS(8),
    alignItems: 'center',
  },
  printBtnText: {
    color: Colors.white,
    marginRight: S(8),
    fontWeight: '600',
  },
  printIcon: {
    tintColor: Colors.white,
  },
});

export default ViewInvoiceModal;
