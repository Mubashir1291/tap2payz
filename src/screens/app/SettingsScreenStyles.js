import { StyleSheet } from 'react-native';
import { Colors } from '../../utils/Colors';
import { S, VS, MS } from '../../utils/Responsive';

export default StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  header: {
    backgroundColor: Colors.primary,
    paddingTop: VS(20),
    paddingBottom: VS(10),
    paddingHorizontal: S(20),
  },
  hamburgerBtn: {
    width: S(30),
    height: VS(25),
    justifyContent: 'space-between',
    marginBottom: VS(15),
  },
  hamburgerLine: {
    height: VS(3),
    backgroundColor: Colors.white,
    borderRadius: MS(2),
  },
  hamburgerLineShort: {
    width: '70%',
  },
  tabsContainer: {
    paddingBottom: VS(5),
  },
  tab: {
    paddingHorizontal: S(15),
    paddingVertical: VS(8),
    borderRadius: MS(20),
    marginRight: S(10),
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  activeTab: {
    backgroundColor: Colors.white,
  },
  tabText: {
    color: Colors.white,
  },
  activeTabText: {
    color: Colors.black,
  },
  rowCentered: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  tabIcon: {
    marginRight: S(8),
  },
  content: {
    flex: 1,
  },
  timeframeFilterContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: S(20),
    marginTop: VS(10),
  },
  timeframeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EBF0FF',
    paddingHorizontal: S(12),
    paddingVertical: VS(6),
    borderRadius: MS(8),
    marginBottom: VS(10),
  },
  timeframeText: {
    color: Colors.primary,
    marginRight: S(6),
  },
  filterIcon: {
    tintColor: Colors.primary,
  },
  statsRow: {
    flexDirection: 'row',
    paddingHorizontal: S(20),
    justifyContent: 'space-between',
    marginBottom: VS(20),
  },
  statCard: {
    flex: 1,
    backgroundColor: Colors.white,
    padding: MS(15),
    borderRadius: MS(12),
    marginHorizontal: S(5),
    elevation: 3,
  },
  statHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: VS(10),
  },
  statAmount: {
    color: Colors.black,
  },
  statIcon: {
    padding: MS(8),
    borderRadius: MS(8),
  },
  lightGreenBg: {
    backgroundColor: '#E8F5E9',
  },
  lightPurpleBg: {
    backgroundColor: '#F3E5F5',
  },
  statFooter: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statLabel: {
    color: Colors.grey,
  },
  chartsRow: {
    flexDirection: 'row',
    paddingHorizontal: S(20),
    justifyContent: 'space-between',
    marginBottom: VS(20),
  },
  lineChartCard: {
    flex: 1.5,
    backgroundColor: Colors.white,
    padding: MS(15),
    borderRadius: MS(12),
    marginRight: S(10),
    elevation: 3,
  },
  chartHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: VS(15),
  },
  chartTitle: {
    color: Colors.black,
  },
  legendRow: {
    flexDirection: 'row',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: S(15),
  },
  legendDot: {
    width: S(10),
    height: S(10),
    borderRadius: S(5),
    marginRight: S(5),
  },
  lightBlueLegendDot: {
    backgroundColor: '#A8C8F0',
  },
  legendText: {
    color: Colors.grey,
  },
  flexFull: {
    flex: 1,
  },
  pieChartCard: {
    flex: 1,
    backgroundColor: Colors.white,
    padding: MS(15),
    borderRadius: MS(12),
    elevation: 3,
  },
  pieContainer: {
    alignItems: 'center',
    marginVertical: VS(15),
  },
  pieLegend: {
    marginTop: VS(10),
  },
  pieLegendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: VS(8),
  },
  pieLegendDot: {
    width: S(8),
    height: S(8),
    borderRadius: S(4),
    marginRight: S(8),
  },
  pieLegendText: {
    flex: 1,
    color: Colors.black,
  },
  pieLegendPercent: {
    color: Colors.black,
  },
  pieLegendValueContainer: {
    alignItems: 'flex-end',
  },
  greyText: {
    color: Colors.grey,
  },
  emptyChartContainer: {
    justifyContent: 'center',
    marginTop: VS(20),
  },
  emptyChartText: {
    color: Colors.grey,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: Colors.white,
    width: '30%',
    borderRadius: MS(12),
    padding: MS(16),
  },
  modalTitle: {
    marginBottom: VS(16),
    textAlign: 'center',
  },
  modalOptionBtn: {
    paddingVertical: VS(12),
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightGrey,
  },
  modalOptionText: {
    textAlign: 'center',
  },
  modalOptionBtnLast: {
    paddingVertical: VS(12),
  },
});