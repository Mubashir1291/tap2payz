import { StyleSheet } from 'react-native';
import { Colors } from '../../utils/Colors';
import { S, VS, MS } from '../../utils/Responsive';

const styles = StyleSheet.create({
  root: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: Colors.white,
  },

  // ─── Left Panel (Table Grid) ───
  leftPanel: {
    flex: 0.68,
    backgroundColor: '#bec2d5ff', // Light blue background matching design
    padding: MS(16),
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: VS(16),
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  hamburgerBtn: {
    width: S(36),
    height: VS(36),
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: S(16),
  },
  hamburgerLine: {
    width: S(22),
    height: VS(2.5),
    backgroundColor: '#333',
    borderRadius: MS(2),
    marginVertical: VS(2),
  },
  hamburgerLineShort: {
    width: S(16),
    alignSelf: 'flex-start',
    marginLeft: S(7),
  },

  viewOrdersBtn: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewOrdersText: {
    color: '#2b3474',
    marginRight: S(4),
    textDecorationLine: 'underline',
  },
  viewOrdersIcon: {
    tintColor: '#2b3474',
  },

  tabsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: VS(24),
    paddingHorizontal: S(8),
  },
  tabsSwitch: {
    flexDirection: 'row',
    backgroundColor: '#A6B4F8',
    borderRadius: MS(20),
    padding: MS(4),
  },
  tabBtn: {
    paddingVertical: VS(8),
    paddingHorizontal: S(24),
    borderRadius: MS(16),
  },
  activeTabBtn: {
    backgroundColor: '#37438B',
  },
  tabText: {
    color: '#37438B', // Dark blue text for inactive
  },
  activeTabText: {
    color: Colors.white,
  },

  areaSelector: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  areaText: {
    color: '#2b3474',
    marginRight: S(6),
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  dropdownContainer: {
    position: 'absolute',
    backgroundColor: Colors.white,
    borderRadius: MS(8),
    padding: MS(8),
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  dropdownItem: {
    paddingVertical: VS(10),
    paddingHorizontal: S(12),
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  dropdownItemText: {
    color: '#2b3474',
  },

  // ─── Table Grid ───
  gridContainer: {
    paddingBottom: VS(40),
  },
  tableWrapper: {
    width: '12%', // Reduced size
    aspectRatio: 1,
    marginHorizontal: '2%', // Increased horizontal space
    marginVertical: VS(16), // Increased vertical space
  },

  // Abstract Chair Shapes
  chairTop: {
    position: 'absolute',
    width: '30%',
    height: '5%', // Thinner width
 borderTopEndRadius: MS(5),
 borderTopStartRadius: MS(5),
  },
  chairBottom: {
    position: 'absolute',
    width: '30%',
    height: '5%', // Thinner width
 borderBottomEndRadius: MS(5),
 borderBottomStartRadius: MS(5),
  },
  chairLeft: {
    position: 'absolute',
    width: '5%', // Thinner width
    height: '30%',
    borderTopLeftRadius: MS(5),
    borderBottomLeftRadius: MS(5),
  
   
  },
  chairRight: {
    position: 'absolute',
    width: '5%', // Thinner width
    height: '30%',
    borderTopRightRadius: MS(5),
    borderBottomRightRadius: MS(5),
  },

  // Table Core
  tableCore: {
    position: 'absolute',
    top: '12%',
    left: '12%',
    width: '76%',
    height: '76%',
    borderRadius: MS(14),
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
    borderWidth: 1.5,
    borderColor: 'rgba(0,0,0,0.03)', // Subtle border for depth
  },

  // Texts
  tableNameText: {
    color: '#333',
    marginBottom: VS(1),
    fontWeight: 'bold',
    fontSize: MS(11),
  },
  tableSeatText: {
    color: '#666',
    fontSize: MS(8),
    marginBottom: VS(4),
  },
  statusIndicatorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: VS(2),
  },
  statusDot: {
    width: MS(6),
    height: MS(6),
    borderRadius: MS(10),
    marginRight: S(4),
  },
  statusText: {
    color: '#555',
    fontSize: MS(8),
  },
  
  // ─── Right Cart Panel ───
  cartPanel: {
    flex: 0.32,
    backgroundColor: Colors.white,
    padding: MS(16),
  },
  cartPanelHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingBottom: VS(12),
    borderBottomWidth: VS(1),
    borderBottomColor: Colors.lightGrey,
  },
  cartHeaderText: {
    color: '#333',
  },
  
  cartContent: {
    flex: 1,
  },
  emptyCart: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyCartText: {
    color: '#555',
    fontWeight: 'bold',
  },

  // ─── Action Buttons ───
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: VS(16),
  },
  actionBtn: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: VS(8),
    borderRadius: MS(8),
    backgroundColor: '#F5F5F5',
    marginHorizontal: S(4),
  },
  actionIcon: {
color: Colors.grey,
    marginBottom: VS(4),
  },
  actionLabelText: {
    color: '#555',
    fontSize: MS(9),
  },

  // ─── Total Section ───
  totalSection: {
    borderTopWidth: VS(1),
    borderTopColor: Colors.lightGrey,
    paddingTop: VS(16),
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: VS(16),
  },
  totalLabel: {
    color: '#333',
    fontSize: MS(16),
  },
  totalAmount: {
    color: '#333',
    fontSize: MS(20),
    fontWeight: 'bold',
  },
  
  bottomButtonGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: VS(10),
  },
  processBtn: {
    flex: 1,
    height: VS(40),
    borderRadius: MS(8),
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: S(4),
  },
  cancelBtn: {
    flex: 1,
    height: VS(40),
    borderRadius: MS(8),
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: S(4),
  },
  btnText: {
    color: '#777',
    fontSize: MS(12),
  },
  checkoutBtn: {
    height: VS(45),
    borderRadius: MS(8),
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkoutBtnText: {
    color: '#777',
    fontSize: MS(13),
  },

  // ─── Categories (Take Away) ───
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

  // ─── Product Grid (Take Away) ───
  productListContent: {
    paddingBottom: VS(40),
  },
  productCard: {
    flex: 1,
    maxWidth: '18%', // Approx 5 columns
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
});

export default styles;
