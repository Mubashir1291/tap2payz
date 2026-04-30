import { StyleSheet } from 'react-native';
import { Colors } from '../../utils/Colors';
import { S, VS, MS } from '../../utils/Responsive';

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
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E6EAFA',
    borderRadius: MS(20),
    paddingHorizontal: S(16),
    paddingVertical: VS(8),
    width: S(240),
    marginRight: S(12),
  },
  searchInput: {
    flex: 1,
    marginLeft: S(8),
    paddingVertical: 0,
    color: '#3B4B8A',
  },
  exportBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: VS(8),
    paddingHorizontal: S(16),
    backgroundColor: '#E6EAFA',
    borderRadius: MS(20),
  },
  exportBtnText: {
    color: '#3B4B8A',
    marginLeft: S(4),
  },
  exportIconTint: {
    tintColor: '#3B4B8A',
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
  colOpenedAt: { flex: 0.15 },
  colClosedAt: { flex: 0.15 },
  colEmployees: { flex: 0.25 },
  colOpenAmount: { flex: 0.15, alignItems: 'center' },
  colCloseAmount: { flex: 0.15, alignItems: 'center' },
  colAction: { flex: 0.15, alignItems: 'center' },

  tableRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: VS(16),
    paddingHorizontal: S(16),
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightGrey,
  },
  rowText: {
    color: Colors.black,
  },
  employeeTextContainer: {
    flexDirection: 'column',
  },
  viewBtn: {
    backgroundColor: '#D1DEFA',
    paddingVertical: VS(6),
    paddingHorizontal: S(16),
    borderRadius: MS(20),
  },
  viewBtnText: {
    color: '#3B4B8A',
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
  actionIcon: {
    width: S(14),
    height: S(14),
    resizeMode: 'contain',
  },
  loadingContainer: {
    padding: MS(40),
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default styles;
