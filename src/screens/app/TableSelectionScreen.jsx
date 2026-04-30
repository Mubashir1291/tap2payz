import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
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
  NativeModules,
  ActivityIndicator,
} from 'react-native';
import { useNavigation, useRoute, useFocusEffect } from '@react-navigation/native';
import ViewShot from 'react-native-view-shot';
import RNFS from 'react-native-fs';
import ReceiptTemplate from '../../components/ReceiptTemplate';
import { Subtitle2, Body3, H4, Subtitle1, Overline, Body1, Body2 } from '../../utils/fonts';
import { IconSize12, IconSize16, IconSize20, IconSize40 } from '../../utils/IconSizes';
import {
  LeftArrowIcon,
  RightArrowIcon,
  ArrowDownIcon,
  MenuIcon,
  ImageFrameIcon,
  CancelOrderIcon,
} from '../../assets/Images';
import styles from './TableSelectionScreenStyles';

import ProcessOrderModal from '../../components/ProcessOrderModal';
import CartNoteModal from '../../components/CartNoteModal';
import PaymentMethodModal from '../../components/PaymentMethodModal';
import InvoiceModal from '../../components/InvoiceModal';
import TransactionProcessModal from '../../components/TransactionProcessModal';
import ConfirmationModal from '../../components/ConfirmationModal';
import SuccessModal from '../../components/SuccessModal';
import TapCardModal from '../../components/TapCardModal';
import NfcManager, { NfcTech } from 'react-native-nfc-manager';
import { useSelector } from 'react-redux';
import { GET_FLOORS } from '../../services/Restaurant/Floors/Floor';
import { GET_TABLES } from '../../services/Restaurant/Tables/Table';
import RestaurantCartPanel from '../../components/RestaurantCartPanel';
import { GET_ALL_CATEGORIES, GET_ALL_PRODUCTS_WITH_INVENTORY } from '../../services/ProductService';
import { CREATE_RES_ORDER } from '../../services/Restaurant/Order/Order';
import Toast from 'react-native-toast-message';
import TipModal from '../../components/TipModal';
import BuyerInfoModal from '../../components/BuyerInfoModal';
import QuickSaleModal from '../../components/QuickSaleModal';
import DiscountModal from '../../components/DiscountModal';
import {
  GET_TERMINAL_STATUS,
  CREATE_RES_TRANSACTION,
} from '../../services/Restaurant/Sales&Transaction/Sales&Transaction';

const TableSelectionScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { store_id, store_name, userData } = useSelector(state => state.user);
  const { deviceId } = useSelector(state => state.device);
  const { PrinterModule } = NativeModules;
  const viewShotCustomerRef = useRef();
  const viewShotRestaurantRef = useRef();
  const [printing, setPrinting] = useState(false);
  const [paymentInfo, setPaymentInfo] = useState({ received: 0, change: 0, method: '' });
  const [buyerId, setBuyerId] = useState(null);

  const [activeTab, setActiveTab] = useState(route.params?.orderType || 'Dine in');
  const [areas, setAreas] = useState([]);
  const [selectedArea, setSelectedArea] = useState(null);
  const [isAreaDropdownVisible, setIsAreaDropdownVisible] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0, width: 0 });
  const areaSelectorRef = useRef(null);

  const [selectedCategory, setSelectedCategory] = useState({ _id: 'all', category_name: 'All' });
  const [cart, setCart] = useState([]);
  const [tables, setTables] = useState([]);
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);

  const [productSearchQuery, setProductSearchQuery] = useState({
    page: 1,
    itemsPerPage: 20,
    searchText: '',
    getAll: 'false',
    limited: 'false',
    storeId: store_id,
    category_id: '',
  });

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
  const [orderDetail, setOrderDetail] = useState(null);
  const [terminalReferenceNumber, setTerminalReferenceNumber] = useState('');
  const [terminalNr, setTerminalNr] = useState('');

  const [processingTables, setProcessingTables] = useState([]);

  const handleFetchAllCategories = useCallback(async () => {
    try {
      const response = await GET_ALL_CATEGORIES({
        storeId: store_id,
        getAll: 'true',
      });
      setCategories(response?.items || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  }, [store_id]);

  const handleFetchAllProducts = useCallback(async query => {
    try {
      const response = await GET_ALL_PRODUCTS_WITH_INVENTORY(query);
      setProducts(response?.items || []);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  }, []);

  const handleGetFloors = useCallback(async () => {
    if (!store_id) return;
    try {
      const response = await GET_FLOORS({ storeId: store_id });
      const fetchedAreas = response?.items || [];
      setAreas(fetchedAreas);
      if (fetchedAreas.length > 0 && !selectedArea) {
        setSelectedArea(fetchedAreas[0]);
      }
    } catch (error) {
      console.error('Error fetching floors:', error);
    }
  }, [store_id, selectedArea]);

  const handleGetTables = useCallback(
    async floorId => {
      if (!store_id || !floorId) return;
      try {
        const response = await GET_TABLES({ floor_id: floorId, storeId: store_id });
        const items = response?.items || [];
        setTables(items);
        // Sync processingTables: remove if API says available
        setProcessingTables(prev =>
          prev.filter(tNo => {
            const table = items.find(t => t.table_no === tNo);
            return table ? table.isAvailable === false : true;
          }),
        );
      } catch (error) {
        console.error('Error fetching tables:', error);
      }
    },
    [store_id],
  );
  const handleCheckTerminalStatus = async order => {
    const detail = order || orderDetail || route.params?.orderDetail;
    if (!detail?._id) {
      console.warn('handleCheckTerminalStatus: No order detail available yet');
      Toast.show({
        type: 'error',
        text1: 'Order Required',
        text2: 'Please process the order first before checking out.',
      });
      return;
    }

    const payload = {
      order_id: detail._id,
      transaction_type: 'CASH',
      products: detail?.products?.map(item => ({
        product_id: item?.product_id?._id,
        quantity: item?.quantity,
      })),
      deviceId: deviceId,
    };
    console.log(payload, 'payload for get terminal status');
    try {
      const res = await GET_TERMINAL_STATUS(payload);
      console.log(res, 'Terminal Response');
      setTerminalReferenceNumber(res?.transaction?.referenceNumber || '');
      setTerminalNr(res?.transaction?.nr || '');
    } catch (error) {
      console.error('Error checking terminal status:', error);
    }
  };

  const handleResTransaction = async method => {
    const payload = {
      transaction: {
        deviceID: deviceId || '',
        storeID: store_id || '',
        nr: terminalNr || '',
        referenceNumber: terminalReferenceNumber || '',
        transaction_uuid: `${Date.now()}`,
        transType: method?.toUpperCase() === 'CASH' ? 'CASH' : 'CARD',
        tipAmount: parseFloat(tipAmount) || 0,
        transAmntIn: parseFloat(total),
        transAmntEx: subtotal,
        discountAmount: discountAmount || 0,
        discountCode: discountCode || '',
        discountPercentage: 0,
        vat: 0,
        status: 'Completed',
        buyerID: buyerId,
      },
    };
    try {
      const res = await CREATE_RES_TRANSACTION(payload);
      console.log(res, 'Transaction Response');
      return res;
    } catch (error) {
      console.error('Error creating transaction:', error);
      Toast.show({
        type: 'error',
        text1: 'Transaction Error',
        text2: error.message || 'Could not complete transaction',
      });
      throw error;
    }
  };

  const handlePrintReceipt = async () => {
    try {
      setPrinting(true);
      if (!PrinterModule || !viewShotCustomerRef.current || !viewShotRestaurantRef.current) {
        throw new Error('Printer not ready');
      }
      await new Promise(res => setTimeout(res, 500));

      // 1. Print Restaurant Copy
      const uriRest = await viewShotRestaurantRef.current.capture();
      const pathRest = uriRest.replace('file://', '');
      const base64Rest = await RNFS.readFile(pathRest, 'base64');
      await PrinterModule.printFun({
        logoBase64: base64Rest,
        content: '\n',
      });

      // Small delay
      await new Promise(res => setTimeout(res, 500));

      // 2. Print Customer Copy
      const uriCust = await viewShotCustomerRef.current.capture();
      const pathCust = uriCust.replace('file://', '');
      const base64Cust = await RNFS.readFile(pathCust, 'base64');
      await PrinterModule.printFun({
        logoBase64: base64Cust,
        content: '\n',
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
  useFocusEffect(
    useCallback(() => {
      handleGetFloors();
      if (activeTab === 'Dine in' && selectedArea?._id) {
        handleGetTables(selectedArea._id);
      }
      if (activeTab === 'Take Away') {
        handleFetchAllCategories();
      }
    }, [handleGetFloors, handleGetTables, selectedArea, activeTab, handleFetchAllCategories]),
  );

  useEffect(() => {
    if (activeTab === 'Take Away') {
      handleFetchAllProducts(productSearchQuery);
    }
  }, [productSearchQuery, activeTab, handleFetchAllProducts]);

  useEffect(() => {
    if (activeTab === 'Dine in' && selectedArea?._id) {
      handleGetTables(selectedArea._id);
    }
  }, [selectedArea, handleGetTables, activeTab]);

  useEffect(() => {
    if (route.params?.newlyProcessedTable) {
      setProcessingTables(prev => {
        if (!prev.includes(route.params.newlyProcessedTable)) {
          return [...prev, route.params.newlyProcessedTable];
        }
        return prev;
      });
      navigation.setParams({ newlyProcessedTable: undefined });
    }
    // Sync orderDetail from route params (coming back from OrderProcessingScreen)
    if (route.params?.orderDetail) {
      setOrderDetail(route.params.orderDetail);
    }
  }, [route.params?.newlyProcessedTable, route.params?.orderDetail, navigation]);

  const toggleDropdown = () => {
    if (areaSelectorRef.current) {
      areaSelectorRef.current.measure((fx, fy, width, height, px, py) => {
        setDropdownPosition({
          top: py + height,
          left: px,
          width,
        });
        setIsAreaDropdownVisible(true);
      });
    }
  };

  const handleCreateResOrder = async () => {
    const payload = {
      type: 'TakeAway',
      table_id: '',
      products: cart.map(item => ({
        pid: item.productId,
        quantity: item.qty,
        note: item.note || '',
      })),
      employee_id: userData?._id || '',
      note: '',
    };

    try {
      const response = await CREATE_RES_ORDER(payload);
      console.log('Take Away Order Response:', response);
      const createdOrder = response?.order;
      setOrderDetail(createdOrder);
      setShowProcessModal(true);
    } catch (error) {
      console.error('Error creating take away order:', error);
      Toast.show({
        type: 'error',
        text1: 'Order Error',
        text2: error.message || 'Could not process order',
      });
    }
  };

  const addToCart = product => {
    const prodId = product._id || product.id || product.productId;
    setCart(prev => {
      const existing = prev.find(item => item.productId === prodId);
      if (existing) {
        return prev.map(item =>
          item.productId === prodId ? { ...item, qty: item.qty + 1 } : item,
        );
      }
      return [
        ...prev,
        {
          id: `c_${Date.now()}_${prodId}`,
          productId: prodId,
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

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const total = (subtotal - discountAmount + (parseFloat(tipAmount) || 0)).toFixed(2);

  const hasQuickSale = cart.some(item => item.productId?.toString().startsWith('quick_'));

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

  const handleSaveNote = noteText => {
    setCart(prev =>
      prev.map(item => (item.id === selectedCartItem.id ? { ...item, note: noteText } : item)),
    );
    setShowNoteModal(false);
  };

  const handleFilterByCategory = cat => {
    setSelectedCategory(cat);
    setProductSearchQuery(prev => ({
      ...prev,
      category_id: cat?._id === 'all' ? '' : cat?._id,
      page: 1,
    }));
  };

  const categoriesItems = useMemo(() => {
    const allTab = { _id: 'all', category_name: 'All' };
    const items = categories || [];
    return [allTab, ...items];
  }, [categories]);

  const handleSaveDiscount = code => {
    setDiscountCode(code);
    // if (code.length > 0) {
    //   setDiscountAmount(10); // Dummy logic
    // } else {
    //   setDiscountAmount(0);
    // }
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

  const handleProcessOrder = () => {
    if (cart.length === 0) return;

    if (activeTab === 'Take Away') {
      handleCreateResOrder();
    } else {
      setShowProcessModal(true);
    }
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
      style={[
        styles.productCard,
        item?.quantity <= 0 && [styles.outOfStockCard, { backgroundColor: '#E0E0E0' }],
      ]}
      activeOpacity={0.7}
      onPress={() => {
        if (item.quantity <= 0) {
          Toast.show({
            type: 'error',
            text1: 'Out of Stock',
            text2: `${item.name} is currently out of stock.`,
          });
        } else {
          addToCart(item);
        }
      }}
    >
      {item?.quantity <= 0 && (
        <View
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1,
          }}
        >
          <Text
            style={[
              Body2,
              { color: 'red', textAlign: 'center', fontWeight: 'bold' },
            ]}
          >
            Out of Stock
          </Text>
        </View>
      )}
      <View style={styles.priceTag}>
        <Text style={[styles.priceText, Overline]}>$ {item.price}</Text>
      </View>
      <Image source={ImageFrameIcon} style={styles.productImage} />
      <Text style={[styles.productName, Body3]}>{item.name}</Text>
    </TouchableOpacity>
  );

  const renderTable = ({ item }) => {
    // isAvailable from response: true = available, false = occupied/processing
    const isAvailable = item.isAvailable !== false;
    const isProcessing =
      !isAvailable || item.status === 'Processing' || processingTables.includes(item.table_no);

    const coreColor = isProcessing ? '#FEE4C1' : '#A4B4FF';
    const chairColor = isProcessing ? '#FEE4C1' : '#3E468A';

    return (
      <TouchableOpacity
        style={styles.tableWrapper}
        activeOpacity={0.7}
        onPress={() => {
          if (isProcessing) {
            navigation.navigate('OrderProcessingScreen', {
              tableNumber: item.table_no,
              orderType: 'DineIn',
              isNewOrder: false,
              tableId: item._id,
            });
          } else {
            navigation.navigate('OrderProcessingScreen', {
              tableNumber: item.table_no,
              orderType: 'DineIn',
              isNewOrder: true,
              tableId: item._id,
            });
          }
        }}
      >
        {/* Top Chair */}
        <View
          style={[styles.chairTop, [styles.chairTopPositioning, { backgroundColor: chairColor }]]}
        />
        {/* Bottom Chair */}
        <View
          style={[
            styles.chairBottom,
            [styles.chairBottomPositioning, { backgroundColor: chairColor }],
          ]}
        />
        {/* Left Chair */}
        <View
          style={[styles.chairLeft, [styles.chairLeftPositioning, { backgroundColor: chairColor }]]}
        />
        {/* Right Chair */}
        <View
          style={[
            styles.chairRight,
            [styles.chairRightPositioning, { backgroundColor: chairColor }],
          ]}
        />

        {/* Table Core (the square part) */}
        <View style={[styles.tableCore, [styles.tableCoreDynamic, { backgroundColor: coreColor }]]}>
          <Text style={styles.tableNameText}>Table {item.table_no}</Text>
          <Text style={[styles.greyOverlineText]}>Seats: {item.seats}</Text>

          {isProcessing && (
            <View style={styles.statusIndicatorContainer}>
              <View style={[styles.statusDot, styles.processingStatusColor]} />
              <Text style={[styles.greyOverlineText]}>Processing</Text>
            </View>
          )}
          {item.isModified && (
            <View style={styles.statusIndicatorContainer}>
              <View style={[styles.statusDot, styles.modifiedStatusColor]} />
              <Text style={[styles.greyOverlineText]}>Modified</Text>
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
            <TouchableOpacity style={styles.hamburgerBtn} onPress={() => navigation.openDrawer()}>
              <Image source={MenuIcon} style={IconSize20} />
            </TouchableOpacity>
          </View>

          {activeTab === 'Dine in' && (
            <TouchableOpacity
              style={styles.viewOrdersBtn}
              onPress={() => navigation.navigate('ViewOrdersScreen')}
            >
              <Text style={[styles.viewOrdersText, Body3]}>View Orders</Text>
              <Image source={RightArrowIcon} style={[IconSize12, styles.viewOrdersIcon]} />
            </TouchableOpacity>
          )}
        </View>

        {/* Tab Selector & Area Filter */}
        <View style={styles.tabsContainer}>
          <View style={styles.tabsSwitch}>
            <TouchableOpacity
              style={[styles.tabBtn, activeTab === 'Dine in' && styles.activeTabBtn]}
              onPress={() => setActiveTab('Dine in')}
            >
              <Text
                style={[Subtitle2, activeTab === 'Dine in' ? styles.activeTabText : styles.tabText]}
              >
                Dine in
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tabBtn, activeTab === 'Take Away' && styles.activeTabBtn]}
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

          {activeTab === 'Dine in' && (
            <>
              <TouchableOpacity
                ref={areaSelectorRef}
                style={styles.areaSelector}
                onPress={toggleDropdown}
              >
                <Text style={[styles.areaText, Subtitle2]}>
                  {selectedArea?.name || 'Select Area'}
                </Text>
                <Image source={ArrowDownIcon} style={[IconSize12, styles.darkBlueTint]} />
              </TouchableOpacity>

              <Modal
                visible={isAreaDropdownVisible}
                transparent={true}
                animationType="fade"
                onRequestClose={() => setIsAreaDropdownVisible(false)}
              >
                <TouchableWithoutFeedback onPress={() => setIsAreaDropdownVisible(false)}>
                  <View style={styles.modalOverlay}>
                    <View
                      style={[
                        styles.dropdownContainer,
                        {
                          top: dropdownPosition.top,
                          left: dropdownPosition.left,
                          minWidth: dropdownPosition.width,
                        },
                      ]}
                    >
                      {areas.map(area => (
                        <TouchableOpacity
                          key={area._id}
                          style={styles.dropdownItem}
                          onPress={() => {
                            setSelectedArea(area);
                            setIsAreaDropdownVisible(false);
                          }}
                        >
                          <Text style={[styles.dropdownItemText, Subtitle2]}>{area.name}</Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </View>
                </TouchableWithoutFeedback>
              </Modal>
            </>
          )}
        </View>

        {/* Table Grid */}
        {activeTab === 'Dine in' ? (
          <FlatList
            data={tables}
            keyExtractor={item => item._id || item.id}
            renderItem={renderTable}
            numColumns={6}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.gridContainer}
          />
        ) : (
          <View style={styles.flexFull}>
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
                {categoriesItems.map(cat => (
                  <TouchableOpacity
                    key={cat._id}
                    style={[
                      styles.categoryBtn,
                      selectedCategory?._id === cat._id && styles.activeCategory,
                    ]}
                    onPress={() => handleFilterByCategory(cat)}
                  >
                    <Image source={ImageFrameIcon} style={[IconSize16, styles.categoryIcon]} />
                    <Text style={[styles.categoryText, Subtitle2]}>{cat.category_name}</Text>
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
              data={products.map(p => ({
                _id: p._id,
                name: p.product_name,
                price: p.price,
                quantity: p.quantity,
              }))}
              keyExtractor={(item, index) => item._id || index.toString()}
              renderItem={renderProduct}
              numColumns={5}
              contentContainerStyle={styles.productListContent}
              showsVerticalScrollIndicator={false}
            />
          </View>
        )}
      </View>

      {/* ───── RIGHT CART PANEL ───── */}
      <RestaurantCartPanel
        cart={cart}
        updateQty={updateQty}
        removeItem={removeItem}
        discountAmount={discountAmount}
        tipAmount={tipAmount}
        total={total}
        discountCode={discountCode}
        buyerInfo={buyerInfo}
        hasQuickSale={hasQuickSale}
        activeTab={activeTab}
        setShowDiscountModal={setShowDiscountModal}
        setShowTipModal={setShowTipModal}
        setShowQuickSaleModal={setShowQuickSaleModal}
        setShowBuyerModal={setShowBuyerModal}
        setShowProcessModal={handleProcessOrder}
        setShowCancelModal={setShowCancelModal}
        setShowPaymentModal={setShowPaymentModal}
        setSelectedCartItem={setSelectedCartItem}
        setShowNoteModal={setShowNoteModal}
        handleCheckTerminalStatus={handleCheckTerminalStatus}
        disableActions={activeTab === 'Dine in'}
      />

      <ReceiptTemplate
        ref={viewShotRestaurantRef}
        cart={cart}
        storeName={store_name}
        cashierName={userData?.employee_name}
        orderId={orderDetail?._id?.slice(-6).toUpperCase()}
        orderType={activeTab}
        subtotal={subtotal}
        total={total}
        discountAmount={discountAmount}
        tipAmount={tipAmount}
        paymentInfo={paymentInfo}
        copyType="Restaurant Copy"
      />
      <ReceiptTemplate
        ref={viewShotCustomerRef}
        cart={cart}
        storeName={store_name}
        cashierName={userData?.employee_name}
        orderId={orderDetail?._id?.slice(-6).toUpperCase()}
        orderType={activeTab}
        subtotal={subtotal}
        total={total}
        discountAmount={discountAmount}
        tipAmount={tipAmount}
        paymentInfo={paymentInfo}
        copyType="Customer Copy"
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
        orderNumber={orderDetail?._id?.slice(-6)}
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
        onProceed={async data => {
          console.log('Payment Proceeded with data:', data);
          setShowPaymentModal(false);
          setPaymentInfo({
            received: data.amount,
            change: data.change,
            method: data.method,
          });

          if (data.method?.toLowerCase() === 'cash') {
            try {
              await handleResTransaction(data.method);
              setShowSuccessModal(true);
            } catch (error) {}
          } else {
            setShowTapCardModal(true);
            try {
              await NfcManager.start();
              await NfcManager.requestTechnology(NfcTech.Ndef);
              await handleResTransaction(data.method);
              setShowTapCardModal(false);
              setShowTransactionModal(true);
            } catch (error) {
              console.error('NFC or Transaction Error:', error);
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
        message={`Your order #${orderDetail?._id?.slice(-6)} is completed successfully.`}
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
        onPrintReceipt={async () => {
          await handlePrintReceipt();
          handleCloseInvoice();
        }}
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
