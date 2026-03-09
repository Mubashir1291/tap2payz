import React, {useState, useCallback} from 'react';
import {
  View,
  Text,
  StatusBar,
  TouchableOpacity,
  Image,
  ScrollView,
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
import { GreenDollarIcon, PurpleDollarIcon, SignalsIcon, CurveIcon, CurveRedDownArrowIcon, CartIcon, InventoryIcon, EmployeeIcon, ReportIcon, OverviewIcon } from '../../assets/Images';
import { IconSize20, IconSize12 } from '../../utils/IconSizes';
import styles from './SettingsScreenStyles';
import EmployeeManagement from './EmployeeManagement';
import ZReport from './ZReport';
import XReport from './XReport';
import InventoryManagement from './InventoryManagement';

const tabs = [
  { label: 'Reports Overview', icon: OverviewIcon },
  { label: 'Transaction Report', icon: ReportIcon },
  { label: 'Z - Report', icon: ReportIcon },
  { label: 'X - Report', icon: ReportIcon },
  { label: 'Employee Management', icon: EmployeeIcon },
  { label: 'Inventory Management', icon: InventoryIcon },
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
  const [chartWidth, setChartWidth] = useState(S(380)); // default width

  const onChartContainerLayout = useCallback((event) => {
    const { width } = event.nativeEvent.layout;
    // The gifted chart requires the specific width for drawing area.
    // Subtract ~S(40) to account for Y-axis labels and padding.
    setChartWidth(width - S(40));
  }, []);

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
              style={[
                styles.tab,
                { flexDirection: 'row', alignItems: 'center' },
                activeTab === index && styles.activeTab
              ]}
              onPress={() => setActiveTab(index)}>
              <Image 
                source={tab.icon} 
                style={[
                  IconSize12, 
                  { marginRight: S(6), tintColor: activeTab === index ? Colors.white : Colors.black }
                ]} 
              />
              <Text
                style={[
                  styles.tabText,
                  Caption,
                  activeTab === index && styles.activeTabText,
                ]}>
                {tab.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {activeTab === 5 ? (
        <InventoryManagement />
      ) : activeTab === 4 ? (
        <EmployeeManagement />
      ) : activeTab === 2 ? (
        <ZReport />
      ) : activeTab === 3 ? (
        <XReport isActive={activeTab === 3} />
      ) : (
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
            <View style={styles.lineChartCard}>
              <View style={styles.chartHeader}>
                <Text style={[styles.chartTitle, H1]}>
                  Sales & Refund
                </Text>
                <View style={styles.legendRow}>
                  <TouchableOpacity style={styles.legendItem} onPress={openSaleDetail}>
                    <View
                      style={[styles.legendDot, {backgroundColor: '#A8C8F0'}]}
                    />
                    <Text style={[styles.legendText, Caption]}>Sales</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.legendItem} onPress={openRefundDetail}>
                    <View
                      style={[styles.legendDot, {backgroundColor: '#3B4B8A'}]}
                    />
                    <Text style={[styles.legendText, Caption]}>Refund</Text>
                  </TouchableOpacity>
                </View>
              </View>
              <View style={{ flex: 1 }} onLayout={onChartContainerLayout}>
                <LineChart
                  data={salesLineData.map(item => ({...item, onPress: openSaleDetail}))}
                  data2={refundLineData.map(item => ({...item, onPress: openRefundDetail}))}
                  height={VS(160)}
                  width={chartWidth}
                  spacing={Math.max((chartWidth - S(20)) / 11, S(20))}
                  initialSpacing={S(10)}
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
              </View>
            </View>

            {/* Top Selling Products Pie Chart */}
            <View style={styles.pieChartCard}>
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
            </View>
          </View>
        </ScrollView>
      )}

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

export default SettingsScreen;
