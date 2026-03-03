import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  FlatList,
  Image,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Colors } from '../../utils/Colors';
import { IconSize8, IconSize12, IconSize16 } from '../../utils/IconSizes';
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
} from '../../assets/Images';

const categories = [
  'Drikkevarer',
  'Pizza',
  'Burgers',
  'A la carte',
  'Frozen Items',
  'Pet Food',
  'Grains',
];

const dummyProducts = Array.from({ length: 20 }).map((_, i) => ({
  id: i.toString(),
  name: 'Sodavand (25cl)',
  price: 16.23,
}));

const HomeScreen = () => {
  const navigation = useNavigation();
  const [selectedCategory, setSelectedCategory] = useState('Drikkevarer');
  const [cart, setCart] = useState([]);
  const [paymentType, setPaymentType] = useState(null);

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

  const total = useMemo(() => {
    return cart
      .reduce((sum, item) => sum + item.price * item.qty, 0)
      .toFixed(2);
  }, [cart]);

  const renderProduct = ({ item }) => (
    <TouchableOpacity
      style={styles.productCard}
      activeOpacity={0.8}
      onPress={() => addToCart(item)}
    >
      <View style={styles.priceTag}>
        <Text style={styles.priceText}>€ {item.price}</Text>
      </View>
      <Image source={ImageFrameIcon} style={styles.productImage} />
      <Text style={styles.productName}>{item.name}</Text>
    </TouchableOpacity>
  );

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

          {/* Language Badges */}
          <View style={styles.langBadges}>
            <View style={[styles.langBadge, styles.langBadgeEn]}>
              <Text style={styles.langBadgeText}>En</Text>
            </View>
            <View style={[styles.langBadge, styles.langBadgeDo]}>
              <Text style={styles.langBadgeText}>Do</Text>
            </View>
          </View>

          {/* Search Bar */}
          <View style={styles.searchBar}>
            <Text style={styles.searchPlaceholder}>🔍  Search...</Text>
          </View>

          {/* All Categories */}
          <TouchableOpacity style={styles.allCategoryBtn}>
            <Image source={CategoriesIcon} style={[IconSize12, styles.categoryIcon]} />
            <Text style={styles.allCategoryText}>All Categories</Text>
          </TouchableOpacity>

          {/* Grid/List Toggle */}
          <TouchableOpacity style={styles.viewToggle}>
            <Image source={ChipIcon} style={[IconSize16, styles.viewToggleIcon]} />
          </TouchableOpacity>
        </View>

        {/* Categories */}
        <View style={styles.categoryRow}>
          <TouchableOpacity style={styles.categoryArrow}>
            <Image source={LeftArrowIcon} style={[IconSize12, styles.arrowIcon]} />
          </TouchableOpacity>
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
                  styles.categoryText,
                  selectedCategory === cat && styles.activeCategoryText,
                ]}
              >
                {cat}
              </Text>
            </TouchableOpacity>
          ))}
          <TouchableOpacity style={styles.categoryArrow}>
            <Image source={RightArrowIcon} style={[IconSize12, styles.arrowIcon]} />
          </TouchableOpacity>
        </View>

        {/* Product Grid */}
        <FlatList
          data={dummyProducts}
          keyExtractor={item => item.id}
          renderItem={renderProduct}
          numColumns={5}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.productListContent}
        />
      </View>

      {/* ───── RIGHT CART PANEL ───── */}
      <View style={styles.cartPanel}>
        {/* Cart Header Icons */}
        <View style={styles.cartHeader}>
          <TouchableOpacity style={styles.cartHeaderBtn}>
            <Image source={RefreshICon} style={[IconSize16, styles.cartHeaderIcon]} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.cartHeaderBtn}>
            <Image source={ChipIcon} style={[IconSize16, styles.cartHeaderIcon]} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.cartHeaderBtn}>
            <Image source={DeleteIcon} style={[IconSize16, styles.cartHeaderIcon]} />
          </TouchableOpacity>
        </View>

        {cart.length === 0 ? (
          <View style={styles.emptyCart}>
            <Text style={styles.emptyCartText}>Shopping Cart is empty!</Text>
          </View>
        ) : (
          <FlatList
            data={cart}
            keyExtractor={item => item.id}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => (
              <View style={styles.cartItem}>
                <View>
                  <Text style={styles.cartItemName}>{item.name}</Text>
                  <Text style={styles.cartItemPrice}>€ {item.price} x {item.qty}</Text>
                </View>

                <View style={styles.qtyControls}>
                  <TouchableOpacity
                    onPress={() => removeFromCart(item.id)}
                    style={styles.qtyBtn}
                  >
                    <Text style={styles.qtyBtnText}>−</Text>
                  </TouchableOpacity>

                  <Text style={styles.qtyText}>{item.qty}</Text>

                  <TouchableOpacity
                    onPress={() => addToCart(item)}
                    style={styles.qtyBtn}
                  >
                    <Text style={styles.qtyBtnText}>+</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          />
        )}

        {/* Action Buttons */}
        <View style={styles.actionRow}>
          <TouchableOpacity style={styles.actionBtn}>
            <Image source={DiscountIcon} style={[IconSize8, styles.actionIcon]} />
            <Text style={styles.actionLabelText}>Quick Sale</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionBtn}>
            <Image source={DollarIcon} style={[IconSize8, styles.actionIcon]} />
            <Text style={styles.actionLabelText}>Add TIP</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionBtn}>
            <Image source={BuyersIcon} style={[IconSize8, styles.actionIcon]} />
            <Text style={styles.actionLabelText}>Buyer Details</Text>
          </TouchableOpacity>
        </View>

        {/* Total Section */}
        <View style={styles.totalSection}>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalAmount}>DKK {total}</Text>
          </View>

          <View style={styles.paymentRow}>
            <TouchableOpacity
              style={[
                styles.paymentBtn,
                paymentType === 'cash' && styles.activePayment,
              ]}
              onPress={() => setPaymentType('cash')}
            >
              <Image source={CashIcon} style={[IconSize12, styles.paymentIcon]} />
              <Text style={styles.paymentBtnText}>Cash Pay</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.paymentBtn,
                paymentType === 'card' && styles.activePayment,
              ]}
              onPress={() => setPaymentType('card')}
            >
              <Image source={CardIcon} style={[IconSize12, styles.paymentIcon]} />
              <Text style={styles.paymentBtnText}>Card Pay</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.placeOrderBtn}>
            <Text style={styles.placeOrderText}>Place Order</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  root: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: Colors.white,
  },

  // ─── Left Panel ───
  leftPanel: {
    flex: 0.68,
    backgroundColor: '#EBF0FF',
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  hamburgerBtn: {
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  hamburgerLine: {
    width: 22,
    height: 2.5,
    backgroundColor: Colors.black,
    borderRadius: 2,
    marginVertical: 2,
  },
  hamburgerLineShort: {
    width: 16,
    alignSelf: 'flex-start',
    marginLeft: 7,
  },

  // ─── Language Badges ───
  langBadges: {
    flexDirection: 'row',
    marginRight: 12,
  },
  langBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 4,
  },
  langBadgeEn: {
    backgroundColor: Colors.secondary,
  },
  langBadgeDo: {
    backgroundColor: Colors.primary,
  },
  langBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.white,
  },

  // ─── Search Bar ───
  searchBar: {
    flex: 1,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.white,
    justifyContent: 'center',
    paddingHorizontal: 16,
    marginRight: 12,
  },
  searchPlaceholder: {
    fontSize: 14,
    color: Colors.grey,
  },

  // ─── All Categories ───
  allCategoryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    marginRight: 8,
  },
  categoryIcon: {
    tintColor: Colors.white,
    marginRight: 6,
  },
  allCategoryText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.white,
  },

  // ─── View Toggle ───
  viewToggle: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: Colors.white,
    justifyContent: 'center',
    alignItems: 'center',
  },
  viewToggleIcon: {
    tintColor: Colors.primary,
  },

  // ─── Categories ───
  categoryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  categoryArrow: {
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  arrowIcon: {
    tintColor: Colors.primary,
  },
  categoryBtn: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: Colors.white,
    marginRight: 8,
  },
  activeCategory: {
    borderWidth: 1.5,
    borderColor: Colors.primary,
  },
  categoryText: {
    fontSize: 13,
    fontWeight: '400',
    color: Colors.black,
  },
  activeCategoryText: {
    fontWeight: '600',
    color: Colors.primary,
  },

  // ─── Product Grid ───
  productListContent: {
    paddingBottom: 40,
  },
  productCard: {
    flex: 1,
    backgroundColor: Colors.white,
    margin: 6,
    borderRadius: 14,
    padding: 10,
    alignItems: 'center',
    minWidth: 100,
  },
  priceTag: {
    alignSelf: 'flex-end',
    marginBottom: 4,
  },
  priceText: {
    fontSize: 11,
    color: Colors.grey,
  },
  productImage: {
    height: 50,
    width: 50,
    resizeMode: 'contain',
    marginBottom: 8,
    opacity: 0.4,
  },
  productName: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.black,
  },

  // ─── Cart Panel ───
  cartPanel: {
    flex: 0.32,
    backgroundColor: Colors.white,
    borderLeftWidth: 1,
    borderLeftColor: Colors.lightGrey,
    padding: 16,
  },
  cartHeader: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 12,
  },
  cartHeaderBtn: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: '#F5F7FA',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
  cartHeaderIcon: {
    tintColor: Colors.black,
  },
  emptyCart: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyCartText: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.grey,
  },
  cartItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightGrey,
  },
  cartItemName: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.black,
  },
  cartItemPrice: {
    fontSize: 13,
    color: Colors.grey,
  },
  qtyControls: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  qtyBtn: {
    width: 28,
    height: 28,
    borderRadius: 6,
    backgroundColor: Colors.lightGrey,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 6,
  },
  qtyBtnText: {
    fontSize: 16,
    fontWeight: '600',
  },
  qtyText: {
    fontSize: 14,
  },

  // ─── Action Buttons ───
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.lightGrey,
    paddingTop: 12,
  },
  actionBtn: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.lightGrey,
    marginHorizontal: 4,
  },
  actionIcon: {
    tintColor: Colors.black,
  },
  actionLabelText: {
    fontSize: 11,
    color: Colors.black,
    marginTop: 4,
  },

  // ─── Total Section ───
  totalSection: {
    borderTopWidth: 1,
    borderTopColor: Colors.lightGrey,
    paddingTop: 12,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '600',
  },
  totalAmount: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.black,
  },
  paymentRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  paymentBtn: {
    flex: 1,
    flexDirection: 'row',
    height: 45,
    borderRadius: 10,
    backgroundColor: '#E8EEF8',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 4,
  },
  activePayment: {
    borderWidth: 2,
    borderColor: Colors.primary,
  },
  paymentIcon: {
    tintColor: Colors.primary,
    marginRight: 8,
  },
  paymentBtnText: {
    fontSize: 14,
    fontWeight: '600',
  },
  placeOrderBtn: {
    height: 50,
    borderRadius: 12,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeOrderText: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.white,
  },
});
