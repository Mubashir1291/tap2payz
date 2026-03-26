import { StyleSheet } from 'react-native';
import { Colors } from '../../utils/Colors';
import { S, VS, MS } from '../../utils/Responsive';
import { Overline } from '../../utils/fonts';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#3E468A',
  },
  flex1: {
    flex: 1,
  },
  flexGrow1: {
    flexGrow: 1,
  },
  whiteTint: {
    tintColor: Colors.white,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: S(20),
    paddingTop: VS(20),
    paddingBottom: VS(15),
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backBtn: {
    marginRight: S(15),
  },
  headerTitle: {
    color: Colors.white,
  },
  addAreaBtn: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: S(15),
    paddingVertical: VS(8),
    borderRadius: MS(8),
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  addAreaText: {
    color: Colors.white,
  },
  mainContainer: {
    flex: 1,
    backgroundColor: Colors.white,
    marginHorizontal: S(20),
    marginBottom: VS(20),
    borderRadius: MS(20),
    padding: MS(20),
  },
  topSection: {
    flexDirection: 'row',
    marginBottom: VS(20),
  },
  gridContainer: {
    width: '68%', // Fixed percentage instead of flex: 2
    paddingRight: S(10),
  },
  flatListContent: {
    paddingBottom: VS(10),
  },
  tableWrapper: {
    width: '7.8%', // Fixed width for total uniformity across 12 columns
    aspectRatio: 1,
    marginHorizontal: MS(1),
    marginVertical: MS(4), // Added vertical gap
  },
  chairTop: {
    position: 'absolute',
    width: '37%',
    height: '6%',
    borderTopEndRadius: MS(5),
    borderTopStartRadius: MS(5),
  },
  chairTopPosition: {
    top: '5%',
    left: '31.5%',
  },
  chairBottom: {
    position: 'absolute',
    width: '37%',
    height: '6%',
    borderBottomEndRadius: MS(5),
    borderBottomStartRadius: MS(5),
  },
  chairBottomPosition: {
    bottom: '5%',
    left: '31.5%',
  },
  chairLeft: {
    position: 'absolute',
    width: '6%',
    height: '37%',
    borderTopLeftRadius: MS(5),
    borderBottomLeftRadius: MS(5),
  },
  chairLeftPosition: {
    left: '5%',
    top: '31.5%',
  },
  chairRight: {
    position: 'absolute',
    width: '6%',
    height: '37%',
    borderTopRightRadius: MS(5),
    borderBottomRightRadius: MS(5),
  },
  chairRightPosition: {
    right: '5%',
    top: '31.5%',
  },
  chairBase: {
    backgroundColor: '#E7E7E7',
  },
  chairHighlight: {
    backgroundColor: '#A4B4FF',
  },
  tableCore: {
    position: 'absolute',
    top: '12%',
    left: '12%',
    width: '76%',
    height: '76%',
    borderRadius: MS(8), // Matched to TableSelectionScreen
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
  },
  tableCoreBaseState: {
    backgroundColor: '#E7E7E7',
  },
  tableCoreAcquiredState: {
    backgroundColor: '#3E468A',
  },
  tableCoreSelectedState: {
    backgroundColor: '#A4B4FF',
  },
  selectedTableCore: {
    backgroundColor: '#A4B4FF',
  },
  acquiredTableCore: {
    backgroundColor: '#A4B4FF',
  },
  selectionDotContainer: {
    position: 'absolute',
    top: '15%',
    right: '15%',
    zIndex: 3,
  },
  selectionDot: {
    width: MS(6),
    height: MS(6),
    tintColor: '#3E468A',
  },
  controlsContainer: {
    width: '32%', // Fixed percentage instead of flex: 1
    paddingLeft: S(10),
  },
  controlLabel: {
    color: '#333',
    marginBottom: VS(6), // Reduced from 10
    fontSize: MS(12), // Reduced from Subtitle2 (14)
    fontWeight: '600',
  },
  controlLabelWithMargin: {
    marginTop: VS(12),
  },
  areaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: MS(8),
    justifyContent: 'space-between',
  },
  areaBtn: {
    paddingHorizontal: S(10), // Reduced from 12
    paddingVertical: VS(4), // Reduced from 6
    borderRadius: MS(6),
    backgroundColor: '#F5F5F5',
  },
  activeAreaBtn: {
    backgroundColor: '#3E468A',
  },

  areaBtnText: {
    color: '#666',
    ...Overline,
  },
  activeAreaBtnText: {
    color: Colors.white,
    ...Overline,
  },
  input: {
    backgroundColor: '#F0F0F0',
    borderRadius: MS(8),
    paddingHorizontal: S(15),
    height: VS(40),
    color: '#333',
  },
  visualizationContainer: {
    flex: 1,
    borderWidth: 1,
    borderColor: Colors.grey,
    borderStyle: 'dashed',
    borderRadius: MS(15),
    padding: MS(20),
    position: 'relative',
    backgroundColor: '#E7E7E7',
  },
  visualizationContainerActive: {
    zIndex: 100,
  },
  topSectionTapOverlay: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 90,
    backgroundColor: 'transparent',
  },
  visualizationTapOverlay: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 50,
    borderRadius: MS(15),
    backgroundColor: 'transparent',
  },
  visualizationHeader: {
    alignItems: 'flex-end',
    marginBottom: VS(20),
  },
  showingAreaText: {
    color: '#333',
    fontWeight: '600',
  },
  vizTableText: {
    fontSize: MS(14),
    fontWeight: 'bold',
    color: '#333',
  },
  vizTableTextSmall: {
    fontSize: MS(10),
  },
  vizSeatText: {
    fontSize: MS(10),
    color: '#333',
    marginTop: VS(2),
  },
  vizSeatTextSmall: {
    fontSize: MS(8),
  },
  emptyStateContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    color: '#999',
  },
  addedTablesContainer: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    alignContent: 'flex-start',
  },
  addTableBtn: {
    position: 'absolute',
    bottom: MS(20),
    right: MS(20),
    backgroundColor: '#C0C0C0', // Disabled look as in screenshot
    paddingHorizontal: S(30),
    paddingVertical: VS(12),
    borderRadius: MS(10),
    marginBottom: VS(10),
  },
  addTableBtnEnabled: {
    backgroundColor: '#3E468A',
  },
  addTableBtnText: {
    color: Colors.black,
  },
  addTableBtnTextEnabled: {
    color: Colors.white,
  },
  addedTableWrapper: {
    width: S(80),
    marginRight: S(15),
    marginBottom: VS(15),
  },
  addedTableWrapperActive: {
    zIndex: 100,
  },
  emptyTableIcon: {
    tintColor: '#CCCCCC',
    marginBottom: VS(10),
  },

  // Action Overlay Styles
  actionOverlayContainer: {
    position: 'absolute',
    top: -VS(40),
    left: '50%',
    marginLeft: -S(55),
    width: S(110),
    alignItems: 'center',
    zIndex: 999,
  },
  actionOverlay: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: MS(12),
    paddingVertical: VS(4),
    paddingHorizontal: S(2),
    backgroundColor: Colors.white,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    width: '100%',
  },
  actionOverlayArrow: {
    width: 0,
    height: 0,
    borderLeftWidth: S(6),
    borderRightWidth: S(6),
    borderTopWidth: VS(6),
    borderStyle: 'solid',
    backgroundColor: 'transparent',
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: Colors.white,
    marginTop: -1,
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: S(4),
    paddingVertical: VS(3),
    borderRadius: MS(12),
    marginHorizontal: S(2),
    flex: 1,
  },
  editActionBtn: {
    backgroundColor: '#3E468A',
  },
  deleteActionBtn: {
    backgroundColor: '#D32F2F',
  },
  actionBtnText: {
    color: Colors.white,
    marginRight: S(4),
    fontSize: MS(8),
    fontWeight: '600',
  },
  actionIconContainer: {
    backgroundColor: 'rgba(255,255,255,0.25)',
    borderRadius: MS(8),
    padding: MS(2),
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '40%',
    backgroundColor: '#F2F2F2',
    borderRadius: MS(15),
    padding: MS(20),
    alignItems: 'center',
  },
  modalHeader: {
    width: '100%',
    alignItems: 'flex-end',
    marginBottom: VS(5),
  },
  modalCloseBtn: {
    width: S(26),
    height: S(26),
    borderRadius: S(13),
    backgroundColor: '#E7E7E7',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalCloseText: {
    color: '#666',
    fontSize: MS(14),
    fontWeight: 'bold',
  },
  modalTitle: {
    color: Colors.black,
    marginBottom: VS(20),
  },
  inputGroup: {
    width: '100%',
    marginBottom: VS(20),
  },
  modalLabel: {
    color: Colors.black,
    marginBottom: VS(8),
  },
  modalInput: {
    backgroundColor: '#E7E7E7',
    borderRadius: MS(10),
    paddingHorizontal: S(15),
    paddingVertical: VS(12),
    color: Colors.black,
  },
  saveChangesBtn: {
    backgroundColor: '#A4B4FF',
    paddingHorizontal: S(40),
    paddingVertical: VS(12),
    borderRadius: MS(10),
    marginTop: VS(10),
  },
  saveChangesText: {
    color: Colors.black,
  },
});
