/* eslint-disable unused-imports/no-unused-vars */
import React, { useState, useMemo, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StatusBar,
  TouchableOpacity,
  FlatList,
  Image,
  TextInput,
  ScrollView,
  // ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Colors } from '../../utils/Colors';
import { S, VS } from '../../utils/Responsive';
import { Caption, Body2, Body3, Subtitle1, Subtitle2, H4, ButtonText } from '../../utils/fonts';
import { IconSize12, IconSize40, IconSize20, IconSize24 } from '../../utils/IconSizes';
import {
  CategoriesIcon,
  CashIcon,
  CardIcon,
  DeleteIcon,
  RefreshICon,
  ChipIcon,
  DiscountIcon,
  DollarIcon,
  BuyersIcon,
  ImageFrameIcon,
  LeftArrowIcon,
  RightArrowIcon,
  WarningIcon,
  SearchIcon,
  ListIcon,
  TickIcon,
} from '../../assets/Images';
import styles from './SaleScreenStyles';
import ConfirmationModal from '../../components/ConfirmationModal';
import SuccessModal from '../../components/SuccessModal';
import TipModal from '../../components/TipModal';
import BuyerInfoModal from '../../components/BuyerInfoModal';
import CashPayModal from '../../components/CashPayModal';
import TransactionProcessModal from '../../components/TransactionProcessModal';
import InvoiceModal from '../../components/InvoiceModal';
import TapCardModal from '../../components/TapCardModal';
import KitchenInvoiceModal from '../../components/KitchenInvoiceModal';
import QuickSaleModal from '../../components/QuickSaleModal';
import SwipeableCartItem from '../../components/SwipeableCartItem';
import NfcManager, { NfcTech } from 'react-native-nfc-manager';
import Toast from 'react-native-toast-message';
import { GET_ALL_CATEGORIES, GET_ALL_PRODUCTS_WITH_INVENTORY } from '../../services/ProductService';
import { useSelector } from 'react-redux';

const SaleScreen = () => {
  const navigation = useNavigation();
  const { store_id } = useSelector(state => state.user);

  const [cart, setCart] = useState([]);
  const [paymentType, setPaymentType] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isAllCategoriesView, setIsAllCategoriesView] = useState(false);
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
  const [searchQuery, setSearchQuery] = useState('');

  const [productSearchQuery, setProductSearchQuery] = useState({
    page: 1,
    itemsPerPage: 20,
    searchText: '',
    getAll: 'false',
    limited: 'false',
    storeId: store_id,
    category_id: '',
  });
  const [products, setProducts] = useState([]);
  const [productsData, setProductsData] = useState(null);

  const [categorySearchQuery, setCategorySearchQuery] = useState({
    page: 1,
    itemsPerPage: 10,
    searchText: '',
    getAll: 'false',
    limited: 'false',
    storeId: store_id,
  });
  const [categories, setCategories] = useState([]);
  const [categoriesData, setCategoriesData] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const categoryScrollRef = useRef(null);
  const scrollOffset = useRef(0);

  const handleFetchAllCategories = async query => {
    try {
      const response = await GET_ALL_CATEGORIES(query);
      setCategories(response?.items);
      setCategoriesData(response);
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Error fetching categories',
        text2: error.message,
      });
    }
  };

  const handleFetchAllProducts = async query => {
    try {
      const response = await GET_ALL_PRODUCTS_WITH_INVENTORY(query);
      setProducts(response?.items);
      setProductsData(response);
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Error fetching products',
        text2: error.message,
      });
    }
  };

  useEffect(() => {
    handleFetchAllCategories(categorySearchQuery);
  }, [categorySearchQuery]);

  useEffect(() => {
    handleFetchAllProducts(productSearchQuery);
  }, [productSearchQuery]);

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

  const addToCart = item => {
    const existing = cart.find(c => c.id === item.id);

    if (existing) {
      setCart(cart.map(c => (c.id === item.id ? { ...c, qty: c.qty + 1 } : c)));
    } else {
      setCart([...cart, { ...item, qty: 1 }]);
    }
  };

  const removeFromCart = id => {
    const existing = cart.find(c => c.id === id);
    if (existing.qty === 1) {
      setCart(cart.filter(c => c.id !== id));
    } else {
      setCart(cart.map(c => (c.id === id ? { ...c, qty: c.qty - 1 } : c)));
    }
  };

  const deleteFromCart = id => {
    setCart(cart.filter(c => c.id !== id));
  };

  const total = useMemo(() => {
    const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
    return (subtotal + (parseFloat(tipAmount) || 0)).toFixed(2);
  }, [cart, tipAmount]);

  const renderProduct = ({ item }) => (
    <TouchableOpacity
      style={styles.productCard}
      activeOpacity={0.5}
      onPress={() => addToCart(item)}
    >
      <View style={styles.priceTag}>
        <Text style={[styles.priceText, Caption]}>$ {item.price}</Text>
      </View>
      <Image source={ImageFrameIcon} style={styles.productImage} />
      <Text style={[styles.productName, Subtitle2]}>{item.name}</Text>
    </TouchableOpacity>
  );

  const HandleDeleteCart = () => {
    if (cart.length === 0) {
      return;
    }
    setShowDeleteModal(true);
  };

  const confirmDeleteCart = () => {
    setCart([]);
    setTipAmount(null);
    setBuyerInfo(null);
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
    if (paymentType === 'cash') {
      setShowCashPayModal(true);
    } else if (paymentType === 'card') {
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
  };

  const handleCashProceed = () => {
    setShowCashPayModal(false);
    setShowInvoiceModal(true);
  };

  const handlePrintReceipt = () => {
    // Placeholder for print logic
    setShowInvoiceModal(false);
    setCart([]);
    setTipAmount(null);
    setBuyerInfo(null);
  };

  const handleQuickSale = ({ name, price }) => {
    const quickItem = {
      id: `quick_${Date.now()}`,
      name,
      price,
      category: 'Quick Sale',
    };
    addToCart(quickItem);
    setShowQuickSaleModal(false);
  };

  const categoriesItems = useMemo(() => {
    return categories?.map(cat => ({
      _id: cat?._id,
      name: cat?.category_name,
    }));
  }, [categories]);

  const productItems = useMemo(() => {
    return products?.map(product => ({
      _id: product?._id,
      name: product?.product_name,
      price: product?.price,
      quantity: product?.quantity,
      quantitySold: product?.quantitySold,
      bar_code: product?.bar_code,
    }));
  }, [products]);

  return (
    <View style={styles.root}>
      <StatusBar backgroundColor={Colors.primary} barStyle="light-content" />

      {/* ───── LEFT PRODUCT PANEL ───── */}
      <View style={styles.leftPanel}>
        {/* Header */}
        <View style={styles.header}>
          {/* Hamburger Menu */}
          <TouchableOpacity style={styles.hamburgerBtn} onPress={() => navigation.openDrawer()}>
            <View style={styles.hamburgerLine} />
            <View style={[styles.hamburgerLine, styles.hamburgerLineShort]} />
            <View style={styles.hamburgerLine} />
          </TouchableOpacity>
          {/* Search Bar */}
          <View style={styles.searchBar}>
            <Image source={SearchIcon} style={[IconSize12, { marginRight: S(8) }]} />
            <TextInput
              style={[styles.searchInput, Body3]}
              placeholder="Search..."
              placeholderTextColor={'#999'}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>

          {/* All Categories */}
          <TouchableOpacity
            style={styles.allCategoryBtn}
            onPress={() => setIsAllCategoriesView(!isAllCategoriesView)}
          >
            <Image source={CategoriesIcon} style={[IconSize12, styles.categoryIcon]} />
            <Text style={[styles.allCategoryText, Subtitle2]}>All Categories</Text>
          </TouchableOpacity>

          {/* Grid/List Toggle */}
          <TouchableOpacity
            style={styles.viewToggle}
            onPress={() => {
              setSelectedCategory('All');
              setIsAllCategoriesView(false);
            }}
          >
            <Image source={ListIcon} style={[IconSize20, styles.viewToggleIcon]} />
          </TouchableOpacity>
        </View>

        {/* Categories */}
        {isAllCategoriesView ? (
          <View style={{ marginBottom: VS(16), paddingHorizontal: S(6) }}>
            <Text style={[Subtitle1, { color: Colors.black }]}>
              Total Categories: {categories.length - 1}
            </Text>
          </View>
        ) : (
          <View style={styles.categoryRow}>
            <TouchableOpacity
              style={styles.categoryArrow}
              onPress={() => {
                const prevX = Math.max(0, scrollOffset.current - 200);
                categoryScrollRef.current?.scrollTo({ x: prevX, animated: true });
              }}
            >
              <Image source={LeftArrowIcon} style={[IconSize12, styles.arrowIcon]} />
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
              {categoriesItems?.map((cat, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => setSelectedCategory(cat)}
                  style={[
                    styles.categoryBtn,
                    selectedCategory?._id === cat?._id && styles.activeCategory,
                  ]}
                >
                  <Text
                    style={[
                      styles.categoryText,
                      Body3,
                      selectedCategory?._id === cat?._id && styles.activeCategoryText,
                    ]}
                  >
                    {cat?.name}
                  </Text>
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
              <Image source={RightArrowIcon} style={[IconSize12, styles.arrowIcon]} />
            </TouchableOpacity>
          </View>
        )}

        {/* Product Grid */}
        {isAllCategoriesView ? (
          <FlatList
            data={categories.filter(c => c !== 'All')}
            keyExtractor={item => item}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.categoryGridCard}
                activeOpacity={0.5}
                onPress={() => {
                  setSelectedCategory(item);
                  setIsAllCategoriesView(false);
                }}
              >
                <Text style={[styles.categoryGridText, Subtitle2]}>{item}</Text>
              </TouchableOpacity>
            )}
            numColumns={5}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.productListContent}
          />
        ) : (
          <FlatList
            data={productItems}
            keyExtractor={item => item?._id}
            renderItem={renderProduct}
            numColumns={5}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.productListContent}
            // onEndReached={loadMoreProducts}
            onEndReachedThreshold={0.5}
            // ListFooterComponent={
            //   isLoadingMore ? (
            //     <View style={styles.listFooterLoadingView}>
            //       <ActivityIndicator size="large" color={Colors.primary} />
            //     </View>
            //   ) : null
            // }
          />
        )}
      </View>

      {/* ───── RIGHT CART PANEL ───── */}
      <View style={styles.cartPanel}>
        {/* Cart Header Icons */}
        <View style={styles.cartHeader}>
          <TouchableOpacity onPress={() => setShowKitchenInvoiceModal(true)}>
            <Image source={RefreshICon} style={[IconSize20, styles.cartHeaderIcon]} />
          </TouchableOpacity>
          <TouchableOpacity>
            <Image source={ChipIcon} style={[IconSize20, styles.cartHeaderIcon]} />
          </TouchableOpacity>
          <TouchableOpacity onPress={HandleDeleteCart}>
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
              <SwipeableCartItem onDelete={() => deleteFromCart(item.id)}>
                <View style={styles.cartItem}>
                  <View>
                    <Text style={[styles.cartItemName, Subtitle2]}>{item.name}</Text>
                    <Text style={[styles.cartItemPrice, Body3]}>
                      $ {item.price} x {item.qty}
                    </Text>
                  </View>

                  <View style={styles.qtyControls}>
                    <TouchableOpacity onPress={() => removeFromCart(item.id)} style={styles.qtyBtn}>
                      <Text style={[styles.qtyBtnText, ButtonText]}>−</Text>
                    </TouchableOpacity>

                    <Text style={[styles.qtyText, Body2]}>{item.qty}</Text>

                    <TouchableOpacity onPress={() => addToCart(item)} style={styles.qtyBtn}>
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
            <Image source={DiscountIcon} style={[IconSize12, styles.actionIcon]} />
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
        onPrintReceipt={handlePrintReceipt}
        onClose={() => setShowInvoiceModal(false)}
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

export default SaleScreen;
