import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StatusBar,
  TouchableOpacity,
  FlatList,
  Image,
  Modal,
  TouchableWithoutFeedback,
  ScrollView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Colors } from '../../utils/Colors';
import { S, VS, MS } from '../../utils/Responsive';
import { Subtitle2, Body3, H4, Subtitle1, Caption, Overline, Body1 } from '../../utils/fonts';
import { IconSize12, IconSize16, IconSize20, IconSize40 } from '../../utils/IconSizes';
import {
  LeftArrowIcon,
  RightArrowIcon,
  ArrowDownIcon,
  MenuIcon,
  ImageFrameIcon,
  DeleteIcon,
  TickIcon,
  RefreshICon,
  DiscountIcon,
  DollarIcon,
  BuyersIcon,
  CancelOrderIcon,
} from '../../assets/Images';
import styles from './TableSelectionScreenStyles';
import TipModal from '../../components/TipModal';
import BuyerInfoModal from '../../components/BuyerInfoModal';
import QuickSaleModal from '../../components/QuickSaleModal';
import ProcessOrderModal from '../../components/ProcessOrderModal';
import CartNoteModal from '../../components/CartNoteModal';
import DiscountModal from '../../components/DiscountModal';
import PaymentMethodModal from '../../components/PaymentMethodModal';
import InvoiceModal from '../../components/InvoiceModal';
import TransactionProcessModal from '../../components/TransactionProcessModal';
import ConfirmationModal from '../../components/ConfirmationModal';
import SuccessModal from '../../components/SuccessModal';
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
];

// Dummy table data matched to screenshot closely
const tables = Array.from({ length: 24 }, (_, i) => {
  const tableNum = i + 1;
  const isProcessing = [1, 3, 5, 15, 17, 19].includes(tableNum);
  const isModified = tableNum === 1;
  let seats = 4;
  if ([2, 8, 14, 20].includes(tableNum)) seats = 6;
  if ([3, 9, 15, 21].includes(tableNum)) seats = 8;
  if ([4, 10, 16, 22].includes(tableNum)) seats = 10;
  if ([5, 11, 17, 23].includes(tableNum)) seats = 12;
  if ([6, 12, 18, 24].includes(tableNum)) seats = 14;

  return {
    id: tableNum.toString(),
    number: tableNum,
    seats,
    status: isProcessing ? 'Processing' : 'Available',
    isModified,
  };
});

