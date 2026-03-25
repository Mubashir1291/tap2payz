import React, { useState, useMemo, useRef, useEffect } from 'react';
import { View, Text, StatusBar, TouchableOpacity, FlatList, Image, ScrollView } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import {
  Subtitle1,
  Subtitle2,
  Body3,
  ButtonText,
  Overline,
  H2,
  ButtonTextSmall,
} from '../../utils/fonts';
import { IconSize12, IconSize16, IconSize20, IconSize24, IconSize40 } from '../../utils/IconSizes';
import {
  LeftArrowIcon,
  RightArrowIcon,
  DiscountIcon,
  DollarIcon,
  BuyersIcon,
  DeleteIcon,
  ImageFrameIcon,
  RefreshICon,
  SplitIcon,
  TickIcon,
  CancelOrderIcon,
} from '../../assets/Images';
import styles from './OrderProcessingScreenStyles';
import TipModal from '../../components/TipModal';
import BuyerInfoModal from '../../components/BuyerInfoModal';
import QuickSaleModal from '../../components/QuickSaleModal';
import ProcessOrderModal from '../../components/ProcessOrderModal';
import ConfirmationModal from '../../components/ConfirmationModal';
import SuccessModal from '../../components/SuccessModal';
import CartNoteModal from '../../components/CartNoteModal';
import DiscountModal from '../../components/DiscountModal';
import PaymentMethodModal from '../../components/PaymentMethodModal';
import InvoiceModal from '../../components/InvoiceModal';
import TransactionProcessModal from '../../components/TransactionProcessModal';
import TapCardModal from '../../components/TapCardModal';
import NfcManager, { NfcTech } from 'react-native-nfc-manager';

const categories = [
  { name: 'Beverages', icon: ImageFrameIcon },
  { name: 'Appetizer', icon: ImageFrameIcon },
  { name: 'Drinks', icon: ImageFrameIcon },
  { name: 'Chicken', icon: ImageFrameIcon },
  { name: 'Whiskey', icon: ImageFrameIcon },
  { name: 'Wine', icon: ImageFrameIcon },
  { name: 'Beef', icon: ImageFrameIcon },
];

const dummyProducts = [
  { id: '1', name: 'Sodavand (25cl)', price: 16.23 },
  { id: '2', name: 'Sodavand (25cl)', price: 16.23 },
  { id: '3', name: 'Sodavand (25cl)', price: 16.23 },
  { id: '4', name: 'Sodavand (25cl)', price: 16.23 },
  { id: '5', name: 'Sodavand (25cl)', price: 16.23 },
  { id: '6', name: 'Sodavand (25cl)', price: 16.23 },
  // ... more
];

const OrderProcessingScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { tableNumber, orderType, isNewOrder } = route.params || {
    tableNumber: '7',
    orderType: 'Dine in',
    isNewOrder: false,
  };

  const [selectedCategory, setSelectedCategory] = useState('Beverages');
  const [cart, setCart] = useState(
    isNewOrder
      ? []
      : [
          { id: 'c1', name: 'Sodavand (25cl)', price: 35.0, qty: 2, note: '' },
          { id: 'c2', name: 'Sodavand (25cl)', price: 35.0, qty: 2, note: '' },
          { id: 'c3', name: 'Sodavand (25cl)', price: 35.0, qty: 2, note: '' },
        ],
  );

  const [tipAmount, setTipAmount] = useState(null);
  const [showTipModal, setShowTipModal] = useState(false);
  const [buyerInfo, setBuyerInfo] = useState(null);
  const [showBuyerModal, setShowBuyerModal] = useState(false);
  const [showQuickSaleModal, setShowQuickSaleModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showProcessModal, setShowProcessModal] = useState(false);
  const [showNoteModal, setShowNoteModal] = useState(false);
  const [showDiscountModal, setShowDiscountModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [showTransactionModal, setShowTransactionModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [selectedCartItem, setSelectedCartItem] = useState(null);
  const [showTapCardModal, setShowTapCardModal] = useState(false);

  useEffect(() => {
    if (isNewOrder) {
      setCart([]);
      setTipAmount(null);
      setDiscountAmount(0);
      setDiscountCode('');
      setBuyerInfo(null);
    } else {
      setCart([
        { id: 'c1', name: 'Sodavand (25cl)', price: 35.0, qty: 2, note: '' },
        { id: 'c2', name: 'Sodavand (25cl)', price: 35.0, qty: 2, note: '' },
        { id: 'c3', name: 'Sodavand (25cl)', price: 35.0, qty: 2, note: '' },
      ]);
      setTipAmount(null);
      setDiscountAmount(0);
      setDiscountCode('');
      setBuyerInfo(null);
    }
  }, [isNewOrder, tableNumber]);

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
  const [discountCode, setDiscountCode] = useState('');
  const [discountAmount, setDiscountAmount] = useState(0);

  const categoryScrollRef = useRef(null);
  const scrollOffset = useRef(0);

  const addToCart = product => {
    setCart(prev => {
      const existing = prev.find(item => item.productId === product.id);
      if (existing) {
        return prev.map(item =>
          item.productId === product.id ? { ...item, qty: item.qty + 1 } : item,
        );
      }
      return [
        ...prev,
        {
          id: `c_${Date.now()}_${product.id}`,
          productId: product.id,
          name: product.name,
          price: product.price,
          qty: 1,
          note: '',
        },
      ];
    });
  };

  const updateQty = (id, delta) => {
    setCart(prev =>
      prev.map(item => (item.id === id ? { ...item, qty: Math.max(1, item.qty + delta) } : item)),
    );
  };

  const removeItem = id => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const subtotal = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  }, [cart]);

  const total = useMemo(() => {
    return (subtotal - discountAmount + (parseFloat(tipAmount) || 0)).toFixed(2);
  }, [subtotal, discountAmount, tipAmount]);

  const hasQuickSale = useMemo(() => {
    return cart.some(item => item.productId?.toString().startsWith('quick_'));
  }, [cart]);

  // Modals Handlers
  const handleOpenTipModal = () => setShowTipModal(true);
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

  const handleOpenBuyerModal = () => setShowBuyerModal(true);
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

  const handleQuickSale = ({ name, price }) => {
    const quickItem = {
      id: `quick_${Date.now()}`,
      name,
      price,
      category: 'Quick Sale',
    };
    addToCart({ id: quickItem.id, name: quickItem.name, price: quickItem.price });
    setShowQuickSaleModal(false);
  };

  const handleProcessOrder = () => {
    if (cart.length === 0) {
      return;
    }
    setShowProcessModal(true);
  };

  const handleCancelOrder = () => {
    setShowCancelModal(true);
  };

  const confirmCancelOrder = () => {
    setCart([]);
    setTipAmount(null);
    setDiscountAmount(0);
    setDiscountCode('');
    setBuyerInfo(null);
    setShowCancelModal(false);
    navigation.goBack();
  };

  const handleCloseInvoice = () => {
    setShowInvoiceModal(false);
    setCart([]);
    setTipAmount(null);
    setDiscountAmount(0);
    setDiscountCode('');
    setBuyerInfo(null);
    navigation.navigate('TableSelectionScreen', { newlyProcessedTable: tableNumber });
  };

  const openNoteModal = item => {
    setSelectedCartItem(item);
    setShowNoteModal(true);
  };

  const handleSaveNote = noteText => {
    setCart(prev =>
      prev.map(item => (item.id === selectedCartItem.id ? { ...item, note: noteText } : item)),
    );
    setShowNoteModal(false);
  };

  const handleSaveDiscount = code => {
    setDiscountCode(code);
    // Dummy logic: if code exists, apply $10 discount
    if (code.length > 0) {
      setDiscountAmount(10);
    } else {
      setDiscountAmount(0);
    }
  };

  const handleDeleteDiscount = () => {
    setDiscountCode('');
    setDiscountAmount(0);
  };

  const renderProduct = ({ item }) => (
    <TouchableOpacity
      style={styles.productCard}
      activeOpacity={0.7}
      onPress={() => addToCart(item)}
    >
      <View style={styles.priceTag}>
        <Text style={[styles.priceText, Overline]}>$ {item.price}</Text>
      </View>
      <Image source={ImageFrameIcon} style={styles.productImage} />
      <Text style={[styles.productName, Body3]}>{item.name}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.root}>
      <StatusBar backgroundColor="#C6CDEF" barStyle="dark-content" />

      {/* ───── LEFT PANEL ───── */}
      <View style={styles.leftPanel}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
            <Image source={LeftArrowIcon} style={[IconSize24, styles.backIcon]} />
          </TouchableOpacity>
        </View>

        {/* Category Slider */}
        <View style={styles.categoryRow}>
          <TouchableOpacity
            style={styles.categoryArrow}
            onPress={() => {
              const prevX = Math.max(0, scrollOffset.current - 200);
              categoryScrollRef.current?.scrollTo({ x: prevX, animated: true });
            }}
          >
            <Image source={LeftArrowIcon} style={IconSize12} />
          </TouchableOpacity>
          <ScrollView
            ref={categoryScrollRef}
            horizontal
            showsHorizontalScrollIndicator={false}
            onScroll={e => {
              scrollOffset.current = e.nativeEvent.contentOffset.x;
            }}
            scrollEventThrottle={16}
          >
            {categories.map(cat => (
              <TouchableOpacity
                key={cat.name}
                style={[styles.categoryBtn, selectedCategory === cat.name && styles.activeCategory]}
                onPress={() => setSelectedCategory(cat.name)}
              >
                <Image source={cat.icon} style={[IconSize16, styles.categoryIcon]} />
                <Text style={[styles.categoryText, Subtitle2]}>{cat.name}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
          <TouchableOpacity
            style={styles.categoryArrow}
            onPress={() => {
              const nextX = scrollOffset.current + 200;
              categoryScrollRef.current?.scrollTo({ x: nextX, animated: true });
            }}
          >
            <Image source={RightArrowIcon} style={IconSize12} />
          </TouchableOpacity>
        </View>

        {/* Product Grid */}
        <FlatList
          data={[...dummyProducts, ...dummyProducts, ...dummyProducts].slice(0, 20)}
          keyExtractor={(item, index) => `${item.id}-${index}`}
          renderItem={renderProduct}
          numColumns={5}
          contentContainerStyle={styles.productListContent}
          showsVerticalScrollIndicator={false}
        />
      </View>

      {/* ───── RIGHT PANEL ───── */}
      <View style={styles.cartPanel}>
        <View style={styles.cartPanelHeader}>
          <Text style={[styles.tableInfo, Subtitle1]}>Table #: {tableNumber}</Text>
          {orderType !== 'Take Away' && (
            <TouchableOpacity style={styles.splitBtn}>
              <Image source={SplitIcon} style={[IconSize16, styles.splitIcon]} />
              <Text style={[styles.splitText, Body3]}>Split Items</Text>
            </TouchableOpacity>
          )}
          <Text style={[styles.cashierInfo, Body3]}>Cashier: Jane</Text>
        </View>

        <FlatList
          data={cart}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <View style={styles.cartItemContainer}>
              <View style={styles.cartItem}>
                <View style={styles.itemMainInfo}>
                  <Text style={[styles.itemName, Subtitle2]}>{item.name}</Text>
                  <Text style={[styles.itemPrice, Body3]}>$ {item.price.toFixed(2)}</Text>
                  {item.note ? (
                    <Text style={[styles.itemNote, Body3]} numberOfLines={2}>
                      Note: {item.note}
                    </Text>
                  ) : null}
                </View>
                <View style={styles.itemActions}>
                  <TouchableOpacity style={styles.addNoteBtn} onPress={() => openNoteModal(item)}>
                    <Text style={[styles.addNoteText, Overline]}>
                      {item.note ? 'Edit Note' : '+ Add Note'}
                    </Text>
                  </TouchableOpacity>
                  <View style={styles.qtyRow}>
                    <TouchableOpacity
                      style={[styles.qtyBtn, item.qty > 1 && styles.qtyBtnActive]}
                      onPress={() => updateQty(item.id, -1)}
                    >
                      <View style={styles.minusButtonBar} />
                    </TouchableOpacity>
                    <Text style={[styles.qtyText, Subtitle2]}>
                      {item.qty.toString().padStart(2, '0')}
                    </Text>
                    <TouchableOpacity
                      style={[styles.qtyBtn, styles.qtyBtnActive]}
                      onPress={() => updateQty(item.id, 1)}
                    >
                      <Text style={styles.plusButtonText}>+</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
              <TouchableOpacity style={styles.deleteItemBtn} onPress={() => removeItem(item.id)}>
                <Image source={DeleteIcon} style={[IconSize20, styles.deleteIcon]} />
              </TouchableOpacity>
            </View>
          )}
          showsVerticalScrollIndicator={false}
        />

        {/* Action Buttons */}
        <View style={styles.actionRow}>
          <TouchableOpacity style={styles.actionBtn} onPress={() => setShowDiscountModal(true)}>
            <View style={styles.relativePosition}>
              <Image source={DiscountIcon} style={[IconSize20, styles.actionIcon]} />
              {discountCode.length > 0 && (
                <Image source={TickIcon} style={styles.tickIconOverlay} />
              )}
            </View>
            <Text style={Overline}>Discount</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionBtn} onPress={handleOpenTipModal}>
            <View style={styles.relativePosition}>
              <Image source={DollarIcon} style={IconSize20} />
              {tipAmount !== null && <Image source={TickIcon} style={styles.tickIconOverlay} />}
            </View>
            <Text style={Overline}>Add TIP</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionBtn} onPress={() => setShowQuickSaleModal(true)}>
            <View style={styles.relativePosition}>
              <Image source={RefreshICon} style={IconSize20} />
              {hasQuickSale && <Image source={TickIcon} style={styles.tickIconOverlay} />}
            </View>
            <Text style={Overline}>Quick Sale</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionBtn} onPress={handleOpenBuyerModal}>
            <View style={styles.relativePosition}>
              <Image source={BuyersIcon} style={IconSize20} />
              {buyerInfo !== null && <Image source={TickIcon} style={styles.tickIconOverlay} />}
            </View>
            <Text style={Overline}>Buyer Details</Text>
          </TouchableOpacity>
        </View>

        {/* Total Section */}
        <View style={styles.totalSection}>
          {discountAmount > 0 && (
            <View style={[styles.totalRow, styles.bottomMarginSmall]}>
              <Text style={[styles.totalLabel, Subtitle2, styles.greyTextColor]}>Discount:</Text>
              <Text style={[styles.totalValue, Subtitle2, styles.redTextColor]}>
                - $ {discountAmount.toFixed(2)}
              </Text>
            </View>
          )}
          {tipAmount !== null && parseFloat(tipAmount) > 0 && (
            <View style={[styles.totalRow, styles.bottomMarginSmall]}>
              <Text style={[styles.totalLabel, Subtitle2, styles.greyTextColor]}>Tip:</Text>
              <Text style={[styles.totalValue, Subtitle2, styles.greenTextColor]}>
                + $ {parseFloat(tipAmount).toFixed(2)}
              </Text>
            </View>
          )}
          <View style={styles.totalRow}>
            <Text style={[styles.totalLabel, H2]}>Total:</Text>
            <Text style={[styles.totalValue, H2]}>$ {total}</Text>
          </View>

          <View style={styles.bottomActions}>
            <TouchableOpacity
              style={[styles.processBtn, cart.length === 0 && styles.disabledBtn]}
              onPress={handleProcessOrder}
              disabled={cart.length === 0}
            >
              <Text style={[styles.processBtnText, ButtonTextSmall]}>Process Order</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.cancelBtn, cart.length === 0 && styles.disabledBtn]}
              onPress={handleCancelOrder}
              disabled={cart.length === 0}
            >
              <Text style={[styles.cancelBtnText, ButtonTextSmall]}>Cancel Order</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={[styles.primaryBtn, cart.length === 0 && styles.primaryBtnDisabled]}
            disabled={cart.length === 0}
            onPress={() => setShowPaymentModal(true)}
          >
            <Text style={[styles.primaryBtnText, ButtonText]}>Proceed to Checkout</Text>
          </TouchableOpacity>
        </View>
      </View>

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
      />

      <QuickSaleModal
        visible={showQuickSaleModal}
        onAddSale={handleQuickSale}
        onClose={() => setShowQuickSaleModal(false)}
      />

      <ConfirmationModal
        visible={showCancelModal}
        icon={CancelOrderIcon}
        iconStyle={IconSize40}
        title="Cancel Order!"
        subtitle="Are you sure you want to Cancel this order?"
        confirmText="Yes, Cancel"
        confirmButtonColor="#E74C3C"
        onConfirm={confirmCancelOrder}
        onCancel={() => setShowCancelModal(false)}
      />

      <ProcessOrderModal
        visible={showProcessModal}
        onClose={() => setShowProcessModal(false)}
        onPrintBill={() => {
          setShowProcessModal(false);
          navigation.navigate('TableSelectionScreen', { newlyProcessedTable: tableNumber });
        }}
      />

      <CartNoteModal
        visible={showNoteModal}
        onClose={() => setShowNoteModal(false)}
        onSave={handleSaveNote}
        initialNote={selectedCartItem?.note || ''}
      />

      <DiscountModal
        visible={showDiscountModal}
        onClose={() => setShowDiscountModal(false)}
        onSave={handleSaveDiscount}
        onDelete={handleDeleteDiscount}
        initialDiscountCode={discountCode}
      />

      <PaymentMethodModal
        visible={showPaymentModal}
        totalAmount={parseFloat(total)}
        currency="$"
        onProceed={async data => {
          setShowPaymentModal(false);
          if (data.method === 'Cash') {
            setShowSuccessModal(true);
          } else {
            setShowTapCardModal(true);
            try {
              await NfcManager.start();
              await NfcManager.requestTechnology(NfcTech.Ndef); // Use NfcTech.IsoDep if you are reading standard EMV Credit Cards
              // const tag = await NfcManager.getTag();
              // console.log('Card tapped:', tag);

              setShowTapCardModal(false);
              setShowTransactionModal(true);
            } catch {
              setShowTapCardModal(false);
            } finally {
              NfcManager.cancelTechnologyRequest();
            }
          }
        }}
        onClose={() => setShowPaymentModal(false)}
      />

      <InvoiceModal
        visible={showInvoiceModal}
        buyerInfo={buyerInfo}
        cartItems={cart}
        totalAmount={parseFloat(total)}
        discountAmount={discountAmount}
        tipAmount={tipAmount}
        onPrintReceipt={handleCloseInvoice}
        onClose={handleCloseInvoice}
      />

      <SuccessModal
        visible={showSuccessModal}
        title="Order Complete"
        message="Your order #1254632 is completed successfully."
        onClose={() => {
          setShowSuccessModal(false);
          setShowInvoiceModal(true);
        }}
      />

      <TransactionProcessModal
        visible={showTransactionModal}
        onClose={() => setShowTransactionModal(false)}
      />

      <TapCardModal visible={showTapCardModal} />
    </View>
  );
};

export default OrderProcessingScreen;
