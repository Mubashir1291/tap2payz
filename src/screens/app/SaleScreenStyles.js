import { StyleSheet } from 'react-native';
import { Colors } from '../../utils/Colors';
import { S, VS, MS } from '../../utils/Responsive';

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
    padding: MS(16),
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: VS(16),
  },
  hamburgerBtn: {
    width: S(36),
    height: VS(36),
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: S(10),
  },
  hamburgerLine: {
    width: S(22),
    height: VS(2.5),
    backgroundColor: Colors.black,
    borderRadius: MS(2),
    marginVertical: VS(2),
  },
  hamburgerLineShort: {
    width: S(16),
    alignSelf: 'flex-start',
    marginLeft: S(7),
  },

  // ─── Language Badges ───
  langBadges: {
    flexDirection: 'row',
    marginRight: S(12),
  },
  langBadge: {
    width: S(28),
    height: VS(28),
    borderRadius: MS(14),
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: S(4),
  },
  langBadgeDo: {
    backgroundColor: Colors.primary,
  },
  langBadgeText: {
    color: Colors.white,
  },

  // ─── Search Bar ───
  searchBar: {
    flex: 1,
    height: VS(40),
    borderRadius: MS(20),
    backgroundColor: Colors.white,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: S(16),
    marginRight: S(12),
  },

  searchInput: {
    flex: 1,
    color: Colors.black,
    padding: 0,
  },

  // ─── All Categories ───
  allCategoryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary,
    paddingHorizontal: S(16),
    paddingVertical: VS(10),
    borderRadius: MS(20),
    marginRight: S(8),
  },
  categoryIcon: {
    tintColor: Colors.white,
    marginRight: S(6),
  },
  allCategoryText: {
    color: Colors.white,
  },

  // ─── View Toggle ───
  viewToggle: {
    width: S(40),
    height: VS(40),
    borderRadius: MS(10),
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
    marginBottom: VS(16),
  },
  categoryArrow: {
    width: S(30),
    height: VS(30),
    justifyContent: 'center',
    alignItems: 'center',
  },
  arrowIcon: {
    tintColor: Colors.primary,
  },
  categoryBtn: {
    paddingHorizontal: S(16),
    paddingVertical: VS(8),
    borderRadius: MS(20),
    backgroundColor: Colors.white,
    marginRight: S(12),
  },
  activeCategory: {
    borderWidth: VS(1.5),
    borderColor: Colors.primary,
  },
  categoryText: {
    color: Colors.black,
  },
  activeCategoryText: {
    color: Colors.primary,
  },

  // ─── Category Grid (for All Categories View) ───
  categoryGridCard: {
    flex: 1,
    maxWidth: '18%',
    backgroundColor: Colors.white,
    margin: MS(6),
    borderRadius: MS(14),
    padding: MS(16),
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: S(100),
    height: VS(110),
  },
  categoryGridImage: {
    height: VS(32),
    width: S(32),
    resizeMode: 'contain',
    marginBottom: VS(12),
    tintColor: Colors.primary,
  },
  categoryGridText: {
    color: Colors.black,
    textAlign: 'center',
  },

  // ─── Product Grid ───
  productListContent: {
    paddingBottom: VS(40),
  },
  productCard: {
    flex: 1,
    maxWidth: '18%', // Prevents single items from stretching full width
    backgroundColor: Colors.white,
    margin: MS(6),
    borderRadius: MS(14),
    padding: MS(10),
    alignItems: 'center',
    minWidth: S(100),
  },
  priceTag: {
    alignSelf: 'flex-end',
    marginBottom: VS(4),
  },
  priceText: {
    color: Colors.grey,
  },
  productImage: {
    height: VS(50),
    width: S(50),
    resizeMode: 'contain',
    marginBottom: VS(8),
    opacity: 0.4,
  },
  productName: {
    color: Colors.black,
  },

  // ─── Cart Panel ───
  cartPanel: {
    flex: 0.32,
    backgroundColor: Colors.white,
    borderLeftWidth: VS(1),
    borderLeftColor: Colors.lightGrey,
    padding: MS(16),
  },
  cartHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: VS(12),
  },
  cartHeaderBtn: {
    width: S(40),
    height: VS(40),
    borderRadius: MS(10),
    backgroundColor: '#F5F7FA',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: S(10),
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
    color: Colors.grey,
  },
  cartItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: VS(12),
    borderBottomWidth: VS(1),
    borderBottomColor: Colors.lightGrey,
  },
  cartItemName: {
    color: Colors.black,
  },
  cartItemPrice: {
    color: Colors.grey,
  },
  qtyControls: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  qtyBtn: {
    width: S(28),
    height: VS(28),
    borderRadius: MS(6),
    backgroundColor: Colors.lightGrey,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: S(6),
  },
  qtyBtnText: {},
  qtyText: {},

  // ─── Action Buttons ───
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: VS(12),
    borderTopWidth: VS(1),
    borderTopColor: Colors.lightGrey,
    paddingTop: VS(12),
  },
  actionBtn: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: VS(10),
    borderRadius: MS(10),
    borderWidth: VS(1),
    borderColor: Colors.lightGrey,
    marginHorizontal: S(4),
  },
  actionIcon: {
    tintColor: Colors.black,
  },
  actionLabelText: {
    color: Colors.black,
    marginTop: VS(4),
  },
  tipIconContainer: {
    position: 'relative',
  },
  tickIcon: {
    position: 'absolute',
    top: -VS(4),
    right: -S(35),
    width: S(12),
    height: VS(12),
    resizeMode: 'contain',
  },

  // ─── Total Section ───
  totalSection: {
    borderTopWidth: VS(1),
    borderTopColor: Colors.lightGrey,
    paddingTop: VS(12),
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: VS(12),
  },
  tipRowMargin: {
    marginBottom: VS(8),
  },
  tipLabelColor: {
    color: Colors.grey,
  },
  tipAmountColor: {
    color: '#4CAF50',
  },
  listFooterLoadingView: {
    paddingVertical: VS(20),
    alignItems: 'center',
  },
  totalLabel: {},
  totalAmount: {
    color: Colors.black,
  },
  paymentRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: VS(12),
  },
  paymentBtn: {
    flex: 1,
    flexDirection: 'row',
    height: VS(45),
    borderRadius: MS(10),
    backgroundColor: '#E8EEF8',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: S(4),
  },
  activePayment: {
    borderWidth: VS(2),
    borderColor: Colors.primary,
  },
  paymentIcon: {
    tintColor: Colors.primary,
    marginRight: S(8),
  },
  paymentBtnText: {},
  placeOrderBtn: {
    height: VS(50),
    borderRadius: MS(12),
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeOrderText: {
    color: Colors.white,
  },
});

export default styles;