const TableSelectionScreen = () => {
  const navigation = useNavigation();
  const [activeTab, setActiveTab] = useState('Dine in');
  const [selectedArea, setSelectedArea] = useState('Area: 1 (Ground Floor)');
  const [isAreaDropdownVisible, setIsAreaDropdownVisible] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0, width: 0 });
  const areaSelectorRef = useRef(null);
  
  const [selectedCategory, setSelectedCategory] = useState('Beverages');
  const [cart, setCart] = useState([]);
  const categoryScrollRef = useRef(null);
  const scrollOffset = useRef(0);

  const [tipAmount, setTipAmount] = useState(null);
  const [showTipModal, setShowTipModal] = useState(false);
  const [buyerInfo, setBuyerInfo] = useState(null);
  const [showBuyerModal, setShowBuyerModal] = useState(false);
  const [showQuickSaleModal, setShowQuickSaleModal] = useState(false);
  const [showDiscountModal, setShowDiscountModal] = useState(false);
  const [discountCode, setDiscountCode] = useState('');
  const [discountAmount, setDiscountAmount] = useState(0);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [showTransactionModal, setShowTransactionModal] = useState(false);
  const [selectedCartItem, setSelectedCartItem] = useState(null);
  const [showNoteModal, setShowNoteModal] = useState(false);
  const [showProcessModal, setShowProcessModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showTapCardModal, setShowTapCardModal] = useState(false);

  const areas = [
    'Area: 1 (Ground Floor)',
    'Area: 2 (1st Floor)',
    'Area: 3 ( 2nd Floor )',
  ];

  const toggleDropdown = () => {
    if (areaSelectorRef.current) {
      areaSelectorRef.current.measure((fx, fy, width, height, px, py) => {
        setDropdownPosition({
          top: py + height,
          left: px,
          width: width,
        });
        setIsAreaDropdownVisible(true);
      });
    }
  };

  const addToCart = (product) => {
    setCart(prev => {
      const existing = prev.find(item => item.productId === product.id);
      if (existing) {
        return prev.map(item => 
          item.productId === product.id ? { ...item, qty: item.qty + 1 } : item
        );
      }
      return [...prev, { 
        id: `c_${Date.now()}_${product.id}`, 
        productId: product.id,
        name: product.name, 
        price: product.price, 
        qty: 1,
        note: '',
      }];
    });
  };

  const updateQty = (id, delta) => {
    setCart(prev => prev.map(item => 
      item.id === id ? { ...item, qty: Math.max(1, item.qty + delta) } : item
    ));
  };

  const removeItem = (id) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
  const total = (subtotal - discountAmount + (parseFloat(tipAmount) || 0)).toFixed(2);

  const hasQuickSale = cart.some(item => item.productId?.toString().startsWith('quick_'));

  // Modals Handlers
  const handleOpenTipModal = () => setShowTipModal(true);
  const handleAddTip = (amount) => { setTipAmount(amount); setShowTipModal(false); };
  const handleSaveTip = (amount) => { setTipAmount(amount); setShowTipModal(false); };
  const handleDeleteTip = () => { setTipAmount(null); setShowTipModal(false); };

  const handleOpenBuyerModal = () => setShowBuyerModal(true);
  const handleAddBuyerInfo = (info) => { setBuyerInfo(info); setShowBuyerModal(false); };
  const handleSaveBuyerInfo = (info) => { setBuyerInfo(info); setShowBuyerModal(false); };
  const handleDeleteBuyerInfo = () => { setBuyerInfo(null); setShowBuyerModal(false); };

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

  const handleSaveNote = (noteText) => {
    setCart(prev => prev.map(item => 
      item.id === selectedCartItem.id ? { ...item, note: noteText } : item
    ));
    setShowNoteModal(false);
  };

  const handleSaveDiscount = (code) => {
    setDiscountCode(code);
    if (code.length > 0) {
        setDiscountAmount(10); // Dummy logic
    } else {
        setDiscountAmount(0);
    }
  };

  const handleDeleteDiscount = () => {
    setDiscountCode('');
    setDiscountAmount(0);
  };

  const handleCloseInvoice = () => {
    setShowInvoiceModal(false);
    setCart([]);
    setTipAmount(null);
    setBuyerInfo(null);
    setDiscountCode('');
    setDiscountAmount(0);
  };

  const confirmCancelOrder = () => {
    setCart([]);
    setTipAmount(null);
    setBuyerInfo(null);
    setDiscountCode('');
    setDiscountAmount(0);
    setShowCancelModal(false);
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

  const renderTable = ({ item }) => {
    const isProcessing = item.status === 'Processing';
    
    // Screenshot exact colors:
    // Available Table: Core = #A4B4FF, Chairs = #3E468A
    // Processing Table: Core = #FEE4C1, Chairs = #FEE4C1
    const coreColor = isProcessing ? '#FEE4C1' : '#A4B4FF';
    const chairColor = isProcessing ? '#FEE4C1' : '#3E468A';

    return (
      <TouchableOpacity 
        style={styles.tableWrapper} 
        activeOpacity={0.7}
        onPress={() => {
          if (isProcessing) {
            navigation.navigate('OrderProcessingScreen', { tableNumber: item.number, orderType: 'Dine in' });
          }
        }}
      >
        {/* Top Chair */}
        <View style={[styles.chairTop, { top: '5%', left: '35%', backgroundColor: chairColor }]} />
        {/* Bottom Chair */}
        <View style={[styles.chairBottom, { bottom: '5%', left: '35%', backgroundColor: chairColor }]} />
        {/* Left Chair */}
        <View style={[styles.chairLeft, { left: '5%', top: '35%', backgroundColor: chairColor }]} />
        {/* Right Chair */}
        <View style={[styles.chairRight, { right: '5%', top: '35%', backgroundColor: chairColor }]} />
        
        {/* Table Core (the square part) */}
        <View style={[styles.tableCore, { backgroundColor: coreColor }]}>
          <Text style={styles.tableNameText}>Table {item.number}</Text>
          <Text style={{...Overline, color: Colors.grey}}>Seats: {item.seats}</Text>
          
          {isProcessing && (
            <View style={styles.statusIndicatorContainer}>
              <View style={[styles.statusDot, {backgroundColor: '#C8933A'}]} />
              <Text style={{...Overline, color: Colors.grey}}>Processing</Text>
            </View>
          )}
          {item.isModified && (
            <View style={styles.statusIndicatorContainer}>
              <View style={[styles.statusDot, {backgroundColor: '#8B5A2B'}]} />
              <Text style={{...Overline, color: Colors.grey}}>Modified</Text>
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.root}>
      <StatusBar backgroundColor="#c6cdefff" barStyle="dark-content" />

      {/* ───── LEFT PANEL ───── */}
      <View style={styles.leftPanel}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <TouchableOpacity
              style={styles.hamburgerBtn}
              onPress={() => navigation.openDrawer()}
            >
              <Image source={MenuIcon} style={IconSize20} />
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={styles.viewOrdersBtn}
            onPress={() => navigation.navigate('ViewOrdersScreen')}
          >
            <Text style={[styles.viewOrdersText, Body3]}>View Orders</Text>
            <Image source={RightArrowIcon} style={[IconSize12, styles.viewOrdersIcon]} />
          </TouchableOpacity>
        </View>

        {/* Tab Selector & Area Filter */}
        <View style={styles.tabsContainer}>
          <View style={styles.tabsSwitch}>
            <TouchableOpacity
              style={[
                styles.tabBtn,
                activeTab === 'Dine in' && styles.activeTabBtn,
              ]}
              onPress={() => setActiveTab('Dine in')}
            >
              <Text
                style={[
                  Subtitle2,
                  activeTab === 'Dine in' ? styles.activeTabText : styles.tabText,
                ]}
              >
                Dine in
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.tabBtn,
                activeTab === 'Take Away' && styles.activeTabBtn,
              ]}
              onPress={() => setActiveTab('Take Away')}
            >
              <Text
                style={[
                  Subtitle2,
                  activeTab === 'Take Away' ? styles.activeTabText : styles.tabText,
                ]}
              >
                Take Away
              </Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity 
            ref={areaSelectorRef}
            style={styles.areaSelector}
            onPress={toggleDropdown}
          >
            <Text style={[styles.areaText, Subtitle2]}>{selectedArea}</Text>
            <Image source={ArrowDownIcon} style={[IconSize12, { tintColor: '#2b3474' }]} />
          </TouchableOpacity>

          <Modal
            visible={isAreaDropdownVisible}
            transparent={true}
            animationType="fade"
            onRequestClose={() => setIsAreaDropdownVisible(false)}
          >
            <TouchableWithoutFeedback onPress={() => setIsAreaDropdownVisible(false)}>
              <View style={styles.modalOverlay}>
                <View style={[
                  styles.dropdownContainer, 
                  { 
                    top: dropdownPosition.top, 
                    left: dropdownPosition.left, 
                    minWidth: dropdownPosition.width 
                  }
                ]}>
                  {areas.map((area, index) => (
                    <TouchableOpacity
                      key={index}
                      style={styles.dropdownItem}
                      onPress={() => {
                        setSelectedArea(area);
                        setIsAreaDropdownVisible(false);
                      }}
                    >
                      <Text style={[styles.dropdownItemText, Subtitle2]}>{area}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </TouchableWithoutFeedback>
          </Modal>
        </View>

        {/* Table Grid */}
        {activeTab === 'Dine in' ? (
          <FlatList
            data={tables}
            keyExtractor={(item) => item.id}
            renderItem={renderTable}
            numColumns={6}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.gridContainer}
          />
        ) : (
          <View style={{ flex: 1 }}>
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
                    onScroll={(e) => {
                        scrollOffset.current = e.nativeEvent.contentOffset.x;
                    }}
                    scrollEventThrottle={16}
                >
                    {categories.map((cat) => (
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
              data={[...dummyProducts, ...dummyProducts, ...dummyProducts].slice(0, 15)}
              keyExtractor={(item, index) => `${item.id}-${index}`}
              renderItem={renderProduct}
              numColumns={5}
              contentContainerStyle={styles.productListContent}
              showsVerticalScrollIndicator={false}
            />
          </View>
        )}
      </View>

      {/* ───── RIGHT CART PANEL ───── */}
      <View style={styles.cartPanel}>
        {/* Top Header */}
        <View style={styles.cartPanelHeaderRow}>
          <Text style={[styles.cartHeaderText, Subtitle1]}>Table #:</Text>
          <Text style={[styles.cartHeaderText, Subtitle1]}>Cashier: Jane</Text>
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
                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: VS(12), backgroundColor: '#F2F5FF', borderRadius: MS(8), padding: MS(12) }}>
                  <View style={{ flex: 1 }}>
                    <Text style={[Subtitle2, { color: Colors.black }]}>{item.name}</Text>
                    <Text style={[Body3, { color: Colors.black }]}>$ {item.price.toFixed(2)}</Text>
                    {item.note ? (
                        <Text style={[Body3, { color: Colors.grey, fontStyle: 'italic', marginTop: VS(2) }]} numberOfLines={1}>
                            Note: {item.note}
                        </Text>
                    ) : null}
                  </View>
                  <View style={{ alignItems: 'flex-end' }}>
                    <TouchableOpacity 
                        style={{ marginBottom: VS(4), backgroundColor: Colors.white, paddingHorizontal: S(8), paddingVertical: VS(2), borderRadius: MS(10) }}
                        onPress={() => {
                            setSelectedCartItem(item);
                            setShowNoteModal(true);
                        }}
                    >
                        <Text style={[Overline, { color: Colors.grey }]}>{item.note ? 'Edit Note' : '+ Note'}</Text>
                    </TouchableOpacity>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                      <TouchableOpacity 
                        style={{ width: S(24), height: S(24), borderRadius: MS(12), backgroundColor: item.qty > 1 ? '#3E468A' : Colors.grey, justifyContent: 'center', alignItems: 'center' }}
                        onPress={() => updateQty(item.id, -1)}
                      >
                        <View style={{ width: S(10), height: VS(2), backgroundColor: Colors.white }} />
                      </TouchableOpacity>
                      <Text style={[Subtitle2, { marginHorizontal: S(8), color: Colors.black }]}>{item.qty.toString().padStart(2, '0')}</Text>
                      <TouchableOpacity 
                        style={{ width: S(24), height: S(24), borderRadius: MS(12), backgroundColor: '#3E468A', justifyContent: 'center', alignItems: 'center' }}
                        onPress={() => updateQty(item.id, 1)}
                      >
                        <Text style={{ color: Colors.white, fontSize: MS(18) }}>+</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                  <TouchableOpacity style={{ marginLeft: S(8) }} onPress={() => removeItem(item.id)}>
                    <Image source={DeleteIcon} style={{ width: S(20), height: VS(20), tintColor: '#E74C3C' }} />
                  </TouchableOpacity>
                </View>
              )}
            />
          )}
        </View>

        {/* Actions Rows */}
        <View style={styles.actionRow}>
          <TouchableOpacity style={styles.actionBtn} onPress={() => setShowDiscountModal(true)}>
             <View style={{ position: 'relative' }}>
                <Image source={DiscountIcon} style={[IconSize16, styles.actionIcon]} />
                {discountCode.length > 0 && (
                    <Image source={TickIcon} style={{ position: 'absolute', top: -VS(4), right: -S(15), width: S(8), height: VS(8), resizeMode: 'contain' }} />
                )}
             </View>
            <Text style={Overline}>Discount</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionBtn} onPress={handleOpenTipModal}>
            <View style={{ position: 'relative' }}>
              <Image source={DollarIcon} style={[IconSize16, styles.actionIcon]} />
              {tipAmount !== null && (
                <Image source={TickIcon} style={{ position: 'absolute', top: -VS(4), right: -S(15), width: S(8), height: VS(8), resizeMode: 'contain'}} />
              )}
            </View>
            <Text style={Overline}>Add TIP</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionBtn} onPress={() => setShowQuickSaleModal(true)}>
            <View style={{ position: 'relative' }}>
              <Image source={RefreshICon} style={[IconSize16, styles.actionIcon]} />
              {hasQuickSale && (
                <Image source={TickIcon} style={{ position: 'absolute', top: -VS(4), right: -S(15), width: S(8), height: VS(8), resizeMode: 'contain' }} />
              )}
            </View>
            <Text style={Overline}>Quick Sale</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionBtn} onPress={handleOpenBuyerModal}>
            <View style={{ position: 'relative' }}>
              <Image source={BuyersIcon} style={[IconSize16, styles.actionIcon]} />
              {buyerInfo !== null && (
                <Image source={TickIcon} style={{ position: 'absolute', top: -VS(4), right: -S(15), width: S(8), height: VS(8), resizeMode: 'contain' }} />
              )}
            </View>
            <Text style={Overline}>Buyer Details</Text>
          </TouchableOpacity>
        </View>

        {/* Total Section */}
        <View style={styles.totalSection}>
          {discountAmount > 0 && (
            <View style={[styles.totalRow, { marginBottom: VS(8) }]}>
              <Text style={[Subtitle2, { color: Colors.grey }]}>Discount:</Text>
              <Text style={[Subtitle2, { color: '#E74C3C' }]}>- $ {discountAmount.toFixed(2)}</Text>
            </View>
          )}
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total:</Text>
            <Text style={styles.totalAmount}>$ {total}</Text>
          </View>

          <View style={styles.bottomButtonGroup}>
            <TouchableOpacity 
                style={[styles.processBtn, cart.length === 0 && { opacity: 0.5 }]} 
                onPress={() => cart.length > 0 && setShowProcessModal(true)}
                disabled={cart.length === 0}
            >
              <Text style={styles.btnText}>Process Order</Text>
            </TouchableOpacity>
            <TouchableOpacity 
                style={[styles.cancelBtn, cart.length === 0 && { opacity: 0.5 }]} 
                onPress={() => cart.length > 0 && setShowCancelModal(true)}
                disabled={cart.length === 0}
            >
              <Text style={styles.btnText}>Cancel Order</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity 
            style={[styles.checkoutBtn, cart.length > 0 && { backgroundColor: '#3E468A' }]}
            onPress={() => {
              if (cart.length > 0) {
                if (activeTab === 'Take Away') {
                    setShowPaymentModal(true);
                } else {
                    navigation.navigate('OrderProcessingScreen', { orderType: activeTab });
                }
              }
            }}
          >
            <Text style={[styles.checkoutBtnText, cart.length > 0 && { color: Colors.white }]}>Proceed to Checkout</Text>
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
        icon={CancelOrderIcon }
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
        onPrintBill={() => setShowProcessModal(false)}
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
        onProceed={async (data) => {
          setShowPaymentModal(false);
          if (data.method === 'Cash') {
            setShowSuccessModal(true);
          } else {
            setShowTapCardModal(true);
            try {
              await NfcManager.start();
              await NfcManager.requestTechnology(NfcTech.Ndef); // Use NfcTech.IsoDep if you are reading standard EMV Credit Cards
              const tag = await NfcManager.getTag();
              console.log('Card tapped:', tag);
              
              setShowTapCardModal(false);
              setShowTransactionModal(true);
            } catch (ex) {
              console.log('NFC Error or Cancelled:', ex);
              setShowTapCardModal(false);
            } finally {
              NfcManager.cancelTechnologyRequest();
            }
          }
        }}
        onClose={() => setShowPaymentModal(false)}
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

      <TransactionProcessModal
        visible={showTransactionModal}
        onClose={() => setShowTransactionModal(false)}
      />
      
      <TapCardModal visible={showTapCardModal} />
    </View>
  );
};

export default TableSelectionScreen;
