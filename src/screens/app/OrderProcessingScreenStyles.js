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
    backgroundColor: '#c6cdef66', // Light blue background from screenshot
    padding: MS(16),
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: VS(16),
  },
  backBtn: {
    width: S(40),
    height: VS(40),
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: S(10),
  },
  backIcon: {
    tintColor: Colors.black,
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
    backgroundColor: Colors.white,
    borderRadius: MS(15),
    marginHorizontal: S(4),
  },
  arrowIcon: {
    tintColor: Colors.black,
  },
  categoryBtn: {
    paddingHorizontal: S(16),
    paddingVertical: VS(10),
    borderRadius: MS(25),
    backgroundColor: Colors.white,
    marginRight: S(12),
    flexDirection: 'row',
    alignItems: 'center',
    minWidth: S(100),
    justifyContent: 'center',
  },
  activeCategory: {
    backgroundColor: Colors.white,
    borderWidth: VS(1),
    borderColor: '#3E468A',
  },
  categoryText: {
    color: '#3E468A',
    marginLeft: S(6),
  },
  categoryIcon: {
    tintColor: '#3E468A',
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
    height: VS(120),
    justifyContent: 'center',
  },
  priceTag: {
    position: 'absolute',
    top: VS(8),
    right: S(8),
  },
  priceText: {
    color: Colors.black,
  },
  productImage: {
    height: VS(40),
    width: S(40),
    resizeMode: 'contain',
    marginBottom: VS(8),
    opacity: 0.2,
  },
  productName: {
    color: Colors.black,
    textAlign: 'center',
  },

  // ─── Cart Panel ───
  cartPanel: {
    flex: 0.32,
    backgroundColor: Colors.white,
    borderLeftWidth: VS(1),
    borderLeftColor: Colors.lightGrey,
    paddingHorizontal: MS(16),
    paddingTop: VS(16),
  },
  cartPanelHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: VS(20),
  },
  tableInfo: {
    color: Colors.black,
  },
  splitBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#C6CDEF',
    paddingHorizontal: S(12),
    paddingVertical: VS(6),
    borderRadius: MS(20),
  },
  splitIcon: {
    marginRight: S(6),
    tintColor: '#3E468A',
  },
  splitText: {
    color: '#3E468A',
  },
  cashierInfo: {
    color: Colors.black,
  },

  // ─── Cart Item ───
  cartItemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: VS(12),
  },
  cartItem: {
    flex: 1,
    backgroundColor: '#F2F5FF',
    borderRadius: MS(8),
    padding: MS(12),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemMainInfo: {
    flex: 1,
  },
  itemName: {
    color: Colors.black,
    marginBottom: VS(4),
  },
  itemPrice: {
    color: Colors.black,
  },
  itemNote: {
    color: Colors.grey,
    marginTop: VS(4),
    fontStyle: 'italic',
  },
  itemActions: {
    alignItems: 'flex-end',
  },
  addNoteBtn: {
    marginBottom: VS(8),
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    paddingHorizontal: S(12),
    paddingVertical: VS(6),
    borderRadius: MS(20),
  },
  addNoteIcon: {
    marginRight: S(6),
    tintColor: Colors.grey,
  },
  addNoteText: {
    color: Colors.grey,
  },
  qtyRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  qtyBtn: {
    width: S(24),
    height: S(24),
    borderRadius: MS(12),
    backgroundColor: Colors.grey,
    justifyContent: 'center',
    alignItems: 'center',
  },
  qtyBtnActive: {
    backgroundColor: '#3E468A',
  },
  qtyText: {
    marginHorizontal: S(8),
    color: Colors.black,
  },
  deleteItemBtn: {
    width: S(40),
    height: VS(70), // Matched to cart item height roughly
    backgroundColor: '#E74C3C',
    borderRadius: MS(8),
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: S(8),
  },
  deleteIcon: {
    tintColor: Colors.white,
  },

  // ─── Action Buttons ───
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: VS(20),
    marginBottom: VS(20),
  },
  actionBtn: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#F2F5FF',
    paddingVertical: VS(10),
    borderRadius: MS(8),
    marginHorizontal: S(2),
  },
  actionIcon: {
    tintColor: Colors.black,
    marginBottom: VS(4),
  },
  actionLabel: {
    color: Colors.black,
  },

  // ─── Total Section ───
  totalSection: {
    borderTopWidth: VS(1),
    borderTopColor: Colors.lightGrey,
    paddingTop: VS(16),
    paddingBottom: VS(16),
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: VS(20),
  },
  totalLabel: {
    color: Colors.black,
  },
  totalValue: {
    color: Colors.black,
  },
  discountRow: {
    marginBottom: VS(8),
  },
  discountLabel: {
    color: Colors.grey,
  },
  discountValue: {
    color: '#E74C3C',
  },
  bottomActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: VS(12),
  },
  secondaryBtn: {
    flex: 0.48,
    height: VS(50),
    backgroundColor: '#F0F0F0',
    borderRadius: MS(12),
    justifyContent: 'center',
    alignItems: 'center',
  },
  processBtn: {
    flex: 0.48,
    height: VS(50),
    backgroundColor: '#E6F9FF',
    borderColor: '#29CCFF',
    borderWidth: 1,
    borderRadius: MS(12),
    justifyContent: 'center',
    alignItems: 'center',
  },
  processBtnText: {
    color: '#29CCFF',
  },
  cancelBtn: {
    flex: 0.48,
    height: VS(50),
    backgroundColor: '#FFEAE6',
    borderRadius: MS(12),
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancelBtnText: {
    color: '#E74C3C',
  },
  disabledBtn: {
    opacity: 0.5,
  },
  secondaryBtnText: {
    color: Colors.grey,
  },
  primaryBtn: {
    width: '100%',
    height: VS(60),
    backgroundColor: '#3E468A',
    borderRadius: MS(12),
    justifyContent: 'center',
    alignItems: 'center',
  },
  primaryBtnDisabled: {
    backgroundColor: '#3E468A80', // Opacity for disabled state
  },
  primaryBtnText: {
    color: Colors.white,
  },

  // INLINE STYLE REPLACEMENTS
  minusButtonBar: {
    width: S(10),
    height: VS(2),
    backgroundColor: Colors.white,
  },
  plusButtonText: {
    color: Colors.white,
    fontSize: MS(18),
  },
  relativePosition: {
    position: 'relative',
  },
  tickIconOverlay: {
    position: 'absolute',
    top: -VS(4),
    right: -S(15),
    width: S(10),
    height: VS(10),
    resizeMode: 'contain',
  },
  bottomMarginSmall: {
    marginBottom: VS(8),
  },
  greyTextColor: {
    color: Colors.grey,
  },
  redTextColor: {
    color: '#E74C3C',
  },
  greenTextColor: {
    color: '#4CAF50',
  },
});

export default styles;
