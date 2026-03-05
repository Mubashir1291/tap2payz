import React, {useState} from 'react';
import {
  View,
  Text,
  StatusBar,
  TouchableOpacity,
  Image,
  ScrollView,
  StyleSheet,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {LineChart, PieChart} from 'react-native-gifted-charts';
import {Colors} from '../../utils/Colors';
import {S, VS, MS} from '../../utils/Responsive';
import {
  H3,
  H4,
  Body2,
  Body3,
  Subtitle1,
  Subtitle2,
  Caption,
  ButtonText,
  H1,
} from '../../utils/fonts';
import SalesRefundDetailModal from '../../components/SalesRefundDetailModal';
import { GreenDollarIcon, PurpleDollarIcon, SignalsIcon, CurveIcon, CurveRedDownArrowIcon, CartIcon } from '../../assets/Images';
import { IconSize20 } from '../../utils/IconSizes';

const tabs = [
  'Reports Overview',
  'Transaction Report',
  'Z - Report',
  'X - Report',
  'Employee Management',
  'Inventory Management',
];

// Dummy data
const salesLineData = [
  {value: 180}, {value: 200}, {value: 160}, {value: 190},
  {value: 170}, {value: 250}, {value: 220}, {value: 180},
  {value: 160}, {value: 140}, {value: 150}, {value: 130},
];

const refundLineData = [
  {value: 80}, {value: 100}, {value: 90}, {value: 110},
  {value: 100}, {value: 130}, {value: 120}, {value: 100},
  {value: 90}, {value: 80}, {value: 85}, {value: 70},
];

const pieData = [
  {value: 65.8, color: '#3B4B8A', text: "Men's Leather Jacket"},
  {value: 30.5, color: '#7FD4E8', text: "Women's Jeans..."},
  {value: 3.7, color: '#E0E0E0', text: 'Others'},
];

const xLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const dummyTransaction = {
  serialNumber: '213542',
  transactionNumber: '2135424624',
  customer: 'Michel Grades',
  totalItems: 10,
  dateTime: '1st Dec, 2023 (5:00 PM)',
  totalSales: '5,956.00',
  items: [
    {name: 'Denis T-Shirt', sku: '2152462', qty: 6},
    {name: 'Pure Milk', sku: '2152462', qty: 2},
    {name: 'Coca Cola', sku: '2152462', qty: 2},
    {name: 'Kingfisher', sku: '2152462', qty: 6},
    {name: 'Orange Juice', sku: '2152462', qty: 2},
    {name: 'Slice Juice', sku: '2152462', qty: 2},
  ],
};

const SettingsScreen = () => {
  const navigation = useNavigation();
  const [activeTab, setActiveTab] = useState(0);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [detailType, setDetailType] = useState('sale');

  const openSaleDetail = () => {
    setDetailType('sale');
    setShowDetailModal(true);
  };

  const openRefundDetail = () => {
    setDetailType('refund');
    setShowDetailModal(true);
  };

  return (
    <View style={styles.root}>
      <StatusBar backgroundColor={Colors.primary} barStyle="light-content" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.hamburgerBtn}
          onPress={() => navigation.openDrawer()}>
          <View style={styles.hamburgerLine} />
          <View style={[styles.hamburgerLine, styles.hamburgerLineShort]} />
          <View style={styles.hamburgerLine} />
        </TouchableOpacity>

        {/* Tabs */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tabsContainer}>
          {tabs.map((tab, index) => (
            <TouchableOpacity
              key={index}
              style={[styles.tab, activeTab === index && styles.activeTab]}
              onPress={() => setActiveTab(index)}>
              <Text
                style={[
                  styles.tabText,
                  Caption,
                  activeTab === index && styles.activeTabText,
                ]}>
                {tab}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}>
        {/* Sort By */}
        <View style={styles.sortRow}>
          <TouchableOpacity style={styles.sortBtn}>
            <Text style={[styles.sortText, Caption]}>Sort by ⇅</Text>
          </TouchableOpacity>
        </View>

        {/* Stats Cards */}
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <View style={styles.statHeader}>
              <Text style={[styles.statAmount, H3]}>$10.10K</Text>
              <View style={[styles.statIcon, {backgroundColor: '#E8F5E9'}]}>
                <Image source={SignalsIcon} style={IconSize20} />
              </View>
            </View>
            <View style={styles.statFooter}>
              <Text style={[styles.statLabel, Body2]}>Total Revenue</Text>
              <View style={styles.percentContainer}>
                <Image source={CurveIcon} style={styles.trendIcon} resizeMode="contain" />
                <Text style={[styles.statPercent, Caption, {color: '#4CAF50'}]}>55.23 %</Text>
              </View>
            </View>
          </View>

          <View style={styles.statCard}>
            <View style={styles.statHeader}>
              <Text style={[styles.statAmount, H3]}>$10.10K</Text>
              <View style={[styles.statIcon, {backgroundColor: '#E8F5E9'}]}>
                <Image source={GreenDollarIcon} style={IconSize20} />
              </View>
            </View>
            <View style={styles.statFooter}>
              <Text style={[styles.statLabel, Body2]}>Total Sales</Text>
              <View style={styles.percentContainer}>
                <Image source={CurveIcon} style={styles.trendIcon} resizeMode="contain" />
                <Text style={[styles.statPercent, Caption, {color: '#4CAF50'}]}>50.23 %</Text>
              </View>
            </View>
          </View>

          <View style={styles.statCard}>
            <View style={styles.statHeader}>
              <Text style={[styles.statAmount, H3]}>$10.10K</Text>
              <View style={[styles.statIcon, {backgroundColor: '#F3E5F5'}]}>
                <Image source={PurpleDollarIcon} style={IconSize20} />
              </View>
            </View>
            <View style={styles.statFooter}>
              <Text style={[styles.statLabel, Body2]}>Total Revenue</Text>
              <View style={styles.percentContainer}>
                <Image source={CurveRedDownArrowIcon} style={styles.trendIcon} resizeMode="contain" />
                <Text style={[styles.statPercent, Caption, {color: '#E74C3C'}]}>90.23 %</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Charts Row */}
        <View style={styles.chartsRow}>
          {/* Sales & Refund Line Chart */}
          <TouchableOpacity
            style={styles.lineChartCard}
            activeOpacity={0.9}
            onPress={openSaleDetail}>
            <View style={styles.chartHeader}>
              <Text style={[styles.chartTitle, H1]}>
                Sales & Refund
              </Text>
              <View style={styles.legendRow}>
                <View style={styles.legendItem}>
                  <View
                    style={[styles.legendDot, {backgroundColor: '#A8C8F0'}]}
                  />
                  <Text style={[styles.legendText, Caption]}>Sales</Text>
                </View>
                <View style={styles.legendItem}>
                  <View
                    style={[styles.legendDot, {backgroundColor: '#3B4B8A'}]}
                  />
                  <Text style={[styles.legendText, Caption]}>Refund</Text>
                </View>
              </View>
            </View>
            <LineChart
              data={salesLineData}
              data2={refundLineData}
              height={VS(160)}
              width={S(380)}
              spacing={S(34)}
              color1="#A8C8F0"
              color2="#3B4B8A"
              thickness={2}
              hideDataPoints
              curved
              yAxisColor="transparent"
              xAxisColor={Colors.lightGrey}
              yAxisTextStyle={[Caption, {color: Colors.grey}]}
              xAxisLabelTexts={xLabels}
              xAxisLabelTextStyle={[Caption, {color: Colors.grey}]}
              noOfSections={5}
              rulesType="solid"
              rulesColor={Colors.lightGrey}
            />
          </TouchableOpacity>

          {/* Top Selling Products Pie Chart */}
          <TouchableOpacity
            style={styles.pieChartCard}
            activeOpacity={0.9}
            onPress={openRefundDetail}>
            <Text style={[styles.chartTitle, Subtitle1]}>
              Top Selling Products
            </Text>
            <View style={styles.pieContainer}>
              <PieChart
                data={pieData}
                donut
                radius={MS(60)}
                innerRadius={MS(35)}
                innerCircleColor={Colors.white}
                centerLabelComponent={() => (
                  <Image source={CartIcon} style={IconSize20} />
                )}
              />
            </View>

            {/* Pie Legend */}
            <View style={styles.pieLegend}>
              {pieData.map((item, index) => (
                <View key={index} style={styles.pieLegendItem}>
                  <View
                    style={[styles.pieLegendDot, {backgroundColor: item.color}]}
                  />
                  <Text
                    style={[styles.pieLegendText, Caption]}
                    numberOfLines={1}>
                    {item.text}
                  </Text>
                  <Text style={[styles.pieLegendPercent, Subtitle2]}>
                    {item.value}%
                  </Text>
                </View>
              ))}
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Detail Modal */}
      <SalesRefundDetailModal
        visible={showDetailModal}
        type={detailType}
        transaction={dummyTransaction}
        onClose={() => setShowDetailModal(false)}
      />
    </View>
  );
};

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
});

export default SettingsScreen;
