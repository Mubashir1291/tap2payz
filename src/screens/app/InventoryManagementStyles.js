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
  headerTitleGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: MS(16),
  },
  headerTitle: {
    color: '#3B4B8A',
  },
  toggleGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: MS(8),
    marginLeft: S(24),
  },
  toggleBtn: {
    paddingVertical: VS(8),
    paddingHorizontal: S(16),
    borderRadius: MS(20),
  },
  toggleBtnActive: {
    backgroundColor: '#3B4B8A',
  },
  toggleText: {
    color: '#3B4B8A',
  },
  toggleTextActive: {
    color: Colors.white,
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
    width: S(200),
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
  
  colProductHeader: { flex: 0.2 },
  colProductRow: { flex: 0.2, flexDirection: 'row', alignItems: 'center' },
  colSKU: { flex: 0.12 },
  colBarcode: { flex: 0.12 },
  colCategory: { flex: 0.12 },
  colDiscount: { flex: 0.14 },
  colQty: { flex: 0.08 },
  colPrice: { flex: 0.1 },
  colStatus: { flex: 0.07, alignItems: 'center' },
  colAction: { flex: 0.1, flexDirection: 'row', justifyContent: 'center', gap: MS(6) },
  
  colCatNameHeader: { flex: 0.4 },
  colCatNameRow: { flex: 0.4, flexDirection: 'row', alignItems: 'center' },
  colCatStatus: { flex: 0.4 },
  colCatAction: { flex: 0.2, flexDirection: 'row', justifyContent: 'flex-end', gap: MS(6) },

  
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
  productImagePlaceholder: {
    width: S(32),
    height: S(32),
    borderRadius: MS(6),
    backgroundColor: '#E0E0E0',
    marginRight: S(10),
  },
  statusPill: {
    paddingVertical: VS(4),
    paddingHorizontal: S(10),
    borderRadius: MS(12),
  },
  statusActiveBg: {
    backgroundColor: '#E8F5E9',
  },
  statusActiveText: {
    color: '#4CAF50',
  },
  statusInactiveBg: {
    backgroundColor: '#FFEBEE',
  },
  statusInactiveText: {
    color: '#E74C3C',
  },
  infoCircle: {
    width: S(24),
    height: S(24),
    borderRadius: S(12),
    backgroundColor: '#333333',
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoText: {
    color: 'white',
    fontSize: S(12),
    fontWeight: 'bold',
  },
  catRightCircle: {
    width: S(24),
    height: S(24),
    borderRadius: S(12),
    backgroundColor: '#EEEEEE',
    justifyContent: 'center',
    alignItems: 'center',
  },
  catRightText: {
    color: '#666666',
    fontSize: S(12),
    fontWeight: 'bold',
  },
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
  
  // MODALS
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  formModalContent: {
    backgroundColor: Colors.white,
    borderRadius: MS(20),
    padding: MS(32),
    width: '90%',
    maxWidth: S(800),
    maxHeight: '90%',
  },
  modalCloseBtn: {
    position: 'absolute',
    top: VS(16),
    right: S(16),
    width: S(32),
    height: S(32),
    borderRadius: S(16),
    borderWidth: 1,
    borderColor: '#EEEEEE',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  modalCloseText: {
    color: '#666666',
    fontSize: S(16),
  },
  modalTitle: {
    color: '#333333',
    textAlign: 'center',
    marginBottom: VS(24),
    marginTop: VS(8),
  },
  formScrollContent: {
    flexGrow: 1,
  },
  formRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: VS(16),
  },
  formCol: {
    width: '48%',
  },
  formLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: VS(8),
  },
  formLabel: {
    color: '#333333',
    fontWeight: '500',
  },
  formInput: {
    backgroundColor: '#F5F7FA',
    borderRadius: MS(8),
    paddingHorizontal: S(16),
    paddingVertical: VS(12),
    color: '#333333',
  },
  dropdownInput: {
    backgroundColor: '#F5F7FA',
    borderRadius: MS(8),
    paddingHorizontal: S(16),
    paddingVertical: VS(12),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dropdownText: {
    color: '#333333',
  },
  dropdownIcon: {
    width: S(12),
    height: VS(12),
    tintColor: '#666666',
  },
  dropdownList: {
    position: 'absolute',
    top: VS(72),
    left: 0,
    right: 0,
    backgroundColor: Colors.white,
    borderRadius: MS(8),
    borderWidth: 1,
    borderColor: '#EEEEEE',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
    zIndex: 1000,
  },
  dropdownItem: {
    paddingHorizontal: S(16),
    paddingVertical: VS(12),
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
  },
  statusActiveBg2: {
    backgroundColor: '#E8F5E9',
    alignSelf: 'flex-start',
    paddingHorizontal: S(12),
    paddingVertical: VS(4),
    borderRadius: MS(12),
  },
  statusActiveText2: {
    color: '#4CAF50',
  },
  statusInactiveBg2: {
    backgroundColor: '#FFEBEE',
    alignSelf: 'flex-start',
    paddingHorizontal: S(12),
    paddingVertical: VS(4),
    borderRadius: MS(12),
  },
  statusInactiveText2: {
    color: '#E74C3C',
  },
  uploadImageContainer: {
    backgroundColor: '#F5F7FA',
    borderRadius: MS(12),
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderStyle: 'dashed',
    height: VS(160),
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  uploadedImage: {
    width: '100%',
    height: '100%',
  },
  uploadImageIcon: {
    width: S(40),
    height: S(40),
    marginBottom: VS(12),
  },
  uploadImageText: {
    color: '#333333',
    fontWeight: '700',
    marginBottom: VS(4),
  },
  uploadImageSubText: {
    color: '#888888',
    textAlign: 'center',
    fontSize: S(10),
  },
  textAreaInput: {
    backgroundColor: '#F5F7FA',
    borderRadius: MS(12),
    paddingHorizontal: S(16),
    paddingVertical: VS(12),
    height: VS(160),
    color: '#333333',
    textAlignVertical: 'top',
  },
  
  // Category Modal
  catModalContent: {
    backgroundColor: Colors.white,
    borderRadius: MS(20),
    padding: MS(32),
    width: '90%',
    maxWidth: S(600),
    maxHeight: '90%',
  },
  catUploadContainer: {
    backgroundColor: '#EAEBEE',
    borderRadius: MS(12),
    height: VS(180),
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: VS(16),
  },
  catUploadImageHint: {
    color: '#333333',
    fontWeight: '700',
    marginTop: VS(12),
    marginBottom: VS(4),
  },
  catUploadImageSubHint: {
    color: '#888888',
    textAlign: 'center',
    fontSize: S(10),
  },
  catUploadImageIcon: {
    width: S(48),
    height: S(48),
  },
  catActiveUploadedImage: {
    width: S(120),
    height: S(120),
  },
  catChangeImageBtn: {
    position: 'absolute',
    bottom: VS(24),
    backgroundColor: '#3B4B8A',
    paddingHorizontal: S(16),
    paddingVertical: VS(6),
    borderRadius: MS(20),
  },
  catChangeImageText: {
    color: Colors.white,
    fontSize: S(12),
    fontWeight: '500',
  },
  catFormRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: VS(16),
  },
  catFormCol: {
    width: '48%',
  },
  catSubmitBtn: {
    backgroundColor: '#C8D3FF',
    alignSelf: 'center',
    paddingHorizontal: S(32),
    paddingVertical: VS(12),
    borderRadius: MS(12),
    marginTop: VS(16),
    flexDirection: 'row',
    alignItems: 'center',
  },
  catSubmitBtnText: {
    color: '#333333',
    fontWeight: '700',
    marginRight: S(8),
  },

  // INLINE STYLE REPLACEMENTS
  centerTextAlign: {
    textAlign: 'center',
  },
  placeholderImage: {
    backgroundColor: Colors.lightGrey,
  },
  alignSelfStart: {
    alignSelf: 'flex-start',
  },
  largeIconStyle: {
    width: S(80),
    height: S(80),
    tintColor: '#333333',
  },
  zIndexHigh: {
    zIndex: 10,
  },
});

export default styles;
