import { StyleSheet } from 'react-native';
import { Colors } from '../../utils/Colors';
import { MS, S, VS } from '../../utils/Responsive';

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#C6CDEF', // Light blue background
    padding: MS(16),
  },

  // ─── Header ───
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: VS(16),
    justifyContent: 'space-between',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    marginRight: S(16),
  },
  backIcon: {
    tintColor: '#2b3474',
    // Because RightArrow might be used if LeftArrow is missing, but we have LeftArrowIcon
  },
  headerTitle: {
    color: '#2b3474',
    fontWeight: 'bold',
  },

  // ─── Header Actions (Search & Tabs) ───
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.4)',
    borderRadius: MS(20),
    paddingHorizontal: S(12),
    height: VS(40),
    width: S(200),
    marginRight: S(16),
  },
  searchInput: {
    flex: 1,
    color: '#333',
    paddingVertical: 0,
    marginLeft: S(8),
  },
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.4)',
    borderRadius: MS(20),
    padding: MS(4),
  },
  tabBtn: {
    paddingVertical: VS(8),
    paddingHorizontal: S(16),
    borderRadius: MS(16),
  },
  activeTabBtn: {
    backgroundColor: '#37438B',
  },
  tabText: {
    color: '#333',
  },
  activeTabText: {
    color: Colors.white,
  },

  // ─── Table Container ───
  tableContainer: {
    flex: 1,
    backgroundColor: Colors.white,
    borderRadius: MS(14),
    padding: MS(16),
    elevation: 2, // shadow for Android
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },

  // ─── Table Header ───
  tableHeader: {
    flexDirection: 'row',
    paddingVertical: VS(12),
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
    backgroundColor: '#F5F5F5',
    borderRadius: MS(8),
    marginBottom: VS(8),
  },
  headerText: {
    color: '#444',
    fontWeight: 'bold',
    textAlign: 'center',
  },

  // ─── Table Columns ───
  colId: { flex: 0.8 },
  colTable: { flex: 0.8 },
  colWaiter: { flex: 1.5 },
  colHandleBy: { flex: 1.5 },
  colDate: { flex: 2 },
  colTotal: { flex: 1 },
  colSubTotal: { flex: 1 },
  colActions: { flex: 1.5, alignItems: 'center', justifyContent: 'center' },

  // ─── Table Row ───
  tableRow: {
    flexDirection: 'row',
    paddingVertical: VS(12),
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
    alignItems: 'center',
  },
  rowText: {
    color: '#555',
    textAlign: 'center',
  },
  
  // ─── Action Button ───
  viewInvoiceBtn: {
    backgroundColor: '#E6E9F5',
    paddingVertical: VS(6),
    paddingHorizontal: S(12),
    borderRadius: MS(16),
  },
  viewInvoiceText: {
    color: '#37438B',
    fontSize: MS(10),
    fontWeight: '600',
  },

  // ─── Pagination ───
  paginationRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: VS(16),
    paddingBottom: VS(8),
  },
  pageBtn: {
    width: S(24),
    height: VS(24),
    borderWidth: 1,
    borderColor: '#CCC',
    borderRadius: MS(4),
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: S(8),
  },
  pageIcon: {
    tintColor: '#555',
  },
  pageText: {
    color: '#555',
  },
});

export default styles;
