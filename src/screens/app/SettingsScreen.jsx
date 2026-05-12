import React, { useState, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  StatusBar,
  TouchableOpacity,
  Image,
  ScrollView,
  Modal,
  TouchableWithoutFeedback,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { LineChart, PieChart } from 'react-native-gifted-charts';
import { Colors } from '../../utils/Colors';
import { S, VS, MS } from '../../utils/Responsive';
import { H3, Body2, Subtitle1, Subtitle2, Caption, H1 } from '../../utils/fonts';
import SalesRefundDetailModal from '../../components/SalesRefundDetailModal';
import {
  GreenDollarIcon,
  PurpleDollarIcon,
  SignalsIcon,
  CartIcon,
  InventoryIcon,
  EmployeeIcon,
  ReportIcon,
  OverviewIcon,
  FilterIcon,
} from '../../assets/Images';
import { IconSize20, IconSize12 } from '../../utils/IconSizes';
import styles from './SettingsScreenStyles';
import EmployeeManagement from './EmployeeManagement';
import ZReport from './ZReport';
import XReport from './XReport';
import InventoryManagement from './InventoryManagement';
import TransactionReportScreen from './TransactionReportScreen';
import { GET_WEEKLY_ANALYTICS } from '../../services/Sales&Analytics';
import { useSelector } from 'react-redux';
import Toast from 'react-native-toast-message';

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
  { value: 180 },
  { value: 200 },
  { value: 160 },
  { value: 190 },
  { value: 170 },
  { value: 250 },
  { value: 220 },
  { value: 180 },
  { value: 160 },
  { value: 140 },
  { value: 150 },
  { value: 130 },
];

const pieColors = ['#3B4B8A', '#7FD4E8', '#70ede5ff', '#5A67D8', '#E0E0E0'];

const xLabels = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];

const dummyTransaction = {
  serialNumber: '213542',
  transactionNumber: '2135424624',
  customer: 'Michel Grades',
  totalItems: 10,
  dateTime: '1st Dec, 2023 (5:00 PM)',
  totalSales: '5,956.00',
  items: [
    { name: 'Denis T-Shirt', sku: '2152462', qty: 6 },
    { name: 'Pure Milk', sku: '2152462', qty: 2 },
    { name: 'Coca Cola', sku: '2152462', qty: 2 },
    { name: 'Kingfisher', sku: '2152462', qty: 6 },
    { name: 'Orange Juice', sku: '2152462', qty: 2 },
    { name: 'Slice Juice', sku: '2152462', qty: 2 },
  ],
};

