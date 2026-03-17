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
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Colors } from '../../utils/Colors';
import { S, VS, MS } from '../../utils/Responsive';
import { Caption, Body2, Body3, Subtitle1, Subtitle2, H4, ButtonText } from '../../utils/fonts';
import { IconSize8, IconSize12, IconSize32, IconSize40, IconSize20 } from '../../utils/IconSizes';
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
import styles from './HomeScreenStyles';
import ConfirmationModal from '../../components/ConfirmationModal';
import TipModal from '../../components/TipModal';
import BuyerInfoModal from '../../components/BuyerInfoModal';
import CashPayModal from '../../components/CashPayModal';
import TransactionProcessModal from '../../components/TransactionProcessModal';
import InvoiceModal from '../../components/InvoiceModal';
import KitchenInvoiceModal from '../../components/KitchenInvoiceModal';
import QuickSaleModal from '../../components/QuickSaleModal';
import SwipeableCartItem from '../../components/SwipeableCartItem';
import { IconSize24 } from '../../utils/IconSizes';

const categories = [
  'All',
  'Drink',
  'Pizza',
  'Burgers',
  'A la carte',
  'Frozen Items',
  'Pet Food',
  'Grains',
  'shawarma',
  'Donuts',
  'Juice',
];

const dummyProducts = [
  { id: '1', name: 'Cola (25cl)', category: 'Drink', price: 16.23 },
  { id: '2', name: 'Orange Juice', category: 'Drink', price: 18.5 },
  { id: '3', name: 'Mineral Water', category: 'Drink', price: 12.0 },

  { id: '4', name: 'Margherita Pizza', category: 'Pizza', price: 85.0 },
  { id: '5', name: 'Pepperoni Pizza', category: 'Pizza', price: 95.0 },
  { id: '6', name: 'BBQ Chicken Pizza', category: 'Pizza', price: 110.0 },

  { id: '7', name: 'Classic Beef Burger', category: 'Burgers', price: 70.0 },
  { id: '8', name: 'Zinger Burger', category: 'Burgers', price: 75.0 },
  { id: '9', name: 'Cheese Burger', category: 'Burgers', price: 65.0 },

  { id: '10', name: 'Grilled Chicken Steak', category: 'A la carte', price: 140.0 },
  { id: '11', name: 'Fish Fillet', category: 'A la carte', price: 130.0 },
  { id: '12', name: 'Pasta Alfredo', category: 'A la carte', price: 120.0 },

  { id: '13', name: 'Frozen Fries (1kg)', category: 'Frozen Items', price: 40.0 },
  { id: '14', name: 'Frozen Nuggets (500g)', category: 'Frozen Items', price: 55.0 },
  { id: '15', name: 'Ice Cream Tub', category: 'Frozen Items', price: 90.0 },

  { id: '16', name: 'Dog Food (5kg)', category: 'Pet Food', price: 250.0 },
  { id: '17', name: 'Cat Food (2kg)', category: 'Pet Food', price: 180.0 },

  { id: '18', name: 'Basmati Rice (1kg)', category: 'Grains', price: 60.0 },
  { id: '19', name: 'Wheat Flour (5kg)', category: 'Grains', price: 220.0 },
  { id: '20', name: 'Lentils (500g)', category: 'Grains', price: 45.0 },
   { id: '21', name: 'shawarma (500g)', category: 'shawarma', price: 45.0 },
    { id: '22', name: 'donuts (500g)', category: 'Donuts', price: 45.0 },
     { id: '23', name: 'juice (500g)', category: 'Juice', price: 45.0 },
     { id: '24', name: 'juice (500g)', category: 'Juice', price: 45.0 },

     { id: '25', name: 'juice (500g)', category: 'Juice', price: 45.0 },

     { id: '26', name: 'juice (500g)', category: 'Juice', price: 45.0 },

];

