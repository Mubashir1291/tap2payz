import { StyleSheet } from 'react-native';
import { Colors } from '../../utils/Colors';
import { S, VS, MS } from '../../utils/Responsive';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#3E468A', // Dark blue background as seen in screenshot
  },
  header: {
    paddingHorizontal: S(20),
    paddingTop: VS(20),
    paddingBottom: VS(10),
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: S(30),
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: VS(20),
  },
  title: {
    color: Colors.white,
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  areaDropdown: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: S(15),
    paddingVertical: VS(8),
    borderRadius: MS(8),
    marginRight: S(12),
  },
  areaText: {
    color: Colors.white,
    marginRight: S(10),
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: S(12),
    borderRadius: MS(8),
    width: S(180),
    marginRight: S(12),
  },
  searchIcon: {
    tintColor: Colors.white,
    marginRight: S(8),
  },
  searchInput: {
    flex: 1,
    color: Colors.white,
    height: VS(36),
    padding: 0,
  },
  createBtn: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: S(15),
    paddingVertical: VS(8),
    borderRadius: MS(8),
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  createBtnText: {
    color: Colors.white,
  },
  tableContainer: {
    flex: 1,
    backgroundColor: Colors.white,
    borderTopLeftRadius: MS(20),
    borderTopRightRadius: MS(20),
    paddingHorizontal: S(20),
    paddingTop: VS(20),
    marginBottom: VS(20),
    borderRadius: MS(20), // Added for bottom as well
  },
  tableHeader: {
    flexDirection: 'row',
    paddingBottom: VS(15),
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
    marginBottom: VS(10),
  },
  headerCell: {
    color: '#333',
  },
  listContent: {
    paddingBottom: VS(20),
  },
  tableRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: VS(15),
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  cell: {
    color: '#666',
  },
  actionCell: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  actionBtn: {
    marginHorizontal: S(5),
  },
  pagination: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: VS(20),
  },
  pageArrow: {
    width: S(30),
    height: S(30),
    borderRadius: MS(4),
    borderWidth: 1,
    borderColor: '#E0E0E0',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: S(8),
  },
  arrowText: {
    color: '#666',
    fontSize: MS(18),
  },
  pageText: {
    color: '#333',
    marginHorizontal: S(10),
  },
  outOfText: {
    color: '#999',
    marginLeft: S(10),
  },
});
