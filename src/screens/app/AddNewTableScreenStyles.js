import { StyleSheet } from 'react-native';
import { Colors } from '../../utils/Colors';
import { S, VS, MS } from '../../utils/Responsive';
import { Body2, Overline } from '../../utils/fonts';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#3E468A',
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
  chairBottom: {
    position: 'absolute',
    width: '37%',
    height: '6%',
    borderBottomEndRadius: MS(5),
    borderBottomStartRadius: MS(5),
  },
  chairLeft: {
    position: 'absolute',
    width: '6%',
    height: '37%',
    borderTopLeftRadius: MS(5),
    borderBottomLeftRadius: MS(5),
  },
  chairRight: {
    position: 'absolute',
    width: '6%',
    height: '37%',
    borderTopRightRadius: MS(5),
    borderBottomRightRadius: MS(5),
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
    borderWidth: 1.5,
    borderColor: 'rgba(0,0,0,0.03)',
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
  areaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: MS(8),
    justifyContent:'space-between'
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
    borderWidth: 2,
    borderColor: '#E7E7E7',
    borderStyle: 'dashed',
    borderRadius: MS(15),
    padding: MS(20),
    position: 'relative',
    backgroundColor: '#E7E7E7'
  },
  visualizationHeader: {
    alignItems: 'flex-end',
    marginBottom: VS(20),
  },
  showingAreaText: {
    color: '#333',
    fontWeight: '600',
  },
  emptyStateContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    color: '#999',
  },
  addTableBtn: {
    position: 'absolute',
    bottom: MS(20),
    right: MS(20),
    backgroundColor: '#C0C0C0', // Disabled look as in screenshot
    paddingHorizontal: S(30),
    paddingVertical: VS(12),
    borderRadius: MS(10),
  },
  addTableBtnText: {
    color: Colors.white,
  },
});
