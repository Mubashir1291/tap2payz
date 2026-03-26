import { StyleSheet } from 'react-native';
import { Colors } from '../../utils/Colors';
import { S, VS, MS } from '../../utils/Responsive';

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    paddingHorizontal: S(16),
    paddingVertical: VS(10),
  },
  hamburgerBtn: {
    width: S(36),
    height: VS(36),
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: S(10),
  },
  hamburgerLine: {
    width: S(22),
    height: VS(2.5),
    backgroundColor: Colors.black,
    borderRadius: MS(2),
    marginVertical: VS(2),
  },
  hamburgerLineShort: {
    width: S(16),
    alignSelf: 'flex-start',
    marginLeft: S(7),
  },
  tabsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: MS(6),
  },
  tab: {
    paddingVertical: VS(8),
    paddingHorizontal: S(14),
    borderRadius: MS(20),
    backgroundColor: '#F5F7FA',
  },
  activeTab: {
    backgroundColor: '#3B4B8A',
  },
  tabText: {
    color: Colors.black,
  },
  activeTabText: {
    color: Colors.white,
  },
  content: {
    flex: 1,
    padding: MS(16),
  },
  sortRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: VS(12),
  },
  sortBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: VS(6),
    paddingHorizontal: S(12),
    backgroundColor: Colors.white,
    borderRadius: MS(8),
    borderWidth: 1,
    borderColor: Colors.lightGrey,
  },
  sortText: {
    color: Colors.black,
  },

  // Stats
  statsRow: {
    flexDirection: 'row',
    gap: MS(12),
    marginBottom: VS(12),
  },
  statCard: {
    flex: 1,
    backgroundColor: Colors.white,
    borderRadius: MS(14),
    padding: MS(16),
  },
  statHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: VS(4),
  },
  statAmount: {
    color: Colors.black,
  },
  statIcon: {
    width: S(32),
    height: VS(32),
    borderRadius: MS(8),
    justifyContent: 'center',
    alignItems: 'center',
  },
  statLabel: {
    color: Colors.grey,
  },
  statFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: VS(8),
  },
  percentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  trendIcon: {
    width: S(12),
    height: VS(12),
    marginRight: S(4),
  },
  statPercent: {},

  // Charts
  chartsRow: {
    flexDirection: 'row',
    gap: MS(12),
  },
  lineChartCard: {
    flex: 0.6,
    backgroundColor: Colors.white,
    borderRadius: MS(14),
    padding: MS(16),
  },
  pieChartCard: {
    flex: 0.4,
    backgroundColor: Colors.white,
    borderRadius: MS(14),
    padding: MS(16),
  },
  chartHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: VS(12),
  },
  chartTitle: {
    color: Colors.black,
  },
  legendRow: {
    flexDirection: 'row',
    gap: MS(12),
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  legendDot: {
    width: S(8),
    height: VS(8),
    borderRadius: MS(4),
    marginRight: S(4),
  },
  legendText: {
    color: Colors.grey,
  },
  pieContainer: {
    alignItems: 'center',
    marginVertical: VS(12),
  },
  pieLegend: {
    marginTop: VS(8),
  },
  pieLegendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: VS(6),
  },
  pieLegendDot: {
    width: S(10),
    height: VS(10),
    borderRadius: MS(5),
    marginRight: S(8),
  },
  pieLegendText: {
    flex: 1,
    color: Colors.black,
  },
  pieLegendPercent: {
    color: Colors.black,
  },

  // INLINE STYLE REPLACEMENTS
  tabIconStyle: {
    marginRight: S(6),
    // tintColor is conditional: activeTab === index ? Colors.white : Colors.black
  },
  lightGreenBg: {
    backgroundColor: '#E8F5E9',
  },
  lightPurpleBg: {
    backgroundColor: '#F3E5F5',
  },
  lightBlueLegendDot: {
    backgroundColor: '#A8C8F0',
  },
  darkBlueLegendDot: {
    backgroundColor: '#3B4B8A',
  },
  flexFull: {
    flex: 1,
  },
  dynamicColorLegendDot: {
    // backgroundColor is dynamic: item.color
  },
  greenPercentText: {
    color: '#4CAF50',
  },
  redPercentText: {
    color: '#E74C3C',
  },
  rowCentered: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export default styles;
