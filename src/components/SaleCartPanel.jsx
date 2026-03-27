import React from 'react';
import { View, Text, TouchableOpacity, FlatList, Image } from 'react-native';
import { Caption, Body2, Body3, Subtitle1, Subtitle2, H4, ButtonText } from '../utils/fonts';
import { IconSize12, IconSize20, IconSize24 } from '../utils/IconSizes';
import {
  CashIcon,
  CardIcon,
  DeleteIcon,
  RefreshICon,
  ChipIcon,
  DiscountIcon,
  DollarIcon,
  BuyersIcon,
  TickIcon,
} from '../assets/Images';
import SwipeableCartItem from './SwipeableCartItem';
import styles from '../screens/app/SaleScreenStyles';

const SaleCartPanel = ({
  cart,
  tipAmount,
  buyerInfo,
  total,
  paymentType,
  onAddToCart,
  onRemoveFromCart,
  onDeleteFromCart,
  onClearCart,
  onOpenTipModal,
  onOpenBuyerModal,
  onOpenQuickSaleModal,
  onOpenKitchenInvoiceModal,
  onSetPaymentType,
  onPlaceOrder,
}) => {
  return (
    <View style={styles.cartPanel}>
      {/* Cart Header Icons */}
      <View style={styles.cartHeader}>
        <TouchableOpacity onPress={onOpenKitchenInvoiceModal}>
          <Image source={RefreshICon} style={[IconSize20, styles.cartHeaderIcon]} />
        </TouchableOpacity>
        <TouchableOpacity>
          <Image source={ChipIcon} style={[IconSize20, styles.cartHeaderIcon]} />
        </TouchableOpacity>
        <TouchableOpacity onPress={onClearCart}>
          <Image source={DeleteIcon} style={[IconSize20, styles.cartHeaderIcon]} />
        </TouchableOpacity>
      </View>

      {cart.length === 0 ? (
        <View style={styles.emptyCart}>
          <Text style={[styles.emptyCartText, H4]}>Shopping Cart is empty!</Text>
        </View>
      ) : (
        <FlatList
          data={cart}
          keyExtractor={item => item.id}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <SwipeableCartItem onDelete={() => onDeleteFromCart(item.id)}>
              <View style={styles.cartItem}>
                <View>
                  <Text style={[styles.cartItemName, Subtitle2]}>{item.name}</Text>
                  <Text style={[styles.cartItemPrice, Body3]}>
                    $ {item.price} x {item.qty}
                  </Text>
                </View>

                <View style={styles.qtyControls}>
                  <TouchableOpacity onPress={() => onRemoveFromCart(item.id)} style={styles.qtyBtn}>
                    <Text style={[styles.qtyBtnText, ButtonText]}>−</Text>
                  </TouchableOpacity>

                  <Text style={[styles.qtyText, Body2]}>{item.qty}</Text>

                  <TouchableOpacity onPress={() => onAddToCart(item)} style={styles.qtyBtn}>
                    <Text style={[styles.qtyBtnText, ButtonText]}>+</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </SwipeableCartItem>
          )}
        />
      )}

      {/* Action Buttons */}
      <View style={styles.actionRow}>
        <TouchableOpacity style={styles.actionBtn} onPress={onOpenQuickSaleModal}>
          <Image source={DiscountIcon} style={[IconSize12, styles.actionIcon]} />
          <Text style={[styles.actionLabelText, Caption]}>Quick Sale</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionBtn} onPress={onOpenTipModal}>
          <View style={styles.tipIconContainer}>
            <Image source={DollarIcon} style={[IconSize12, styles.actionIcon]} />
            {tipAmount !== null && <Image source={TickIcon} style={styles.tickIcon} />}
          </View>
          <Text style={[styles.actionLabelText, Caption]}>Add TIP</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionBtn} onPress={onOpenBuyerModal}>
          <View style={styles.tipIconContainer}>
            <Image source={BuyersIcon} style={[IconSize12, styles.actionIcon]} />
            {buyerInfo !== null && <Image source={TickIcon} style={styles.tickIcon} />}
          </View>
          <Text style={[styles.actionLabelText, Caption]}>Buyer Details</Text>
        </TouchableOpacity>
      </View>

      {/* Total Section */}
      <View style={styles.totalSection}>
        {tipAmount !== null && parseFloat(tipAmount) > 0 && (
          <View style={[styles.totalRow, styles.tipRowMargin]}>
            <Text style={[styles.totalLabel, Subtitle2, styles.tipLabelColor]}>Tip:</Text>
            <Text style={[styles.totalAmount, Subtitle2, styles.tipAmountColor]}>
              + CAD {parseFloat(tipAmount).toFixed(2)}
            </Text>
          </View>
        )}
        <View style={styles.totalRow}>
          <Text style={[styles.totalLabel, Subtitle1]}>Total</Text>
          <Text style={[styles.totalAmount, H4]}>CAD {total}</Text>
        </View>

        <View style={styles.paymentRow}>
          <TouchableOpacity
            style={[styles.paymentBtn, paymentType === 'cash' && styles.activePayment]}
            onPress={() => onSetPaymentType('cash')}
          >
            <Image source={CashIcon} style={[IconSize24, styles.paymentIcon]} />
            <Text style={[styles.paymentBtnText, Subtitle2]}>Cash Pay</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.paymentBtn, paymentType === 'card' && styles.activePayment]}
            onPress={() => onSetPaymentType('card')}
          >
            <Image source={CardIcon} style={[IconSize24, styles.paymentIcon]} />
            <Text style={[styles.paymentBtnText, Subtitle2]}>Card Pay</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.placeOrderBtn} onPress={onPlaceOrder}>
          <Text style={[styles.placeOrderText, ButtonText]}>Place Order</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default SaleCartPanel;
