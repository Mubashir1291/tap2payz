import React, { useState, useMemo, useRef, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StatusBar,
  TouchableOpacity,
  FlatList,
  Image,
  ScrollView,
  ActivityIndicator,
  NativeModules,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import ViewShot from 'react-native-view-shot';
import ReceiptTemplate from '../../components/ReceiptTemplate';
import RNFS from 'react-native-fs';
import {
  Subtitle1,
  Subtitle2,
  Body3,
  ButtonText,
  Overline,
  H2,
  ButtonTextSmall,
  Body2,
  H4
} from '../../utils/fonts';
import { IconSize12, IconSize16, IconSize20, IconSize24, IconSize40, IconSize50, IconSize60 } from '../../utils/IconSizes';
import {
  LeftArrowIcon,
  RightArrowIcon,
  DollarIcon,
  BuyersIcon,
  DeleteIcon,
  ImageFrameIcon,
  RefreshICon,
  SplitIcon,
  TickIcon,
  CancelOrderIcon,
  PSPIcon,
} from '../../assets/Images';
import styles from './OrderProcessingScreenStyles';
import TipModal from '../../components/TipModal';
import BuyerInfoModal from '../../components/BuyerInfoModal';
import QuickSaleModal from '../../components/QuickSaleModal';
import ProcessOrderModal from '../../components/ProcessOrderModal';
import ConfirmationModal from '../../components/ConfirmationModal';
import SuccessModal from '../../components/SuccessModal';
import CartNoteModal from '../../components/CartNoteModal';
import PaymentMethodModal from '../../components/PaymentMethodModal';
import InvoiceModal from '../../components/InvoiceModal';
import TransactionProcessModal from '../../components/TransactionProcessModal';
import TapCardModal from '../../components/TapCardModal';
import NfcManager, { NfcTech } from 'react-native-nfc-manager';
import { useSelector } from 'react-redux';
import {
  GET_ALL_CATEGORIES,
  GET_ALL_PRODUCTS_WITH_INVENTORY,
} from '../../services/ProductService';
import Toast from 'react-native-toast-message';
import { CREATE_RES_ORDER, GET_RES_ACTIVE_ORDERS } from '../../services/Restaurant/Order/Order';
import {
  CREATE_RES_TRANSACTION,
  GET_TERMINAL_STATUS,
} from '../../services/Restaurant/Sales&Transaction/Sales&Transaction';


const OrderProcessingScreen = () => {
  const { PrinterModule, DisplayManager } = NativeModules;
  const navigation = useNavigation();
  const route = useRoute();
  const { store_id, store_name, userData } = useSelector(state => state.user);
  const { deviceId } = useSelector(state => state.device);

  const viewShotCustomerRef = useRef();
  const viewShotRestaurantRef = useRef();
  const [printing, setPrinting] = useState(false);

  const { tableNumber, tableId, orderType, isNewOrder } = route.params || {};

  const isTakeAway = orderType?.toLowerCase().replace(/\s/g, '') === 'takeaway';

  const [selectedCategory, setSelectedCategory] = useState({ _id: 'all', name: 'All' });
  const [cart, setCart] = useState([]);

  const [tipAmount, setTipAmount] = useState(null);
  const [showTipModal, setShowTipModal] = useState(false);
  const [buyerInfo, setBuyerInfo] = useState(null);
  const [showBuyerModal, setShowBuyerModal] = useState(false);
  const [buyerId, setBuyerId] = useState(null);
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
  const [orderDetail, setOrderDetail] = useState(null);
  const [terminalReferenceNumber, setTerminalReferenceNumber] = useState('');
  const [terminalNr, setTerminalNr] = useState('');
  const [availableDiscount, setAvailableDiscount] = useState(null);

  const [paymentInfo, setPaymentInfo] = useState({ received: 0, change: 0, method: '' });
  // API Data State
  const [products, setProducts] = useState([]);
  const [productsData, setProductsData] = useState(null);
  const [categories, setCategories] = useState([]);
  const [isLoadingMoreProducts, setIsLoadingMoreProducts] = useState(false);
  const isLoadingProductsRef = useRef(false);
  const [productSearchQuery, setProductSearchQuery] = useState({
    page: 1,
    itemsPerPage: 20,
    searchText: '',
    getAll: 'false',
    limited: 'false',
    storeId: store_id,
    category_id: '',
  });

  const handleGetResOrderDetail = useCallback(async () => {
    try {
      const res = await GET_RES_ACTIVE_ORDERS(tableId);
      console.log(res, 'Order Details Response');
      const order = res?.order;
      if (order) {
        setOrderDetail(order);
        // Map products from API response to component cart state
        const mappedCart = (order.products || []).map(item => ({
          id: item._id, // Local ID for cart management
          productId: item.product_id?._id,
          name: item.product_id?.product_name || 'Unknown',
          price: item.price,
          qty: item.quantity,
          note: item.note || '',
        }));
        setCart(mappedCart);
      }
    } catch (error) {
      console.error('Error fetching order details:', error);
    }
  }, [tableId]);

  // Debugging hook to check for Native Modules
  useEffect(() => {
    console.log('--- NATIVE MODULES DEBUG ---');
    console.log('Available Modules:', Object.keys(NativeModules));
    console.log('PrinterModule found:', !!NativeModules.PrinterModule);
    console.log('DisplayManager found:', !!NativeModules.DisplayManager);
    console.log('---------------------------');
  }, []);

  // Initialize printer hardware on mount
  useEffect(() => {
    const initPrinter = async () => {
      if (PrinterModule && PrinterModule.initializePrinter) {
        try {
          await PrinterModule.initializePrinter();
          console.log("printer initialzed successfully")
        } catch (err) { console.warn("Printer initialization failed:", err); }
      }
    };
    initPrinter();
  }, [PrinterModule]);

  const handleCreateResOrder = async () => {
    const payload = {
      type: isTakeAway ? 'TakeAway' : 'DineIn',
      table_id: tableId || '',
      products: cart.map(item => ({
        pid: item.productId || item.id,
        quantity: item.qty,
        note: item.note || '',
      })),
      employee_id: userData?._id || '',
      note: '',
    };
    try {
      const response = await CREATE_RES_ORDER(payload);
      console.log(response, 'Order Response');
      setOrderDetail(response?.order);
      setShowProcessModal(true);
    } catch (error) {
      console.error('Error creating order:', error);
      Toast.show({
        type: 'error',
        text1: 'Order Error',
        text2: error.message || 'Could not process order',
      });
    }
  };

  useEffect(() => {
    setCart([]);
    setTipAmount(null);
    setDiscountAmount(0);
    setDiscountCode('');
    setBuyerInfo(null);
    setBuyerId(null);
    setSelectedCategory({ _id: 'all', name: 'All' });
    setProductSearchQuery(prev => ({ ...prev, category_id: '', page: 1 }));

    if (!isNewOrder && tableId) {
      handleGetResOrderDetail();
    }
  }, [isNewOrder, tableId, handleGetResOrderDetail]);

  const handleFetchAllCategories = async () => {
    try {
      const response = await GET_ALL_CATEGORIES({
        storeId: store_id,
        getAll: 'true',
      });
      console.log(response, 'Category Response');
      setCategories(response?.items || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleFetchAllProducts = async (query, loadMore = false) => {
    isLoadingProductsRef.current = true;
    if (loadMore) {
      setIsLoadingMoreProducts(true);
    }
    try {
      const response = await GET_ALL_PRODUCTS_WITH_INVENTORY(query);
      console.log(response, 'product response');

      if (loadMore) {
        setProducts(prev => [...prev, ...(response?.items || [])]);
      } else {
        setProducts(response?.items || []);
      }
      setProductsData(response);
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Error fetching products',
        text2: error.message,
      });
    } finally {
      if (loadMore) {
        setIsLoadingMoreProducts(false);
      }
      isLoadingProductsRef.current = false;
    }
  };

  useEffect(() => {
    if (store_id) {
      handleFetchAllCategories();
    }
  }, [store_id]);

  useEffect(() => {
    if (store_id) {
      handleFetchAllProducts(productSearchQuery, productSearchQuery.page > 1);
    }
  }, [productSearchQuery, store_id]);

  const handleCheckTerminalStatus = async order => {
    const detail = order || orderDetail;
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
      return true;
    } catch (error) {
      console.error('Error checking terminal status:', error);
      Toast.show({
        type: 'error',
        text1: 'Terminal Error',
        text2: error.message || 'Could not check terminal status',
      });
      return false;
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

      // Wait for render
      await new Promise(res => setTimeout(res, 500));

      // Capture and print Restaurant Copy
      const uriRest = await viewShotRestaurantRef.current.capture();
      const pathRest = uriRest.replace('file://', '');
      const base64Rest = await RNFS.readFile(pathRest, 'base64');

      await PrinterModule.printFun({
        logoBase64: base64Rest,
        content: "\n"
      });

      // Small delay between prints
      await new Promise(res => setTimeout(res, 500));

      // Capture and print Customer Copy
      const uriCust = await viewShotCustomerRef.current.capture();
      const pathCust = uriCust.replace('file://', '');
      const base64Cust = await RNFS.readFile(pathCust, 'base64');

      await PrinterModule.printFun({
        logoBase64: base64Cust,
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

  const handleClearSecondDisplay = async () => {
    if (DisplayManager && DisplayManager.dismissSecondDisplay) {
      await DisplayManager.dismissSecondDisplay();
    }
  };

  const loadMoreProducts = () => {
    if (
      isLoadingMoreProducts ||
      isLoadingProductsRef.current ||
      !productsData ||
      !productsData.hasNextPage
    ) {
      return;
    }
    setProductSearchQuery(prev => ({ ...prev, page: prev.page + 1 }));
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
    const allTab = { _id: 'all', name: 'All' };
    const items =
      categories?.map(cat => ({
        _id: cat?._id,
        name: cat?.category_name || cat?.name,
      })) || [];
    return [allTab, ...items];
  }, [categories]);

  const productItems = useMemo(() => {
    return products?.map(product => ({
      _id: product?._id,
      id: product?._id,
      name: product?.product_name,
      price: product?.price,
      quantity: product?.quantity,
      quantitySold: product?.quantitySold,
    }));
  }, [products]);

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
    const prodId = product._id || product.id;
    setCart(prev => {
      const existing = prev.find(item => (item.productId || item.id) === prodId);
      if (existing) {
        return prev.map(item =>
          (item.productId || item.id) === prodId ? { ...item, qty: item.qty + 1 } : item,
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

  const subtotal = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  }, [cart]);

  const total = useMemo(() => {
    return (subtotal - discountAmount + (parseFloat(tipAmount) || 0)).toFixed(2);
  }, [subtotal, discountAmount, tipAmount]);

  const hasQuickSale = useMemo(() => {
    return cart.some(item => item.productId?.toString().startsWith('quick_'));
  }, [cart]);

  const handleCancelTapCard = () => {
    setShowTapCardModal(false);
    NfcManager.cancelTechnologyRequest().catch(() => { });
  };

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
    handleCreateResOrder();
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
    handleClearSecondDisplay(); // Clear secondary display when closing invoice
    setShowInvoiceModal(false);
    setCart([]);
    setTipAmount(null);
    setDiscountAmount(0);
    setDiscountCode('');
    setBuyerInfo(null);
    setBuyerId(null);
    navigation.navigate('MainDrawer', {
      screen: 'TableSelectionScreen',
      params: {
        newlyProcessedTable: isTakeAway ? undefined : tableNumber,
        orderType: isTakeAway ? 'Take Away' : 'Dine in',
      },
    });
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

  // const handleSaveDiscount = code => {
  //   setDiscountCode(code);
  //   // Commented out available discount logic for future use
  //   // if (availableDiscount && code === availableDiscount.code) {
  //   //   const percentage = parseFloat(availableDiscount.percentage) || 0;
  //   //   const amount = (subtotal * percentage) / 100;
  //   //   setDiscountAmount(amount);
  //   // } else
  //   if (code.length > 0) {
  //     setDiscountAmount(10); // Default/Dummy fallback
  //   } else {
  //     setDiscountAmount(0);
  //   }
  // };

  // const handleDeleteDiscount = () => {
  //   setDiscountCode('');
  //   setDiscountAmount(0);
  // };

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
        <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, justifyContent: 'center', alignItems: 'center', zIndex: 1 }}>
          <Text style={[Body2, { color: 'red', textAlign: 'center', fontWeight: 'bold' }]}>Out of Stock</Text>
        </View>
      )}
      <View style={styles.priceTag}>
        <Text style={[styles.priceText, Overline]}>$ {item.price}</Text>
      </View>
      <Image source={ImageFrameIcon} style={styles.productImage} />
      <Text style={[styles.productName, Body3]}>{item.name}</Text>
    </TouchableOpacity>
  );
  // ReceiptTemplate replaces RenderPrintView



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
          data={productItems}
          keyExtractor={(item, index) => `${item._id}-${index}`}
          renderItem={renderProduct}
          numColumns={5}
          contentContainerStyle={styles.productListContent}
          showsVerticalScrollIndicator={false}
          onEndReached={loadMoreProducts}
          onEndReachedThreshold={0.1}
          ListFooterComponent={
            isLoadingMoreProducts ? (
              <View style={{ padding: 20 }}>
                <ActivityIndicator size="large" color="#3B4B8A" />
              </View>
            ) : null
          }
        />
      </View>

      {/* ───── RIGHT PANEL ───── */}
      <View style={styles.cartPanel}>
        <ReceiptTemplate
          ref={viewShotRestaurantRef}
          cart={cart}
          storeName={store_name}
          cashierName={userData?.employee_name}
          orderId={orderDetail?._id?.slice(-6).toUpperCase()}
          orderType={isTakeAway ? 'Take Away' : 'Dine in'}
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
          orderType={isTakeAway ? 'Take Away' : 'Dine in'}
          subtotal={subtotal}
          total={total}
          discountAmount={discountAmount}
          tipAmount={tipAmount}
          paymentInfo={paymentInfo}
          copyType="Customer Copy"
        />
        <View style={styles.cartPanelHeader}>
          <Text style={[styles.tableInfo, Subtitle1]}>
            {orderType === 'Take Away' ? 'Take Away' : `Table #: ${tableNumber}`}
          </Text>
          {/* {orderType !== 'Take Away' && (
            <TouchableOpacity style={styles.splitBtn}>
              <Image source={SplitIcon} style={[IconSize16, styles.splitIcon]} />
              <Text style={[styles.splitText, Body3]}>Split Items</Text>
            </TouchableOpacity>
          )} */}
          <Text style={[styles.cashierInfo, Body3]}>Cashier:{userData?.employee_name}</Text>
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
          {/* <TouchableOpacity
            style={styles.actionBtn}
            onPress={() => {
              // handleCheckDiscountCode(); // Commented out for now
              setShowDiscountModal(true);
            }}
          >
            <View style={styles.relativePosition}>
              <Image source={DiscountIcon} style={[IconSize20, styles.actionIcon]} />
              {discountCode.length > 0 && (
                <Image source={TickIcon} style={styles.tickIconOverlay} />
              )}
            </View>
            <Text style={Overline}>Discount</Text>
          </TouchableOpacity> */}
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
            style={[
              styles.primaryBtn,
              (cart.length === 0 || printing) && styles.primaryBtnDisabled,
              { backgroundColor: printing ? '#999' : '#3B4B8A' }
            ]}
            disabled={cart.length === 0 || printing}
            onPress={async () => {
              if (!PrinterModule) {
                Toast.show({
                  type: 'error',
                  text1: 'Hardware Error',
                  text2: 'Printer driver not found. Check native installation.',
                });
                return;
              }

              const isTerminalReady = await handleCheckTerminalStatus();
              if (isTerminalReady) {
                setShowPaymentModal(true);
              }
            }}
          >
            <Text style={[styles.primaryBtnText, ButtonText]}>Proceeds to Checkout</Text>
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
        onPrintBill={() => {
          setShowProcessModal(false);
          navigation.navigate('MainDrawer', {
            screen: 'TableSelectionScreen',
            params: {
              newlyProcessedTable: tableNumber,
              orderDetail: orderDetail,
            },
          });
        }}
      />

      <CartNoteModal
        visible={showNoteModal}
        onClose={() => setShowNoteModal(false)}
        onSave={handleSaveNote}
        initialNote={selectedCartItem?.note || ''}
      />

      {/* <DiscountModal
        visible={showDiscountModal}
        onClose={() => setShowDiscountModal(false)}
        onSave={handleSaveDiscount}
        onDelete={handleDeleteDiscount}
        initialDiscountCode={discountCode}
        availableDiscount={availableDiscount}
      /> */}

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
            method: data.method
          });

          if (data.method?.toLowerCase() === 'cash') {
            try {
              await handleResTransaction(data.method);
              setShowSuccessModal(true);
            } catch (error) {
              // Error handled in handleResTransaction
            }
          } else {
            setShowTapCardModal(true);
            try {
              await NfcManager.start();
              console.log('NFC Manager started, waiting for tap...');

              await NfcManager.requestTechnology(NfcTech.Ndef); // Use NfcTech.IsoDep if you are reading standard EMV Credit Cards
              console.log('NFC Technology acquired');

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

      <SuccessModal
        visible={showSuccessModal}
        title="Order Complete"
        message={`Your order #${orderDetail?._id?.slice(-6)} is completed successfully.`}
        onClose={() => {
          setShowSuccessModal(false);
          setShowInvoiceModal(true);
        }}
      />

      <TransactionProcessModal
        visible={showTransactionModal}
        onClose={() => setShowTransactionModal(false)}
      />

      <TapCardModal visible={showTapCardModal} onClose={handleCancelTapCard} />
    </View>
  );
};

export default OrderProcessingScreen;
