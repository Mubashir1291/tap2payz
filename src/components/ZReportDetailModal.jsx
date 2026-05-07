import React from 'react';
import { View, Text, Modal, TouchableOpacity, ScrollView, StyleSheet, Image } from 'react-native';
import { Colors } from '../utils/Colors';
import { S, VS, MS } from '../utils/Responsive';
import { H4, Body3, Subtitle1, Subtitle2 } from '../utils/fonts';
import { PrinterIcon, Tap2PayLogo } from '../assets/Images';

const ZReportDetailModal = ({ visible = false, reportData = null, onClose }) => {
  if (!reportData) {
    return null;
  }

  return (
    <Modal animationType="fade" transparent={true} visible={visible} onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.modalContent}>
          {/* Close Button */}
          <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
            <Text style={[styles.closeBtnText, Subtitle2]}>✕</Text>
          </TouchableOpacity>
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.receiptScrollContent}
          >
            <Text style={[styles.title, H4]}>Z - Report</Text>

            <View style={styles.logoContainer}>
              <Image
                source={Tap2PayLogo}
                style={styles.logo}
              />
            </View>

            {/* Store Information */}
            <View style={styles.section}>
              <View style={styles.row}>
                <Text style={[styles.label, Body3]}>Store Name:</Text>
                <Text style={[styles.value, Subtitle2]}>
                  {reportData.details?.store?.name || 'N/A'}
                </Text>
              </View>
              <View style={styles.row}>
                <Text style={[styles.label, Body3]}>Phone no:</Text>
                <Text style={[styles.value, Subtitle2]}>
                  {reportData.details?.store?.phone || 'N/A'}
                </Text>
              </View>
              <View style={styles.row}>
                <Text style={[styles.label, Body3]}>Address:</Text>
                <Text style={[styles.value, Subtitle2]}>
                  {reportData.details?.store?.address || 'N/A'}
                </Text>
              </View>
            </View>

            <View style={styles.divider} />

            {/* Sale Payments */}
            <Text style={[styles.sectionTitle, Subtitle1]}>Sale Payments</Text>
            <View style={styles.section}>
              <View style={styles.row}>
                <Text style={[styles.label, Body3]}>Register</Text>
                <Text style={[styles.value, Subtitle2]}>Cash Register</Text>
              </View>
              <View style={styles.row}>
                <Text style={[styles.label, Body3]}>Report Date</Text>
                <Text style={[styles.value, Subtitle2]}>
                  {reportData.openedAt?.replace('\n', ' ')}
                </Text>
              </View>
              <View style={styles.row}>
                <Text style={[styles.label, Body3]}>Opening Balance</Text>
                <Text style={[styles.value, Subtitle2]}>{reportData.openAmount}</Text>
              </View>
              <View style={styles.row}>
                <Text style={[styles.label, Body3]}>Opened at</Text>
                <Text style={[styles.value, Subtitle2]}>
                  {reportData.openedAt?.replace('\n', ' ')}
                </Text>
              </View>
              <View style={styles.row}>
                <Text style={[styles.label, Body3]}>Opened by</Text>
                <Text style={[styles.value, Subtitle2]}>{reportData.opener}</Text>
              </View>
              <View style={styles.row}>
                <Text style={[styles.label, Body3]}>Closed at</Text>
                <Text style={[styles.value, Subtitle2]}>
                  {reportData.closedAt?.replace('\n', ' ')}
                </Text>
              </View>
              <View style={styles.row}>
                <Text style={[styles.label, Body3]}>Closed by</Text>
                <Text style={[styles.value, Subtitle2]}>{reportData.closer}</Text>
              </View>
            </View>

            <View style={styles.divider} />

            {/* Refund Payments */}
            {/* <Text style={[styles.sectionTitle, Subtitle1]}>Refund Payments</Text>
            <View style={styles.section}>
              <View style={styles.row}>
                <Text style={[styles.label, Body3]}>Total Refund</Text>
                <Text style={[styles.value, Subtitle2]}>{reportData.details?.total_refund ? `$ ${reportData.details.total_refund.toLocaleString()}` : '$ 0.00'}</Text>
              </View>
            </View> */}

            <View style={styles.divider} />

            {/* Tendered Payments */}
            <Text style={[styles.sectionTitle, Subtitle1]}>Tendered Payments</Text>
            <View style={styles.section}>
              <View style={styles.row}>
                <Text style={[styles.label, Body3]}>Cash</Text>
                <Text style={[styles.value, Subtitle2]}>
                  {reportData.details?.expected_in_drawer?.cash
                    ? `$ ${reportData.details.expected_in_drawer.cash.toLocaleString()}`
                    : '$ 0.00'}
                </Text>
              </View>
              <View style={styles.row}>
                <Text style={[styles.label, Body3]}>Card</Text>
                <Text style={[styles.value, Subtitle2]}>
                  {reportData.details?.expected_in_drawer?.card
                    ? `$ ${reportData.details.expected_in_drawer.card.toLocaleString()}`
                    : '$ 0.00'}
                </Text>
              </View>
              <View style={styles.row}>
                <Text style={[styles.label, Body3]}>Total Tendered</Text>
                <Text style={[styles.value, Subtitle2]}>
                  {reportData.closeAmount !== '________' ? reportData.closeAmount : '$ 0.00'}
                </Text>
              </View>
            </View>

            <View style={styles.divider} />

            {/* Total */}
            <View style={styles.section}>
              <View style={styles.row}>
                <Text style={[styles.totalLabel, Subtitle1]}>Total</Text>
                <Text style={[styles.totalValue, Subtitle1]}>
                  {reportData.closeAmount !== '________' ? reportData.closeAmount : '$ 0.00'}
                </Text>
              </View>
            </View>
          </ScrollView>

          {/* Action Buttons */}
          <View style={styles.actionButtonsContainer}>
            <TouchableOpacity style={styles.printBtn}>
              <Text style={[styles.btnText, Subtitle2, styles.whiteText]}>Print</Text>
              <Image source={PrinterIcon} style={[styles.btnIcon, styles.whiteTint]} />
            </TouchableOpacity>

            <TouchableOpacity style={styles.downloadBtn}>
              <Text style={[styles.btnText, Subtitle2, { ...styles.downloadText }]}>Download</Text>
              <Text style={styles.downloadBtnText}>➤</Text>
            </TouchableOpacity>
          </View>
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
  closeBtn: {
    position: 'absolute',
    top: VS(16),
    right: S(16),
    zIndex: 10,
    width: S(32),
    height: VS(32),
    borderRadius: MS(16),
    backgroundColor: Colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  closeBtnText: {
    color: Colors.grey,
  },
  modalContent: {
    width: '40%',
    maxHeight: '90%',
    backgroundColor: '#F3F4F6',
    borderRadius: MS(20),
    padding: MS(28),
  },
  receiptScrollContent: {
    paddingBottom: VS(12),
  },
  title: {
    textAlign: 'center',
    color: Colors.black,
    marginBottom: VS(16),
  },
  logo: {
    width: S(120),
    height: VS(80),
    resizeMode: 'contain',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: VS(24),
  },
  logoPlaceholder: {
    width: S(60),
    height: S(60),
    borderRadius: S(30),
    backgroundColor: '#FFB89E',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoText: {
    color: Colors.black,
  },
  section: {
    marginBottom: VS(12),
  },
  sectionTitle: {
    color: Colors.black,
    textAlign: 'center',
    marginBottom: VS(12),
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: VS(8),
  },
  label: {
    color: Colors.grey,
  },
  value: {
    color: Colors.black,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.lightGrey,
    marginVertical: VS(16),
  },
  totalLabel: {
    color: Colors.black,
  },
  totalValue: {
    color: '#3B4B8A',
  },
  whiteText: {
    color: Colors.white,
  },
  whiteTint: {
    tintColor: Colors.white,
  },
  actionButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginTop: VS(20),
    gap: MS(16),
  },
  printBtn: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#38CBFF',
    paddingVertical: VS(14),
    borderRadius: MS(8),
  },
  downloadBtn: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#BECDFF',
    paddingVertical: VS(14),
    borderRadius: MS(8),
  },
  downloadText: {
    color: '#16192C',
  },
  downloadBtnText: {
    marginLeft: S(4),
    color: '#16192C',
    fontSize: MS(16),
  },
  btnText: {
    marginRight: S(8),
  },
  btnIcon: {
    width: S(16),
    height: S(16),
  },
});

export default ZReportDetailModal;
