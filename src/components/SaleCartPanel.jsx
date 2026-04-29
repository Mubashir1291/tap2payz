import React, { useState, useMemo, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, FlatList, Image, NativeModules } from 'react-native';
import ViewShot from 'react-native-view-shot';
import ReceiptTemplate from './ReceiptTemplate';
import RNFS from 'react-native-fs';
import { Caption, Body2, Body3, Subtitle1, Subtitle2, H4, ButtonText, ButtonTextSmall } from '../utils/fonts';
import { IconSize12, IconSize20, IconSize24, IconSize40, IconSize60 } from '../utils/IconSizes';
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
  WarningIcon,
  PSPIcon,
} from '../assets/Images';
import SwipeableCartItem from './SwipeableCartItem';
import styles from '../screens/app/SaleScreenStyles';

import ConfirmationModal from './ConfirmationModal';
import SuccessModal from './SuccessModal';
import TipModal from './TipModal';
import BuyerInfoModal from './BuyerInfoModal';
import CashPayModal from './CashPayModal';
import TransactionProcessModal from './TransactionProcessModal';
import InvoiceModal from './InvoiceModal';
import TapCardModal from './TapCardModal';
import KitchenInvoiceModal from './KitchenInvoiceModal';
import QuickSaleModal from './QuickSaleModal';
import NfcManager, { NfcTech } from 'react-native-nfc-manager';
import { CREATE_TRANSACTION, GET_INVENTORY_STATUS } from '../services/Transaction';
import { useSelector } from 'react-redux';

