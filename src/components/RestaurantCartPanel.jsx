import React from 'react';
import { View, Text, TouchableOpacity, FlatList, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Subtitle1, Subtitle2, Body3, Overline, H4 } from '../utils/fonts';
import { IconSize16 } from '../utils/IconSizes';
import {
  DeleteIcon,
  TickIcon,
  DollarIcon,
  RefreshICon,
  BuyersIcon,
} from '../assets/Images';
import styles from '../screens/app/TableSelectionScreenStyles';
import { useSelector } from 'react-redux';

const RestaurantCartPanel = ({
  cart,
  updateQty,
  removeItem,
  discountAmount,
  tipAmount,
  total,
  buyerInfo,
  hasQuickSale,
  activeTab,
  setShowTipModal,
  setShowQuickSaleModal,
  setShowBuyerModal,
  setShowProcessModal,
  setShowPaymentModal,
  setSelectedCartItem,
  setShowNoteModal,
  handleCheckTerminalStatus,
  disableActions,
}) => {
  const navigation = useNavigation();
  const { userData } = useSelector(state => state.user);

  return (
    <View style={styles.cartPanel}>
      {/* Top Header */}
      <View style={styles.cartPanelHeaderRow}>
        <Text style={[styles.cartHeaderText, Subtitle1]}>
          {activeTab === 'Take Away' ? 'Take Away' : 'Table #:'}
        </Text>
        <Text style={[styles.cartHeaderText, Subtitle1]}>Cashier: {userData?.employee_name}</Text>
      </View>

      {/* Cart Listing */}
      <View style={styles.cartContent}>
        {cart.length === 0 ? (
          <View style={styles.emptyCart}>
            <Text style={[styles.emptyCartText, H4]}>Cart is empty!</Text>
          </View>
        ) : (
          <FlatList
            data={cart}
            keyExtractor={item => item.id}
            renderItem={({ item }) => (
              <View style={styles.cartItemCard}>
                <View style={styles.flexFull}>
                  <Text style={[Subtitle2, styles.blackTextColor]}>{item.name}</Text>
                  <Text style={[Body3, styles.blackTextColor]}>$ {item.price.toFixed(2)}</Text>
                  {item.note ? (
                    <Text style={[Body3, styles.greyItalicNote]} numberOfLines={1}>
                      Note: {item.note}
                    </Text>
                  ) : null}
                </View>
                <View style={styles.alignFlexEnd}>
                  <TouchableOpacity
                    style={styles.noteButtonStyle}
                    onPress={() => {
                      setSelectedCartItem(item);
                      setShowNoteModal(true);
                    }}
                  >
                    <Text style={[Overline, styles.greyTextColor]}>
                      {item.note ? 'Edit Note' : '+ Note'}
                    </Text>
                  </TouchableOpacity>
                  <View style={styles.rowCentered}>
                    <TouchableOpacity
                      style={[styles.qtyMinusButton, item.qty > 1 && styles.qtyMinusButtonActive]}
                      onPress={() => updateQty(item.id, -1)}
                    >
                      <View style={styles.minusButtonBar} />
                    </TouchableOpacity>
                    <Text style={[Subtitle2, styles.qtyTextStyle]}>
                      {item.qty.toString().padStart(2, '0')}
                    </Text>
                    <TouchableOpacity
                      style={styles.qtyPlusButton}
                      onPress={() => updateQty(item.id, 1)}
                    >
                      <Text style={styles.plusButtonText}>+</Text>
                    </TouchableOpacity>
                  </View>
                </View>
                <TouchableOpacity
                  style={styles.leftMarginSmall}
                  onPress={() => removeItem(item.id)}
                >
                  <Image source={DeleteIcon} style={styles.deleteButtonIcon} />
                </TouchableOpacity>
              </View>
            )}
          />
        )}
      </View>

      {/* Actions Rows */}
      <View style={styles.actionRow}>
        {/* <TouchableOpacity style={styles.actionBtn} onPress={() => setShowDiscountModal(true)}>
          <View style={styles.relativePosition}>
            <Image source={DiscountIcon} style={[IconSize16, styles.actionIcon]} />
            {discountCode.length > 0 && (
              <Image source={TickIcon} style={styles.tickIconSmallOverlay} />
            )}
          </View>
          <Text style={Overline}>Discount</Text>
        </TouchableOpacity> */}
        <TouchableOpacity
          style={[styles.actionBtn, disableActions && styles.halfOpacity]}
          onPress={() => !disableActions && setShowTipModal(true)}
          disabled={disableActions}
        >
          <View style={styles.relativePosition}>
            <Image source={DollarIcon} style={[IconSize16, styles.actionIcon]} />
            {tipAmount !== null && <Image source={TickIcon} style={styles.tickIconSmallOverlay} />}
          </View>
          <Text style={Overline}>Add TIP</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionBtn, disableActions && styles.halfOpacity]}
          onPress={() => !disableActions && setShowQuickSaleModal(true)}
          disabled={disableActions}
        >
          <View style={styles.relativePosition}>
            <Image source={RefreshICon} style={[IconSize16, styles.actionIcon]} />
            {hasQuickSale && <Image source={TickIcon} style={styles.tickIconSmallOverlay} />}
          </View>
          <Text style={Overline}>Quick Sale</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionBtn, disableActions && styles.halfOpacity]}
          onPress={() => !disableActions && setShowBuyerModal(true)}
          disabled={disableActions}
        >
          <View style={styles.relativePosition}>
            <Image source={BuyersIcon} style={[IconSize16, styles.actionIcon]} />
            {buyerInfo !== null && <Image source={TickIcon} style={styles.tickIconSmallOverlay} />}
          </View>
          <Text style={Overline}>Buyer Details</Text>
        </TouchableOpacity>
      </View>

      {/* Total Section */}
      <View style={styles.totalSection}>
        {discountAmount > 0 && (
          <View style={[styles.totalRow, styles.bottomMarginSmall]}>
            <Text style={[Subtitle2, styles.greyTextColor]}>Discount:</Text>
            <Text style={[Subtitle2, styles.redTextColor]}>- $ {discountAmount.toFixed(2)}</Text>
          </View>
        )}
        {tipAmount !== null && parseFloat(tipAmount) > 0 && (
          <View style={[styles.totalRow, styles.bottomMarginSmall]}>
            <Text style={[Subtitle2, styles.greyTextColor]}>Tip:</Text>
            <Text style={[Subtitle2, styles.greenTextColor]}>
              + $ {parseFloat(tipAmount).toFixed(2)}
            </Text>
          </View>
        )}
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Total:</Text>
          <Text style={styles.totalAmount}>$ {total}</Text>
        </View>

        <View style={styles.bottomButtonGroup}>
          <TouchableOpacity
            style={[styles.processBtn, cart.length === 0 && styles.halfOpacity]}
            onPress={() => cart.length > 0 && setShowProcessModal(true)}
            disabled={cart.length === 0}
          >
            <Text style={styles.processBtnText}>Process Order</Text>
          </TouchableOpacity>

          {/* for in future if cancel button functionality added  */}
          {/* <TouchableOpacity
            style={[styles.cancelBtn, cart.length === 0 && styles.halfOpacity]}
            onPress={() => cart.length > 0 && setShowCancelModal(true)}
            disabled={cart.length === 0}
          >
            <Text style={styles.cancelBtnText}>Cancel Order</Text>
          </TouchableOpacity> */}
        </View>

        <TouchableOpacity
          style={[styles.checkoutBtn, cart.length > 0 && styles.darkBlueBg]}
          onPress={() => {
            if (cart.length > 0) {
              if (activeTab === 'Take Away') {
                setShowPaymentModal(true);
              } else {
                navigation.navigate('OrderProcessingScreen', { orderType: activeTab });
              }
            }
            handleCheckTerminalStatus();
          }}
        >
          <Text style={[styles.checkoutBtnText, cart.length > 0 && styles.whiteTextColor]}>
            Proceed to Checkout
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default RestaurantCartPanel;
