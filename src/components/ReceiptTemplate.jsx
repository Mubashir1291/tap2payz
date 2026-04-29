import React, { forwardRef } from 'react';
import { View, Text, Image } from 'react-native';
import ViewShot from 'react-native-view-shot';
import { PSPIcon } from '../assets/Images';
import { IconSize60 } from '../utils/IconSizes';

const ReceiptTemplate = forwardRef(({
  cart = [],
  storeName = '',
  cashierName = 'N/A',
  orderId = 'N/A',
  orderType = '',
  subtotal = 0,
  total = 0,
  discountAmount = 0,
  tipAmount = 0,
  paymentInfo = null
}, ref) => {
  const dateStr = new Date().toLocaleDateString('en-GB');
  const timeStr = new Date().toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <View style={{ position: 'absolute', left: -1000, top: -1000 }}>
      <ViewShot ref={ref} options={{ format: 'png', quality: 1 }}>
        <View style={{ width: 384, backgroundColor: '#fff', padding: 25 }}>

          {/* HEADER */}
          <View style={{ alignItems: 'center', marginBottom: 10 }}>
            <Image source={PSPIcon} style={IconSize60} />
            <Text style={{ fontSize: 56, fontWeight: 'bold', marginBottom: 10 }}>PSP POS</Text>
          </View>

          <View style={{ borderBottomWidth: 1, marginVertical: 10 }} />

          <View style={{ marginBottom: 10 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5 }}>
              <Text style={{ fontSize: 28, fontWeight: '400' }}>Store:</Text>
              <Text style={{ fontSize: 28, fontWeight: '400' }}>{storeName}</Text>
            </View>
            {orderType ? (
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5 }}>
                <Text style={{ fontSize: 28, fontWeight: '400' }}>Order Type:</Text>
                <Text style={{ fontSize: 28, fontWeight: '400' }}>{orderType}</Text>
              </View>
            ) : null}
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5 }}>
              <Text style={{ fontSize: 28, fontWeight: '400' }}>DATE:</Text>
              <Text style={{ fontSize: 28, fontWeight: '400' }}>{dateStr}</Text>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5 }}>
              <Text style={{ fontSize: 28, fontWeight: '400' }}>TIME:</Text>
              <Text style={{ fontSize: 28, fontWeight: '400' }}>{timeStr}</Text>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5 }}>
              <Text style={{ fontSize: 28, fontWeight: '400' }}>CASHIER:</Text>
              <Text style={{ fontSize: 28, fontWeight: '400' }}>{cashierName}</Text>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5 }}>
              <Text style={{ fontSize: 28, fontWeight: '400' }}>ORDER:</Text>
              <Text style={{ fontSize: 28, fontWeight: '400' }}>#{orderId}</Text>
            </View>
          </View>

          <View style={{ borderBottomWidth: 1, marginVertical: 10 }} />

          {/* ITEMS HEADER */}
          <View style={{ flexDirection: 'row' }}>
            <Text style={{ flex: 1, fontSize: 22, fontWeight: 'bold' }}>ITEM</Text>
            <Text style={{ width: 60, textAlign: 'center', fontSize: 22, fontWeight: 'bold' }}>QTY</Text>
            <Text style={{ width: 100, textAlign: 'right', fontSize: 22, fontWeight: 'bold' }}>TOTAL</Text>
          </View>

          {/* ITEMS */}
          {cart.map((item, index) => (
            <View key={index} style={{ flexDirection: 'row' }}>
              <Text style={{ flex: 1, fontSize: 22, fontWeight: '400' }}>{item.name}</Text>
              <Text style={{ width: 60, textAlign: 'center', fontSize: 22, fontWeight: '400' }}>
                {item.qty}
              </Text>
              <Text style={{ width: 100, textAlign: 'right', fontSize: 22, fontWeight: '400' }}>
                $ {(item.price * item.qty).toFixed(2)}
              </Text>
            </View>
          ))}

          <View style={{ borderBottomWidth: 1, marginVertical: 10 }} />

          {/* TOTALS */}
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5 }}>
            <Text style={{ fontSize: 28, fontWeight: '400' }}>Subtotal:</Text>
            <Text style={{ fontSize: 28, fontWeight: '400' }}>$ {parseFloat(subtotal).toFixed(2)}</Text>
          </View>

          {discountAmount > 0 && (
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5 }}>
              <Text style={{ fontSize: 28, fontWeight: '400' }}>Discount:</Text>
              <Text style={{ fontSize: 28, fontWeight: '400' }}>$ {(-discountAmount).toFixed(2)}</Text>
            </View>
          )}

          {parseFloat(tipAmount) > 0 && (
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5 }}>
              <Text style={{ fontSize: 28, fontWeight: '400' }}>Tip:</Text>
              <Text style={{ fontSize: 28, fontWeight: '400' }}>$ {parseFloat(tipAmount).toFixed(2)}</Text>
            </View>
          )}

          <View style={{ borderBottomWidth: 1, marginVertical: 10 }} />

          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <Text style={{ fontSize: 32, fontWeight: 'bold' }}>TOTAL</Text>
            <Text style={{ fontSize: 32, fontWeight: 'bold' }}>
              $ {total}
            </Text>
          </View>

          {/* PAYMENT INFO */}
          {paymentInfo?.method && (
            <>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5 }}>
                <Text style={{ fontSize: 28, fontWeight: '400' }}>Payment Method:</Text>
                <Text style={{ fontSize: 28, fontWeight: '400' }}>{paymentInfo.method}</Text>
              </View>
              {paymentInfo.method === 'Cash' && (
                <>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5 }}>
                    <Text style={{ fontSize: 28, fontWeight: '400' }}>Cash Received:</Text>
                    <Text style={{ fontSize: 28, fontWeight: '400' }}>$ {parseFloat(paymentInfo.received || 0).toFixed(2)}</Text>
                  </View>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5 }}>
                    <Text style={{ fontSize: 28, fontWeight: '400' }}>Change:</Text>
                    <Text style={{ fontSize: 28, fontWeight: '400' }}>$ {parseFloat(paymentInfo.change || 0).toFixed(2)}</Text>
                  </View>
                </>
              )}
            </>
          )}

          <View style={{ borderBottomWidth: 1, marginVertical: 10 }} />

          {/* FOOTER */}
          <Text style={{ textAlign: 'center', fontWeight: 'bold', fontSize: 28 }}>
            Thank you for your Order!
          </Text>

        </View>
      </ViewShot>
    </View>
  );
});

export default ReceiptTemplate;