const SaleCartPanel = ({ cart, setCart, onAddToCart }) => {
  const [paymentType, setPaymentType] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [tipAmount, setTipAmount] = useState(null);
  const [showTipModal, setShowTipModal] = useState(false);
  const [buyerInfo, setBuyerInfo] = useState(null);
  const [showBuyerModal, setShowBuyerModal] = useState(false);
  const [showCashPayModal, setShowCashPayModal] = useState(false);
  const [showTransactionModal, setShowTransactionModal] = useState(false);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showTapCardModal, setShowTapCardModal] = useState(false);
  const [showKitchenInvoiceModal, setShowKitchenInvoiceModal] = useState(false);
  const [showQuickSaleModal, setShowQuickSaleModal] = useState(false);
  const [transReferenceId, setTransReferenceId] = useState(null);
  const [buyerId, setBuyerId] = useState(null);

  const { PrinterModule } = NativeModules;
  const { deviceId } = useSelector(state => state.device);
  const { store_id, store_name, userData } = useSelector(state => state.user);

  const viewShotRef = useRef();
  const [printing, setPrinting] = useState(false);
  const [paymentInfo, setPaymentInfo] = useState(null);

  const buildTransactionPayload = () => {
    const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

    return {
      transaction: {
        nr: '',
        transID: '',
        transType: paymentType === 'cash' ? 'CASH' : 'CARD',
        transAmntIn: subtotal + (parseFloat(tipAmount) || 0),
        transAmntEx: subtotal,
        vat: 0,
        tipAmount: parseFloat(tipAmount) || 0,
        referenceNumber: transReferenceId,
        transaction_uuid: `${Date.now()}`,
        deviceID: deviceId,
        storeID: store_id,
        discountAmount: 0,
        discountCode: '',
        discountPercentage: 0,
        status: 'Completed',
        buyerID: buyerId,
      },
    };
  };

  const handleCashProceed = async (data) => {
    try {
      const payload = buildTransactionPayload();
      console.log(payload, 'create transaction ');
      const response = await CREATE_TRANSACTION(payload);
      console.log(response, ' Cash process');

      setPaymentInfo({
        method: 'Cash',
        received: data?.amount || payload.transaction.transAmntIn,
        change: data?.change || 0
      });

      setShowCashPayModal(false);
      setShowSuccessModal(true);
    } catch (error) {
      console.log(error, 'Transaction Error');
    }
  };

  const handlePrintReceipt = async () => {
    try {
      setPrinting(true);

      if (!PrinterModule || !viewShotRef.current) {
        throw new Error('Printer not ready');
      }

      // Wait for render
      await new Promise(res => setTimeout(res, 500));

      // Capture image
      const uri = await viewShotRef.current.capture();
      const path = uri.replace('file://', '');
      const base64Image = await RNFS.readFile(path, 'base64');

      // Prevent crash (large image)
      if (base64Image.length > 2000000) {
        throw new Error('Receipt too large');
      }

      await PrinterModule.printFun({
        logoBase64: base64Image,
        content: "\n"
      });

    } catch (error) {
      console.log('PRINT ERROR:', error);
      Toast.show({
        type: 'error',
        text1: 'Print Error',
        text2: error?.message || 'Could not print receipt',
      });
    } finally {
      setPrinting(false);
    }
  };

  const handleGetInventoryStatus = async () => {
    try {
      const products = cart.map(item => {
        if (item.id && item.id.startsWith('quick_')) {
          return {
            quickSale: true,
            product_name: item.name,
            quantity: item.qty,
            price: item.price,
          };
        }
        return {
          pid: item._id || item.productId || item.id,
          quantity: item.qty,
        };
      });

      const payload = {
        transactionType: 'CASH', // If payment type is CARD then use trncType SALE
        products: products,
        sale_store: store_id,
        deviceID: deviceId,
      };
      // console.log(payload, 'payloaddddddddddddd');
      const response = await GET_INVENTORY_STATUS(payload);
      setTransReferenceId(response?.transaction?.referenceNumber);
      console.log(response, 'Inventory Status');
      return true; // Successfully verified
    } catch (error) {
      console.log(error, 'Inventory Status Error');
      return false; // Stop the flow if inventory check fails
    }
  };

  useEffect(() => {
    let timer;
    if (showSuccessModal) {
      timer = setTimeout(() => {
        setShowSuccessModal(false);
        setShowInvoiceModal(true);
      }, 2000);
    }
    return () => clearTimeout(timer);
  }, [showSuccessModal]);

  useEffect(() => {
    let timer;
    if (showTransactionModal) {
      timer = setTimeout(() => {
        setShowTransactionModal(false);
        setShowSuccessModal(true);
      }, 2000);
    }
    return () => clearTimeout(timer);
  }, [showTransactionModal]);

  const onRemoveFromCart = id => {
    const existing = cart.find(c => (c.id || c._id) === id);
    if (existing.qty === 1) {
      setCart(cart.filter(c => (c.id || c._id) !== id));
    } else {
      setCart(cart.map(c => ((c.id || c._id) === id ? { ...c, qty: c.qty - 1 } : c)));
    }
  };

  const onDeleteFromCart = id => {
    setCart(cart.filter(c => (c.id || c._id) !== id));
  };

  const total = useMemo(() => {
    const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
    return (subtotal + (parseFloat(tipAmount) || 0)).toFixed(2);
  }, [cart, tipAmount]);

  const hasQuickSale = useMemo(() => {
    return cart.some(
      item =>
        item.id?.toString().startsWith('quick_') || item.productId?.toString().startsWith('quick_'),
    );
  }, [cart]);

  const handleClearCart = () => {
    if (cart.length === 0) {
      return;
    }
    setShowDeleteModal(true);
  };

  const confirmDeleteCart = () => {
    setCart([]);
    setTipAmount(null);
    setBuyerInfo(null);
    setPaymentType(null);
    setTransReferenceId(null);
    setBuyerId(null);
    setShowDeleteModal(false);
  };

  const handleOpenTipModal = () => {
    setShowTipModal(true);
  };

  const handleAddTip = amount => {
    setTipAmount(amount);
    setShowTipModal(false);
  };

  const handleSaveTip = amount => {
    setTipAmount(amount);
    setShowTipModal(false);
  };

  const handleDeleteTip = () => {
    setTipAmount(null);
    setShowTipModal(false);
  };

  const handleOpenBuyerModal = () => {
    setShowBuyerModal(true);
  };

  const handleAddBuyerInfo = info => {
    setBuyerInfo(info);
    setShowBuyerModal(false);
  };

  const handleSaveBuyerInfo = info => {
    setBuyerInfo(info);
    setShowBuyerModal(false);
  };

  const handleDeleteBuyerInfo = () => {
    setBuyerInfo(null);
    setShowBuyerModal(false);
  };

  const handlePlaceOrder = async () => {
    if (cart.length === 0) {
      return;
    }

    // Check inventory status before proceeding
    const isInventoryAvailable = await handleGetInventoryStatus();
    if (!isInventoryAvailable) {
      return; // Halts the order if inventory status check fails
    }

    if (paymentType === 'cash') {
      setShowCashPayModal(true);
    } else if (paymentType === 'card') {
      setShowTapCardModal(true);
      try {
        await NfcManager.start();
        await NfcManager.requestTechnology(NfcTech.Ndef); // Use NfcTech.IsoDep if you are reading standard EMV Credit Cards

        setShowTapCardModal(false);
        setPaymentInfo({
          method: 'Card',
          received: total,
          change: 0
        });
        setShowTransactionModal(true);
      } catch {
        setShowTapCardModal(false);
      } finally {
        NfcManager.cancelTechnologyRequest();
      }
    }
  };

  const handleCloseInvoice = () => {
    setShowInvoiceModal(false);
    setCart([]);
    setTipAmount(null);
    setBuyerInfo(null);
    setPaymentType(null);
    setTransReferenceId(null);
    setBuyerId(null);
  };

  // ReceiptTemplate replaces RenderPrintView

  const handleQuickSale = ({ name, price }) => {
    const quickItem = {
      id: `quick_${Date.now()}`,
      name,
      price,
      category: 'Quick Sale',
    };
    onAddToCart(quickItem);
    setShowQuickSaleModal(false);
  };

  return (
    <View style={styles.cartPanel}>
      <ReceiptTemplate
        ref={viewShotRef}
        cart={cart}
        storeName={store_name}
        cashierName={userData?.employee_name}
        orderId={transReferenceId?.slice(-6).toUpperCase()}
        subtotal={cart.reduce((sum, item) => sum + item.price * item.qty, 0)}
        total={total}
        tipAmount={tipAmount}
        paymentInfo={paymentInfo}
      />
      {/* Cart Header Icons */}
      <View style={styles.cartHeader}>
        {/* <TouchableOpacity onPress={() => setShowKitchenInvoiceModal(true)}>
          <Image source={RefreshICon} style={[IconSize20, styles.cartHeaderIcon]} />
        </TouchableOpacity>
        <TouchableOpacity>
          <Image source={ChipIcon} style={[IconSize20, styles.cartHeaderIcon]} />
        </TouchableOpacity> */}
        <TouchableOpacity onPress={handleClearCart}>
          <Image source={DeleteIcon} style={[IconSize24, styles.cartHeaderIcon]} />
        </TouchableOpacity>
      </View>

      {cart.length === 0 ? (
        <View style={styles.emptyCart}>
          <Text style={[styles.emptyCartText, H4]}>Shopping Cart is empty!</Text>
        </View>
      ) : (
        <FlatList
          data={cart}
          keyExtractor={(item, index) => item.id || item._id || index.toString()}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <SwipeableCartItem onDelete={() => onDeleteFromCart(item.id || item._id)}>
              <View style={styles.cartItem}>
                <View>
                  <Text style={[styles.cartItemName, Subtitle2]}>{item.name}</Text>
                  <Text style={[styles.cartItemPrice, Body3]}>
                    $ {item.price} x {item.qty}
                  </Text>
                </View>

                <View style={styles.qtyControls}>
                  <TouchableOpacity
                    onPress={() => onRemoveFromCart(item.id || item._id)}
                    style={styles.qtyBtn}
                  >
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
        <TouchableOpacity style={styles.actionBtn} onPress={() => setShowQuickSaleModal(true)}>
          <View style={styles.tipIconContainer}>
            <Image source={DiscountIcon} style={[IconSize12, styles.actionIcon]} />
            {hasQuickSale && <Image source={TickIcon} style={styles.tickIcon} />}
          </View>
          <Text style={[styles.actionLabelText, Caption]}>Quick Sale</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionBtn} onPress={handleOpenTipModal}>
          <View style={styles.tipIconContainer}>
            <Image source={DollarIcon} style={[IconSize12, styles.actionIcon]} />
            {tipAmount !== null && <Image source={TickIcon} style={styles.tickIcon} />}
          </View>
          <Text style={[styles.actionLabelText, Caption]}>Add TIP</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionBtn} onPress={handleOpenBuyerModal}>
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
            onPress={() => setPaymentType('cash')}
          >
            <Image source={CashIcon} style={[IconSize24, styles.paymentIcon]} />
            <Text style={[styles.paymentBtnText, Subtitle2]}>Cash Pay</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.paymentBtn, paymentType === 'card' && styles.activePayment]}
            onPress={() => setPaymentType('card')}
          >
            <Image source={CardIcon} style={[IconSize24, styles.paymentIcon]} />
            <Text style={[styles.paymentBtnText, Subtitle2]}>Card Pay</Text>
          </TouchableOpacity>
        </View>



        <TouchableOpacity style={styles.placeOrderBtn} onPress={handlePlaceOrder}>
          <Text style={[styles.placeOrderText, ButtonText]}>Place Order</Text>
        </TouchableOpacity>
      </View>

      <ConfirmationModal
        visible={showDeleteModal}
        icon={WarningIcon}
        iconStyle={IconSize40}
        subtitle="Are you sure you want to clear cart?"
        confirmText="Yes, Clear"
        confirmButtonColor="#E74C3C"
        onConfirm={confirmDeleteCart}
        onCancel={() => setShowDeleteModal(false)}
      />

      <TipModal
        visible={showTipModal}
        isEditMode={tipAmount !== null}
        initialTipAmount={tipAmount}
        onAddTip={handleAddTip}
        onSaveTip={handleSaveTip}
        onDeleteTip={handleDeleteTip}
        onClose={() => setShowTipModal(false)}
      />

      <BuyerInfoModal
        visible={showBuyerModal}
        isEditMode={buyerInfo !== null}
        initialBuyerInfo={buyerInfo}
        onAddInfo={handleAddBuyerInfo}
        onSaveInfo={handleSaveBuyerInfo}
        onDeleteInfo={handleDeleteBuyerInfo}
        onClose={() => setShowBuyerModal(false)}
        setBuyerId={setBuyerId}
      />

      <CashPayModal
        visible={showCashPayModal}
        totalAmount={parseFloat(total)}
        onProceed={handleCashProceed}
        onClose={() => setShowCashPayModal(false)}
      />

      <TransactionProcessModal
        visible={showTransactionModal}
        onClose={() => setShowTransactionModal(false)}
      />

      <SuccessModal
        visible={showSuccessModal}
        title="Payment Successful"
        message="Your payment has been processed successfully."
        onClose={() => {
          setShowSuccessModal(false);
          setShowInvoiceModal(true);
        }}
      />

      <InvoiceModal
        visible={showInvoiceModal}
        buyerInfo={buyerInfo}
        cartItems={cart}
        totalAmount={parseFloat(total)}
        tipAmount={tipAmount}
        onPrintReceipt={async () => {
          await handlePrintReceipt();
          handleCloseInvoice();
        }}
        onClose={handleCloseInvoice}
      />

      <QuickSaleModal
        visible={showQuickSaleModal}
        onAddSale={handleQuickSale}
        onClose={() => setShowQuickSaleModal(false)}
      />

      <KitchenInvoiceModal
        visible={showKitchenInvoiceModal}
        cartItems={cart}
        onClose={() => setShowKitchenInvoiceModal(false)}
      />

      <TapCardModal visible={showTapCardModal} />
    </View>
  );
};

export default SaleCartPanel;
