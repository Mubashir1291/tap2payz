import {StyleSheet} from 'react-native';
import {Colors} from '../../utils/Colors';
import {S, VS, MS} from '../../utils/Responsive';

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#F5F7FA',
    padding: MS(16),
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: VS(16),
  },
  headerTitle: {
    color: '#3B4B8A',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: MS(12),
  },
  sortBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: VS(8),
    paddingHorizontal: S(16),
    backgroundColor: '#E6EAFA',
    borderRadius: MS(20),
  },
  sortText: {
    color: '#3B4B8A',
    marginRight: S(4),
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E6EAFA',
    borderRadius: MS(20),
    paddingHorizontal: S(16),
    paddingVertical: VS(8),
    width: S(240),
  },
  searchInput: {
    flex: 1,
    marginLeft: S(8),
    paddingVertical: 0,
    color: '#3B4B8A',
  },
  createBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: VS(8),
    paddingHorizontal: S(16),
    backgroundColor: '#E6EAFA',
    borderRadius: MS(20),
  },
  createBtnText: {
    color: '#3B4B8A',
    marginRight: S(4),
  },
  tableContainer: {
    flex: 1,
    backgroundColor: Colors.white,
    borderRadius: MS(14),
    padding: MS(16),
  },
  tableHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F7FA',
    paddingVertical: VS(12),
    paddingHorizontal: S(16),
    borderRadius: MS(8),
    marginBottom: VS(8),
  },
  headerText: {
    color: Colors.black,
  },
  colId: { flex: 0.15 },
  colName: { flex: 0.25, flexDirection: 'row', alignItems: 'center' },
  colEmail: { flex: 0.25 },
  colSales: { flex: 0.15 },
  colTips: { flex: 0.1 },
  colAction: { flex: 0.1, flexDirection: 'row', justifyContent: 'flex-end', gap: MS(8) },
  
  tableRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: VS(12),
    paddingHorizontal: S(16),
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightGrey,
  },
  rowText: {
    color: Colors.black,
  },
  avatar: {
    width: S(24),
    height: S(24),
    borderRadius: S(12),
    marginRight: S(8),
  },
  actionIconBg: {
    width: S(28),
    height: S(28),
    borderRadius: S(14),
    justifyContent: 'center',
    alignItems: 'center',
  },
  editBg: { backgroundColor: '#E0F7FA' },
  lockBg: { backgroundColor: '#EEEEEE' },
  deleteBg: { backgroundColor: '#FFEBEE' },
  actionIcon: {
    width: S(14),
    height: S(14),
  },
  paginationRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: VS(16),
    gap: MS(12),
  },
  pageBtn: {
    width: S(24),
    height: VS(24),
    borderRadius: MS(4),
    borderWidth: 1,
    borderColor: Colors.lightGrey,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F7FA',
  },
  pageText: {
    color: Colors.black,
  },
});

export default styles;
