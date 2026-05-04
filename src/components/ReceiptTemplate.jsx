import React, { forwardRef } from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import ViewShot from 'react-native-view-shot';
import { Tap2PayLogo } from '../assets/Images';

const ReceiptTemplate = forwardRef(
  (
    {
      cart = [],
      storeName = '',
      cashierName = 'N/A',
      orderId = 'N/A',
      orderType = '',
      subtotal = 0,
      total = 0,
      discountAmount = 0,
      tipAmount = 0,
      paymentInfo = null,
      copyType = '',
    },
    ref,
  ) => {
    const dateStr = new Date().toLocaleDateString('en-GB');
    const timeStr = new Date().toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });

    return (
      <View style={styles.container}>
        <ViewShot ref={ref} options={{ format: 'png', quality: 1 }}>
          <View style={styles.receiptWrapper}>
            {/* HEADER */}
            <View style={styles.headerContainer}>
              <Image source={Tap2PayLogo} style={styles.logo} />
            </View>

            <View style={styles.divider} />

            <View style={styles.infoSection}>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Store:</Text>
                <Text style={styles.infoValue}>{storeName}</Text>
              </View>
              {orderType ? (
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Order Type:</Text>
                  <Text style={styles.infoValue}>{orderType}</Text>
                </View>
              ) : null}
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>DATE:</Text>
                <Text style={styles.infoValue}>{dateStr}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>TIME:</Text>
                <Text style={styles.infoValue}>{timeStr}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>CASHIER:</Text>
                <Text style={styles.infoValue}>{cashierName}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>ORDER:</Text>
                <Text style={styles.infoValue}>#{orderId}</Text>
              </View>
            </View>

            <View style={styles.divider} />

            {/* ITEMS HEADER */}
            <View style={styles.itemsHeader}>
              <Text style={[styles.itemHeaderText, styles.flex1]}>ITEM</Text>
              <Text style={[styles.itemHeaderText, styles.qtyColumn]}>QTY</Text>
              <Text style={[styles.itemHeaderText, styles.totalColumn]}>TOTAL</Text>
            </View>

            {/* ITEMS */}
            {cart.map((item, index) => (
              <View key={index} style={styles.itemRow}>
                <Text style={[styles.itemText, styles.flex1]}>{item.name}</Text>
                <Text style={[styles.itemText, styles.qtyColumn]}>{item.qty}</Text>
                <Text style={[styles.itemText, styles.totalColumn]}>
                  $ {(item.price * item.qty).toFixed(2)}
                </Text>
              </View>
            ))}

            <View style={styles.divider} />

            {/* TOTALS */}
            <View style={styles.totalsRow}>
              <Text style={styles.totalsLabel}>Subtotal:</Text>
              <Text style={styles.totalsValue}>$ {parseFloat(subtotal).toFixed(2)}</Text>
            </View>

            {discountAmount > 0 && (
              <View style={styles.totalsRow}>
                <Text style={styles.totalsLabel}>Discount:</Text>
                <Text style={styles.totalsValue}>$ {(-discountAmount).toFixed(2)}</Text>
              </View>
            )}

            {parseFloat(tipAmount) > 0 && (
              <View style={styles.totalsRow}>
                <Text style={styles.totalsLabel}>Tip:</Text>
                <Text style={styles.totalsValue}>$ {parseFloat(tipAmount).toFixed(2)}</Text>
              </View>
            )}

            <View style={styles.divider} />

            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>TOTAL</Text>
              <Text style={styles.totalLabel}>$ {total}</Text>
            </View>

            {/* PAYMENT INFO */}
            {paymentInfo?.method && (
              <>
                <View style={styles.totalsRow}>
                  <Text style={styles.totalsLabel}>Payment Method:</Text>
                  <Text style={styles.totalsValue}>{paymentInfo.method}</Text>
                </View>
                {paymentInfo.method === 'Cash' && (
                  <>
                    <View style={styles.totalsRow}>
                      <Text style={styles.totalsLabel}>Cash Received:</Text>
                      <Text style={styles.totalsValue}>
                        $ {parseFloat(paymentInfo.received || 0).toFixed(2)}
                      </Text>
                    </View>
                    <View style={styles.totalsRow}>
                      <Text style={styles.totalsLabel}>Change:</Text>
                      <Text style={styles.totalsValue}>
                        $ {parseFloat(paymentInfo.change || 0).toFixed(2)}
                      </Text>
                    </View>
                  </>
                )}
              </>
            )}

            <View style={styles.divider} />

            {/* FOOTER */}
            <Text style={styles.thankYouText}>Thank you for your Order!</Text>
            {copyType ? <Text style={styles.copyTypeText}>{copyType}</Text> : null}
          </View>
        </ViewShot>
      </View>
    );
  },
);

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: -1000,
    top: -1000,
  },
  receiptWrapper: {
    width: 384,
    backgroundColor: '#fff',
    padding: 25,
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: 10,
  },
  logo: {
    width: 200,
    height: 120,
    resizeMode: 'contain',
    tintColor: '#000',
  },
  divider: {
    borderBottomWidth: 1,
    marginVertical: 10,
  },
  infoSection: {
    marginBottom: 10,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  infoLabel: {
    fontSize: 28,
    fontWeight: '400',
  },
  infoValue: {
    fontSize: 28,
    fontWeight: '400',
  },
  itemsHeader: {
    flexDirection: 'row',
  },
  itemHeaderText: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  flex1: {
    flex: 1,
  },
  qtyColumn: {
    width: 60,
    textAlign: 'center',
  },
  totalColumn: {
    width: 100,
    textAlign: 'right',
  },
  itemRow: {
    flexDirection: 'row',
  },
  itemText: {
    fontSize: 22,
    fontWeight: '400',
  },
  totalsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  totalsLabel: {
    fontSize: 28,
    fontWeight: '400',
  },
  totalsValue: {
    fontSize: 28,
    fontWeight: '400',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  totalLabel: {
    fontSize: 32,
    fontWeight: 'bold',
  },
  thankYouText: {
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 28,
  },
  copyTypeText: {
    textAlign: 'center',
    fontSize: 20,
    marginTop: 10,
  },
});

export default ReceiptTemplate;
