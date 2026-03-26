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
  clearSearchBtn: {
    width: S(28),
    height: VS(28),
    borderRadius: MS(14),
    backgroundColor: Colors.white,
    justifyContent: 'center',
    alignItems: 'center',
  },
  clearSearchText: {
    color: Colors.grey,
  },

  // ─── Empty Search ───
  emptySearch: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptySearchText: {
    color: Colors.black,
    textAlign: 'center',
    lineHeight: VS(24),
  },

  // ─── Product Grid ───
  productListContent: {
    paddingBottom: VS(40),
  },
  productCard: {
    flex: 1,
    maxWidth: '18%',
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
    textAlign: 'center',
  },
  qtyLabel: {
    color: Colors.grey,
    marginTop: VS(4),
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
  cartHeaderIcon: {
    tintColor: Colors.black,
  },
  emptyCart: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyCartText: {
    color: '#E74C3C',
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
  totalLabel: {},
  totalAmount: {
    color: Colors.black,
  },
  refundAmount: {
    color: '#E74C3C',
  },
  proceedBtn: {
    height: VS(50),
    borderRadius: MS(12),
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  proceedBtnDisabled: {
    backgroundColor: Colors.lightGrey,
  },
  proceedBtnText: {
    color: Colors.white,
  },
});

export default styles;
