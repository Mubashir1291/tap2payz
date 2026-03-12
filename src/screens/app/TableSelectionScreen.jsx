import React, { useState } from 'react';
import {
  View,
  Text,
  StatusBar,
  TouchableOpacity,
  FlatList,
  Image,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Colors } from '../../utils/Colors';
import { S, VS, MS } from '../../utils/Responsive';
import { Subtitle2, Body3, H4, Subtitle1, Caption, Overline } from '../../utils/fonts';
import { IconSize12, IconSize16, IconSize20 } from '../../utils/IconSizes';
import {
  DiscountIcon,
  DollarIcon,
  BuyersIcon,
  RightArrowIcon,
  ArrowDownIcon,
  MenuIcon,
} from '../../assets/Images';
import styles from './TableSelectionScreenStyles';

// Dummy table data matched to screenshot closely
const tables = Array.from({ length: 24 }, (_, i) => {
  const tableNum = i + 1;
  const isProcessing = [1, 3, 5, 15, 17, 19].includes(tableNum);
  const isModified = tableNum === 1;
  let seats = 4;
  if ([2, 8, 14, 20].includes(tableNum)) seats = 6;
  if ([3, 9, 15, 21].includes(tableNum)) seats = 8;
  if ([4, 10, 16, 22].includes(tableNum)) seats = 10;
  if ([5, 11, 17, 23].includes(tableNum)) seats = 12;
  if ([6, 12, 18, 24].includes(tableNum)) seats = 14;

  return {
    id: tableNum.toString(),
    number: tableNum,
    seats,
    status: isProcessing ? 'Processing' : 'Available',
    isModified,
  };
});