const SettingsScreen = () => {
  const navigation = useNavigation();
  const [activeTab, setActiveTab] = useState(0);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [detailType, setDetailType] = useState('sale');
  const [chartWidth, setChartWidth] = useState(S(380)); // default width
  const { store_id } = useSelector(state => state.user);
  const [analyticsData, setAnalyticsData] = useState();
  const [timeFrame, setTimeFrame] = useState('weekly');
  const [isLoading, setIsLoading] = useState(false);
  const [showTimeFrameModal, setShowTimeFrameModal] = useState(false);

  const handleGetAnalytics = useCallback(async () => {
    setIsLoading(true);
    try {
      const payload = {
        storeId: store_id,
        timeFrame,
      };
      const response = await GET_WEEKLY_ANALYTICS(payload);
      if (response?.status === 'success' || response?.data) {
        setAnalyticsData(response);
      }
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Error fetching analytics',
        text2: error.message,
      });
    } finally {
      setIsLoading(false);
    }
  }, [store_id, timeFrame]);
  useFocusEffect(
    useCallback(() => {
      handleGetAnalytics();
    }, [handleGetAnalytics]),
  );

  const onChartContainerLayout = useCallback(event => {
    const { width } = event.nativeEvent.layout;
    setChartWidth(width - S(40));
  }, []);

  const openSaleDetail = useCallback(() => {
    setDetailType('sale');
    setShowDetailModal(true);
  }, []);

  const { chartData, chartLabels } = useMemo(() => {
    // Dynamically check for series key based on timeframe
    if (isLoading || !analyticsData) {
      return {
        chartData: salesLineData.map(item => ({ ...item, onPress: openSaleDetail })),
        chartLabels: xLabels,
      };
    }

    const salesKey = timeFrame === 'weekly' ? 'WeeklySales' : 'YearlySales';
    const series =
      analyticsData?.data?.[salesKey]?.series || analyticsData?.data?.WeeklySales?.series || [];

    return {
      chartData:
        series.length > 0
          ? series.map(item => ({
            value: Number(item.y) || 0,
            onPress: openSaleDetail,
          }))
          : salesLineData.map(item => ({ ...item, onPress: openSaleDetail })),
      chartLabels: series.map(item => (item.name ? item.name.slice(0, 3) : '')),
    };
  }, [analyticsData, isLoading, openSaleDetail, timeFrame]);

  const pieContainerImage = () => <Image source={CartIcon} style={IconSize20} />;

  const renderActiveTab = () => {
    switch (activeTab) {
      case 1:
        return <TransactionReportScreen />;
      case 2:
        return <ZReport />;
      case 3:
        return <XReport isActive={activeTab === 3} />;
      case 4:
        return <EmployeeManagement />;
      case 5:
        return <InventoryManagement />;
      default:
        return (
          <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
            {isLoading && !analyticsData ? (
              <View style={internalStyles.mainLoader}>
                <ActivityIndicator size="large" color={Colors.primary} />
              </View>
            ) : (
              <>
                {/* Timeframe Filter Button */}
                <View style={styles.timeframeFilterContainer}>
                  <TouchableOpacity
                    style={styles.timeframeBtn}
                    onPress={() => setShowTimeFrameModal(true)}
                  >
                    <Text style={[Caption, styles.timeframeText]}>
                      Timeframe: {timeFrame === 'weekly' ? 'Weekly' : 'Yearly'}
                    </Text>
                    <Image source={FilterIcon} style={[IconSize12, styles.filterIcon]} />
                  </TouchableOpacity>
                </View>

                {/* Stats Cards */}
                <View style={styles.statsRow}>
                  <View style={styles.statCard}>
                    <View style={styles.statHeader}>
                      <Text style={[styles.statAmount, H3]}>
                        ${analyticsData?.data?.salesTopDashboardStats?.totalSales || '0.00'}
                      </Text>
                      <View style={[styles.statIcon, styles.lightGreenBg]}>
                        <Image source={SignalsIcon} style={IconSize20} />
                      </View>
                    </View>
                    <View style={styles.statFooter}>
                      <Text style={[styles.statLabel, Body2]}>Total Revenue</Text>
                    </View>
                  </View>

                  <View style={styles.statCard}>
                    <View style={styles.statHeader}>
                      <Text style={[styles.statAmount, H3]}>
                        ${analyticsData?.data?.salesTopDashboardStats?.totalSales || '0.00'}
                      </Text>
                      <View style={[styles.statIcon, styles.lightGreenBg]}>
                        <Image source={GreenDollarIcon} style={IconSize20} />
                      </View>
                    </View>
                    <View style={styles.statFooter}>
                      <Text style={[styles.statLabel, Body2]}>Total Sales</Text>
                    </View>
                  </View>

                  <View style={styles.statCard}>
                    <View style={styles.statHeader}>
                      <Text style={[styles.statAmount, H3]}>
                        ${analyticsData?.data?.salesTopDashboardStats?.todayTotalSales || '0.00'}
                      </Text>
                      <View style={[styles.statIcon, styles.lightPurpleBg]}>
                        <Image source={PurpleDollarIcon} style={IconSize20} />
                      </View>
                    </View>
                    <View style={styles.statFooter}>
                      <Text style={[styles.statLabel, Body2]}>Today Sales</Text>
                    </View>
                  </View>
                </View>

                {/* Charts Row */}
                <View style={styles.chartsRow}>
                  {/* Sales Line Chart */}
                  <View style={styles.lineChartCard}>
                    <View style={styles.chartHeader}>
                      <Text style={[styles.chartTitle, H1]}>Sales</Text>
                      <View style={styles.legendRow}>
                        <TouchableOpacity style={styles.legendItem} onPress={openSaleDetail}>
                          <View style={[styles.legendDot, styles.lightBlueLegendDot]} />
                          <Text style={[styles.legendText, Caption]}>Sales</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                    <View style={styles.flexFull} onLayout={onChartContainerLayout}>
                      <LineChart
                        data={chartData}
                        height={VS(160)}
                        width={chartWidth}
                        spacing={Math.max(
                          (chartWidth - S(20)) / (chartData.length - 1 || 1),
                          S(20),
                        )}
                        initialSpacing={S(10)}
                        color1="#A8C8F0"
                        thickness={2}
                        hideDataPoints
                        curved
                        yAxisColor="transparent"
                        xAxisColor={Colors.lightGrey}
                        yAxisTextStyle={[Caption, { color: Colors.grey }]}
                        xAxisLabelTexts={chartLabels}
                        xAxisLabelTextStyle={[Caption, { color: Colors.grey }]}
                        noOfSections={5}
                        rulesType="solid"
                        rulesColor={Colors.lightGrey}
                      />
                    </View>
                  </View>

                  {/* Top Selling Products Pie Chart */}
                  <View style={styles.pieChartCard}>
                    <Text style={[styles.chartTitle, Subtitle1]}>Top Selling Products</Text>
                    {analyticsData?.data?.topSellingProducts?.length > 0 ? (
                      <>
                        <View style={styles.pieContainer}>
                          <PieChart
                            data={analyticsData?.data?.topSellingProducts?.map((item, index) => ({
                              value: Number(item.totalSales) || 0,
                              color: pieColors[index % pieColors.length],
                              text: item.productName,
                            }))}
                            donut
                            radius={MS(60)}
                            innerRadius={MS(35)}
                            innerCircleColor={Colors.white}
                            centerLabelComponent={pieContainerImage}
                            sectionAutoFocus
                            sectionRadius={12}
                            strokeWidth={3}
                            strokeColor={Colors.white}
                          />
                        </View>

                        {/* Pie Legend */}
                        <View style={styles.pieLegend}>
                          {analyticsData?.data?.topSellingProducts?.map((item, index) => (
                            <View key={index} style={styles.pieLegendItem}>
                              <View
                                style={[
                                  styles.pieLegendDot,
                                  { backgroundColor: pieColors[index % pieColors.length] },
                                ]}
                              />
                              <Text style={[styles.pieLegendText, Caption]} numberOfLines={1}>
                                {item.productName}
                              </Text>
                              <View style={styles.pieLegendValueContainer}>
                                <Text style={[styles.pieLegendPercent, Subtitle2]}>
                                  ${Number(item.totalSales).toLocaleString()}
                                </Text>
                                <Text style={[Caption, styles.greyText]}>
                                  {item.totalItems} Items
                                </Text>
                              </View>
                            </View>
                          ))}
                        </View>
                      </>
                    ) : (
                      <View
                        style={[styles.flexFull, styles.rowCentered, styles.emptyChartContainer]}
                      >
                        <Text style={[Caption, styles.emptyChartText]}>No data available</Text>
                      </View>
                    )}
                  </View>
                </View>
              </>
            )}
          </ScrollView>
        );
    }
  };

  return (
    <View style={[styles.root, internalStyles.flex1]}>
      <StatusBar backgroundColor={Colors.primary} barStyle="light-content" />

      {/* Header */}
      <View style={[styles.header, internalStyles.headerRow]}>
        <TouchableOpacity style={styles.hamburgerBtn} onPress={() => navigation.openDrawer()}>
          <View style={styles.hamburgerLine} />
          <View style={[styles.hamburgerLine, styles.hamburgerLineShort]} />
          <View style={styles.hamburgerLine} />
        </TouchableOpacity>

        <View style={{ width: S(16) }} />

        {/* Tabs */}
        <ScrollView
          horizontal
          style={internalStyles.flex1}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tabsContainer}
        >
          {tabs.map((tab, index) => (
            <TouchableOpacity
              key={index}
              style={[styles.tab, styles.rowCentered, activeTab === index && styles.activeTab]}
              onPress={() => setActiveTab(index)}
            >
              <Image
                source={tab.icon}
                style={[
                  IconSize12,
                  {
                    tintColor: activeTab === index ? Colors.black : Colors.white,
                  },
                  styles.tabIcon,
                ]}
              />
              <Text style={[styles.tabText, Caption, activeTab === index && styles.activeTabText]}>
                {tab.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <View style={internalStyles.tabContent}>{renderActiveTab()}</View>

      {/* Detail Modal */}
      <SalesRefundDetailModal
        visible={showDetailModal}
        type={detailType}
        transaction={dummyTransaction}
        onClose={() => setShowDetailModal(false)}
      />

      {/* Timeframe Selection Modal */}
      <Modal
        visible={showTimeFrameModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowTimeFrameModal(false)}
      >
        <TouchableWithoutFeedback onPress={() => setShowTimeFrameModal(false)}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={[Subtitle1, styles.modalTitle]}>Select Timeframe</Text>
              <TouchableOpacity
                style={styles.modalOptionBtn}
                onPress={() => {
                  setTimeFrame('weekly');
                  setShowTimeFrameModal(false);
                }}
              >
                <Text
                  style={[
                    Body2,
                    styles.modalOptionText,
                    { color: timeFrame === 'weekly' ? Colors.primary : Colors.black },
                  ]}
                >
                  Weekly
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalOptionBtnLast}
                onPress={() => {
                  setTimeFrame('yearly');
                  setShowTimeFrameModal(false);
                }}
              >
                <Text
                  style={[
                    Body2,
                    styles.modalOptionText,
                    { color: timeFrame === 'yearly' ? Colors.primary : Colors.black },
                  ]}
                >
                  Yearly
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
};

const internalStyles = StyleSheet.create({
  flex1: {
    flex: 1,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  tabContent: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  mainLoader: {
    height: VS(400),
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: Colors.white,
    borderRadius: MS(12),
    padding: MS(20),
    width: S(280),
  },
});

export default SettingsScreen;
