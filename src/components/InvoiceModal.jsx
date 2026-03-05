import React from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  Image,
  ScrollView,
  StyleSheet,
} from 'react-native';
import {Colors} from '../utils/Colors';
import {S, VS, MS} from '../utils/Responsive';
import {H4, H3, Body2, Subtitle1, Subtitle2, ButtonText} from '../utils/fonts';
import {PSPIcon, PrinterIcon} from '../assets/Images';

const InvoiceModal = ({
  visible = false,
  buyerInfo = null,
  cartItems = [],
  totalAmount = 0,
  onPrintReceipt,
  onClose,
}) => {
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.container}>
          {/* Close Button */}
          <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
            <Text style={[styles.closeBtnText, Subtitle2]}>✕</Text>
          </TouchableOpacity>

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}>
            {/* Title */}
            <Text style={[styles.mainTitle, H3]}>Transaction Successful!</Text>

            {/* Invoice Card */}
            <View style={styles.invoiceCard}>
              {/* PSP Logo */}
              <Image source={PSPIcon} style={styles.pspLogo} />

              {/* Buyer Info */}
              {buyerInfo && (
                <View style={styles.buyerSection}>
                  {(buyerInfo.firstName || buyerInfo.lastName) && (
                    <View style={styles.infoRow}>
                      <Text style={[styles.infoLabel, Body2]}>Buyer Name</Text>
                      <Text style={[styles.infoValue, Subtitle2]}>
                        {`${buyerInfo.firstName || ''} ${buyerInfo.lastName || ''}`.trim()}
                      </Text>
                    </View>
                  )}
                  {buyerInfo.email ? (
                    <View style={styles.infoRow}>
                      <Text style={[styles.infoLabel, Body2]}>Email</Text>
                      <Text style={[styles.infoValue, Subtitle2]}>{buyerInfo.email}</Text>
                    </View>
                  ) : null}
                  {buyerInfo.phone ? (
                    <View style={styles.infoRow}>
                      <Text style={[styles.infoLabel, Body2]}>Phone</Text>
                      <Text style={[styles.infoValue, Subtitle2]}>{buyerInfo.phone}</Text>
                    </View>
                  ) : null}
                </View>
              )}

              {/* Dashed Divider */}
              <View style={styles.dashedDivider} />

              {/* Cart Items */}
              <View style={styles.itemsSection}>
                {cartItems.map((item, index) => (
                  <View key={`${item.id}-${index}`} style={styles.itemRow}>
                    <Text style={[styles.itemName, Body2]}>
                      {item.name} ({item.qty})
                    </Text>
                    <Text style={[styles.itemPrice, Subtitle2]}>
                      ${(item.price * item.qty).toFixed(2)}
                    </Text>
                  </View>
                ))}
              </View>

              {/* Solid Divider */}
              <View style={styles.solidDivider} />

              {/* Total */}
              <View style={styles.totalRow}>
                <Text style={[styles.totalLabel, Subtitle1]}>Total</Text>
                <Text style={[styles.totalValue, {color: Colors.primary}, Subtitle1]}>
                  ${totalAmount.toFixed(2)}
                </Text>
              </View>
            </View>

          </ScrollView>

          {/* Print Receipt Button */}
          <TouchableOpacity style={styles.printBtn} onPress={onPrintReceipt}>
            <Text style={[styles.printBtnText, ButtonText]}>Print Receipt</Text>
            <Image source={PrinterIcon} style={styles.printIcon} />
          </TouchableOpacity>
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
    width: '45%',
    maxHeight: '85%',
    backgroundColor: Colors.white,
    borderRadius: MS(20),
    padding: MS(32),
    position: 'relative',
  },
  scrollContent: {
    alignItems: 'center',
  },
  mainTitle: {
    textAlign: 'center',
    color: Colors.black,
    marginBottom: VS(16),
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
  invoiceCard: {
    width: '100%',
    backgroundColor: '#F8F9FB',
    borderRadius: MS(14),
    padding: MS(20),
    marginBottom: VS(20),
  },
  pspLogo: {
    width: S(80),
    height: VS(40),
    resizeMode: 'contain',
    alignSelf: 'center',
    marginBottom: VS(14),
  },
  buyerSection: {
    marginBottom: VS(10),
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: VS(4),
  },
  infoLabel: {
    color: Colors.grey,
  },
  infoValue: {
    color: Colors.black,
  },
  dashedDivider: {
    borderBottomWidth: 1.5,
    borderBottomColor: Colors.lightGrey,
    borderStyle: 'dashed',
    marginVertical: VS(10),
  },
  itemsSection: {
    marginBottom: VS(4),
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: VS(6),
  },
  itemName: {
    color: Colors.black,
  },
  itemPrice: {
    color: Colors.black,
    textAlign: 'right',
  },
  solidDivider: {
    borderBottomWidth: 1.5,
    borderBottomColor: Colors.black,
    marginVertical: VS(8),
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: VS(4),
  },
  totalLabel: {
    color: Colors.black,
  },
  totalValue: {
    color: Colors.primary,
  },
  printBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    paddingVertical: VS(14),
    borderRadius: MS(12),
    backgroundColor: '#00BFFF',
  },
  printBtnText: {
    color: Colors.white,
    marginRight: S(8),
  },
  printIcon: {
    width: S(18),
    height: VS(18),
    resizeMode: 'contain',
    tintColor: Colors.white,
  },
});

export default InvoiceModal;