const TableSelectionScreen = () => {
  const navigation = useNavigation();
  const [activeTab, setActiveTab] = useState('Dine in');

  const renderTable = ({ item }) => {
    const isProcessing = item.status === 'Processing';
    
    // Screenshot exact colors:
    // Available Table: Core = #A4B4FF, Chairs = #3E468A
    // Processing Table: Core = #FEE4C1, Chairs = #FEE4C1
    const coreColor = isProcessing ? '#FEE4C1' : '#A4B4FF';
    const chairColor = isProcessing ? '#FEE4C1' : '#3E468A';

    return (
      <TouchableOpacity 
        style={styles.tableWrapper} 
        activeOpacity={0.7}
        onPress={() => {
          if (isProcessing) {
            navigation.navigate('OrderProcessingScreen', { tableNumber: item.number });
          }
        }}
      >
        {/* Top Chair */}
        <View style={[styles.chairTop, { top: '5%', left: '35%', backgroundColor: chairColor }]} />
        {/* Bottom Chair */}
        <View style={[styles.chairBottom, { bottom: '5%', left: '35%', backgroundColor: chairColor }]} />
        {/* Left Chair */}
        <View style={[styles.chairLeft, { left: '5%', top: '35%', backgroundColor: chairColor }]} />
        {/* Right Chair */}
        <View style={[styles.chairRight, { right: '5%', top: '35%', backgroundColor: chairColor }]} />
        
        {/* Table Core (the square part) */}
        <View style={[styles.tableCore, { backgroundColor: coreColor }]}>
          <Text style={styles.tableNameText}>Table {item.number}</Text>
          <Text style={styles.tableSeatText}>Seats: {item.seats}</Text>
          
          {isProcessing && (
            <View style={styles.statusIndicatorContainer}>
              <View style={[styles.statusDot, {backgroundColor: '#C8933A'}]} />
              <Text style={styles.statusText}>Processing</Text>
            </View>
          )}
          {item.isModified && (
            <View style={styles.statusIndicatorContainer}>
              <View style={[styles.statusDot, {backgroundColor: '#8B5A2B'}]} />
              <Text style={styles.statusText}>Modified</Text>
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.root}>
      <StatusBar backgroundColor="#c6cdefff" barStyle="dark-content" />

      {/* ───── LEFT PANEL ───── */}
      <View style={styles.leftPanel}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <TouchableOpacity
              style={styles.hamburgerBtn}
              onPress={() => navigation.openDrawer()}
            >
              <Image source={MenuIcon} style={IconSize20} />
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={styles.viewOrdersBtn}
            onPress={() => navigation.navigate('ViewOrdersScreen')}
          >
            <Text style={[styles.viewOrdersText, Body3]}>View Orders</Text>
            <Image source={RightArrowIcon} style={[IconSize12, styles.viewOrdersIcon]} />
          </TouchableOpacity>
        </View>

        {/* Tab Selector & Area Filter */}
        <View style={styles.tabsContainer}>
          <View style={styles.tabsSwitch}>
            <TouchableOpacity
              style={[
                styles.tabBtn,
                activeTab === 'Dine in' && styles.activeTabBtn,
              ]}
              onPress={() => setActiveTab('Dine in')}
            >
              <Text
                style={[
                  Subtitle2,
                  activeTab === 'Dine in' ? styles.activeTabText : styles.tabText,
                ]}
              >
                Dine in
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.tabBtn,
                activeTab === 'Take Away' && styles.activeTabBtn,
              ]}
              onPress={() => setActiveTab('Take Away')}
            >
              <Text
                style={[
                  Subtitle2,
                  activeTab === 'Take Away' ? styles.activeTabText : styles.tabText,
                ]}
              >
                Take Away
              </Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.areaSelector}>
            <Text style={[styles.areaText, Subtitle2]}>Area: 1 (Ground Floor)</Text>
            <Image source={ArrowDownIcon} style={[IconSize12, { tintColor: '#2b3474' }]} />
          </TouchableOpacity>
        </View>

        {/* Table Grid */}
        <FlatList
          data={tables}
          keyExtractor={(item) => item.id}
          renderItem={renderTable}
          numColumns={6}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.gridContainer}
        />
      </View>

      {/* ───── RIGHT CART PANEL ───── */}
      <View style={styles.cartPanel}>
        {/* Top Header */}
        <View style={styles.cartPanelHeaderRow}>
          <Text style={[styles.cartHeaderText, Subtitle1]}>Table #:</Text>
          <Text style={[styles.cartHeaderText, Subtitle1]}>Cashier: Jane</Text>
        </View>

        {/* Cart Listing */}
        <View style={styles.cartContent}>
          <View style={styles.emptyCart}>
            <Text style={[styles.emptyCartText, H4]}>Cart is empty!</Text>
          </View>
        </View>

        {/* Actions Rows */}
        <View style={styles.actionRow}>
          <TouchableOpacity style={styles.actionBtn}>
            <Image source={DiscountIcon} style={[IconSize16, styles.actionIcon]} />
            <Text style={Overline}>Discount</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionBtn}>
            <Image source={DollarIcon} style={[IconSize16, styles.actionIcon]} />
            <Text style={Overline}>Add TIP</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionBtn}>
            <Image source={DiscountIcon} style={[IconSize16, styles.actionIcon, {tintColor: '#aaa'}]} />
            <Text style={Overline}>Quick Sale</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionBtn}>
           <Image source={BuyersIcon} style={[IconSize16, styles.actionIcon]} />
           <Text style={Overline}>Buyer Details</Text>
          </TouchableOpacity>
        </View>

        {/* Total Section */}
        <View style={styles.totalSection}>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total:</Text>
            <Text style={styles.totalAmount}>$ 00.00</Text>
          </View>

          <View style={styles.bottomButtonGroup}>
            <TouchableOpacity style={styles.processBtn}>
              <Text style={styles.btnText}>Process Order</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.cancelBtn}>
              <Text style={styles.btnText}>Cancel Order</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.checkoutBtn}>
            <Text style={styles.checkoutBtnText}>Proceed to Checkout</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default TableSelectionScreen;
