import { StyleSheet } from 'react-native';
import { Colors } from '../../utils/Colors';
import { S, VS, MS } from '../../utils/Responsive';
import { H2 } from '../../utils/fonts';

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#C8D5F8', // From image background color
    padding: MS(16),
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: VS(16),
  },
  title: {
    color: '#323E6E',
    marginRight: S(16),
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#C8D5F8', // Match background, or maybe it's transparent? Oh wait, the toggle itself is rounded
    borderRadius: MS(20),
    overflow: 'hidden',
    alignItems: 'center',
  },
  tabBtn: {
    paddingVertical: VS(8),
    paddingHorizontal: S(20),
    borderRadius: MS(20),
  },
  tabBtnActive: {
    backgroundColor: '#405BA9',
  },
  tabText: {
    color: '#405BA9',
  },
  tabTextActive: {
    color: Colors.white,
  },
  spacer: {
    flex: 1,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E4EBFB',
    borderRadius: MS(20),
    paddingHorizontal: S(16),
    paddingVertical: VS(8),
    width: S(200),
    marginRight: S(12),
  },
  searchInput: {
    flex: 1,
    marginLeft: S(8),
    paddingVertical: 0,
    color: '#3B4B8A',
  },
  searchIcon: {
    tintColor: '#3B4B8A',
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: VS(8),
    paddingHorizontal: S(16),
    backgroundColor: '#E4EBFB',
    borderRadius: MS(20),
    marginRight: S(12),
  },
  actionBtnText: {
    color: '#3B4B8A',
    marginLeft: S(6),
  },
  actionIconTint: {
    tintColor: '#3B4B8A',
  },
  contentContainer: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: Colors.white,
    borderRadius: MS(16),
    overflow: 'hidden',
  },
  leftPanel: {
    width: S(280),
    borderRightWidth: 1,
    borderRightColor: '#F5F7FA',
    paddingVertical: VS(16),
  },
  leftListHeader: {
    flexDirection: 'row',
    paddingHorizontal: S(16),
    paddingVertical: VS(12),
    borderBottomWidth: 1,
    borderBottomColor: '#F5F7FA',
    marginHorizontal: S(16),
    backgroundColor: '#FAFBFD',
    borderRadius: MS(8),
    marginBottom: VS(8),
  },
  headerText: {
    color: Colors.black,
    fontWeight: 'bold',
  },
  colSr: { width: S(30) },
  colAmount: { width: S(60) },
  colType: { width: S(80) },
  colStatus: { flex: 1 },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: VS(12),
    paddingHorizontal: S(16),
    borderBottomWidth: 1,
    borderBottomColor: '#F5F7FA',
    marginHorizontal: S(16),
  },
  listItemActive: {
    backgroundColor: '#F5F7FA',
    borderRadius: MS(8),
  },
  rowText: {
    color: '#333333',
  },
  typeRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  typeIcon: {
    width: S(16),
    height: S(16),
    marginRight: S(4),
    resizeMode: 'contain',
  },
  approvedText: {
    color: '#4BB543',
  },
  declineText: {
    color: '#FC100D',
  },
  arrowIcon: {
    tintColor: '#999999',
  },
  rightPanel: {
    flex: 1,
    padding: MS(24),
  },
  topDetailsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#F5F7FA',
    paddingBottom: VS(16),
    marginBottom: VS(24),
  },
  detailLabel: {
    color: '#666666',
    marginBottom: VS(4),
  },
  detailValue: {
    color: Colors.black,
  },
  orderDetailTitle: {
    color: Colors.black,
    marginBottom: VS(16),
  },
  orderDetailContainer: {
    flex: 1,
    backgroundColor: '#F5F7FA',
    borderRadius: MS(12),
    padding: MS(16),
  },
  orderHeader: {
    flexDirection: 'row',
    marginBottom: VS(16),
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  orderTitleLabel: {
    color: Colors.black,
    marginRight: S(16),
  },
  orderStatusLabel: {
    color: '#4BB543',
  },
  tableHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    paddingVertical: VS(12),
    paddingHorizontal: S(16),
    borderRadius: MS(8),
    marginBottom: VS(8),
  },
  colQT: { width: S(40) },
  colItem: { flex: 1 },
  colSKU: { width: S(100) },
  colPrice: { width: S(80), textAlign: 'right' },
  tableRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: VS(12),
    paddingHorizontal: S(16),
    borderBottomWidth: 1,
    borderBottomColor: '#E6EAFA',
  },
  tableRowText: {
    color: '#666666',
  },
  tableRowPrice: {
    color: '#666666',
    textAlign: 'right',
  },
  subtotalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: VS(16),
    marginTop: VS(8),
    borderTopWidth: 1,
    borderTopColor: '#E6EAFA',
    paddingHorizontal: S(16),
  },
  subtotalLabel: {
    color: Colors.black,
  },
  subtotalAmount: {
    color: Colors.black,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: MS(20),
  },
  emptyText: {
    color: '#999999',
    textAlign: 'center',
  },
  loadingText: {
    marginTop: VS(16),
    color: '#999999',
  },
  errorText: {
    color: '#E74C3C',
    textAlign: 'center',
  },
});

export default styles;