const HomeScreen = () => {
  const navigation = useNavigation();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [cart, setCart] = useState([]);
  const [paymentType, setPaymentType] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isAllCategoriesView, setIsAllCategoriesView] = useState(false);
  const [tipAmount, setTipAmount] = useState(null);
  const [showTipModal, setShowTipModal] = useState(false);
  const [buyerInfo, setBuyerInfo] = useState(null);
  const [showBuyerModal, setShowBuyerModal] = useState(false);
  const [showCashPayModal, setShowCashPayModal] = useState(false);
  const [showTransactionModal, setShowTransactionModal] = useState(false);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [showKitchenInvoiceModal, setShowKitchenInvoiceModal] = useState(false);
  const [showQuickSaleModal, setShowQuickSaleModal] = useState(false);
  const categoryScrollRef = useRef(null);
  const scrollOffset = useRef(0);

  const [page, setPage] = useState(1);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const ITEMS_PER_PAGE = 25; // 5 rows of 5 items

  const filteredProducts = useMemo(() => {
    if (searchQuery.trim()) {
      // When searching, search from ALL products regardless of selected category
      return dummyProducts.filter(p =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    }
    return selectedCategory === 'All'
      ? dummyProducts
      : dummyProducts.filter(p => p.category === selectedCategory);
  }, [selectedCategory, searchQuery]);

  useEffect(() => {
    setPage(1);
  }, [selectedCategory, searchQuery]);

  const displayedProducts = useMemo(() => {
    return filteredProducts.slice(0, page * ITEMS_PER_PAGE);
  }, [filteredProducts, page]);

  const loadMoreProducts = () => {
    if (page * ITEMS_PER_PAGE < filteredProducts.length && !isLoadingMore) {
      setIsLoadingMore(true);
      // Simulate network request delay (800ms)
      setTimeout(() => {
        setPage(prev => prev + 1);
        setIsLoadingMore(false);
      }, 800);
    }
  };

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
    return cart
      .reduce((sum, item) => sum + item.price * item.qty, 0)
      .toFixed(2);
  }, [cart]);

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
    if (cart.length === 0) return;
    setShowDeleteModal(true);
  };

  const confirmDeleteCart = () => {
    setCart([]);
    setShowDeleteModal(false);
  };

  const handleOpenTipModal = () => {
    setShowTipModal(true);
  };

  const handleAddTip = (amount) => {
    setTipAmount(amount);
    setShowTipModal(false);
  };

  const handleSaveTip = (amount) => {
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

  const handleAddBuyerInfo = (info) => {
    setBuyerInfo(info);
    setShowBuyerModal(false);
  };

  const handleSaveBuyerInfo = (info) => {
    setBuyerInfo(info);
    setShowBuyerModal(false);
  };

  const handleDeleteBuyerInfo = () => {
    setBuyerInfo(null);
    setShowBuyerModal(false);
  };

  const handlePlaceOrder = () => {
    if (cart.length === 0) return;
    if (paymentType === 'cash') {
      setShowCashPayModal(true);
    } else if (paymentType === 'card') {
      setShowTransactionModal(true);
      // Simulate card processing, then show invoice after 3 seconds
      setTimeout(() => {
        setShowTransactionModal(false);
        setShowInvoiceModal(true);
      }, 3000);
    }
  };

  const handleCashProceed = (amountPaid) => {
    setShowCashPayModal(false);
    setShowInvoiceModal(true);
  };

  const handlePrintReceipt = () => {
    // Placeholder for print logic
    setShowInvoiceModal(false);
  };

  const handleQuickSale = ({name, price}) => {
    const quickItem = {
      id: `quick_${Date.now()}`,
      name,
      price,
      category: 'Quick Sale',
    };
    addToCart(quickItem);
    setShowQuickSaleModal(false);
  };

  return (
    <View style={styles.root}>
      <StatusBar backgroundColor={Colors.primary} barStyle="light-content" />

      {/* ───── LEFT PRODUCT PANEL ───── */}
      <View style={styles.leftPanel}>
        {/* Header */}
        <View style={styles.header}>
          {/* Hamburger Menu */}
          <TouchableOpacity
            style={styles.hamburgerBtn}
            onPress={() => navigation.openDrawer()}
          >
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
            onScroll={(e) => {
              scrollOffset.current = e.nativeEvent.contentOffset.x;
            }}
            scrollEventThrottle={16}
          >
            {categories.map(cat => (
              <TouchableOpacity
                key={cat}
                onPress={() => setSelectedCategory(cat)}
                style={[
                  styles.categoryBtn,
                  selectedCategory === cat && styles.activeCategory,
                ]}
              >
                <Text
                  style={[
                    styles.categoryText, Body3,
                    selectedCategory === cat && styles.activeCategoryText,
                  ]}
                >
                  {cat}
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
            data={displayedProducts}
            keyExtractor={item => item.id}
            renderItem={renderProduct}
            numColumns={5}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.productListContent}
            onEndReached={loadMoreProducts}
            onEndReachedThreshold={0.5}
            ListFooterComponent={
              isLoadingMore ? (
                <View style={{ paddingVertical: VS(20), alignItems: 'center' }}>
                  <ActivityIndicator size="large" color={Colors.primary} />
                </View>
              ) : null
            }
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
          <TouchableOpacity >
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
                    <Text style={[styles.cartItemPrice, Body3]}>$ {item.price} x {item.qty}</Text>
                  </View>

                  <View style={styles.qtyControls}>
                    <TouchableOpacity
                      onPress={() => removeFromCart(item.id)}
                      style={styles.qtyBtn}
                    >
                      <Text style={[styles.qtyBtnText, ButtonText]}>−</Text>
                    </TouchableOpacity>

                    <Text style={[styles.qtyText, Body2]}>{item.qty}</Text>

                    <TouchableOpacity
                      onPress={() => addToCart(item)}
                      style={styles.qtyBtn}
                    >
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
              {tipAmount !== null && (
                <Image source={TickIcon} style={styles.tickIcon} />
              )}
            </View>
            <Text style={[styles.actionLabelText, Caption]}>Add TIP</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionBtn} onPress={handleOpenBuyerModal}>
            <View style={styles.tipIconContainer}>
              <Image source={BuyersIcon} style={[IconSize12, styles.actionIcon]} />
              {buyerInfo !== null && (
                <Image source={TickIcon} style={styles.tickIcon} />
              )}
            </View>
            <Text style={[styles.actionLabelText, Caption]}>Buyer Details</Text>
          </TouchableOpacity>
        </View>

        {/* Total Section */}
        <View style={styles.totalSection}>
          <View style={styles.totalRow}>
            <Text style={[styles.totalLabel, Subtitle1]}>Total</Text>
            <Text style={[styles.totalAmount, H4]}>CAD {total}</Text>
          </View>

          <View style={styles.paymentRow}>
            <TouchableOpacity
              style={[
                styles.paymentBtn,
                paymentType === 'cash' && styles.activePayment,
              ]}
              onPress={() => setPaymentType('cash')}
            >
              <Image source={CashIcon} style={[IconSize24, styles.paymentIcon]} />
              <Text style={[styles.paymentBtnText, Subtitle2]}>Cash Pay</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.paymentBtn,
                paymentType === 'card' && styles.activePayment,
              ]}
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

      <InvoiceModal
        visible={showInvoiceModal}
        buyerInfo={buyerInfo}
        cartItems={cart}
        totalAmount={parseFloat(total)}
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
    </View>
  );
};

export default HomeScreen;
