import React, { useState, useMemo } from 'react';
import { View, Text, TouchableOpacity, ScrollView, TextInput, Image } from 'react-native';
import { Subtitle2, Body3, Caption, H2, Overline, Overline2 } from '../../utils/fonts';
import { IconSize12 } from '../../utils/IconSizes';
import {
  SearchIcon,
  UploadIcon,
  ListIcon,
  RightArrowIcon,
  CardpaymentIcon,
  CashIcon,
  FilterIcon,
  ExportIcon
} from '../../assets/Images';
import styles from './TransactionReportScreenStyles';
import { S } from '../../utils/Responsive';
import SortModal, { applySort } from '../../components/SortModal';

const dummyData = [
  {
    id: '01',
    amount: '€5,956',
    paymentType: 'Card',
    status: 'Approved',
    details: {
      transactionNumber: '2135424624',
      customer: 'Michel Gerdes',
      transactionType: 'Sale',
      dateTime: 'YY/MM/DD - TT:MM)',
      totalAmount: '€5,956.00',
      orderNumber: 'Order #432',
      status: 'Approved',
      items: [
        { qt: '01', name: 'Fish and chips', sku: '2152462', price: '€ 17.50' },
        { qt: '02', name: 'lemonade', sku: '2152462', price: '€ 17.50' },
        { qt: '03', name: 'water', sku: '2152462', price: '€ 17.50' },
        { qt: '04', name: 'Snacks', sku: '2152462', price: '€ 17.50' },
        { qt: '05', name: 'Fish and chips', sku: '2152462', price: '€ 17.50' },
      ],
      subtotal: '€ 44.25',
    },
  },
  {
    id: '02',
    amount: '€5,956',
    paymentType: 'Cash',
    status: 'Approved',
    details: {
      transactionNumber: '2135424625',
      customer: 'John Doe',
      transactionType: 'Sale',
      dateTime: 'YY/MM/DD - TT:MM)',
      totalAmount: '€5,956.00',
      orderNumber: 'Order #433',
      status: 'Approved',
      items: [
        { qt: '01', name: 'Burger', sku: '2152463', price: '€ 10.00' },
      ],
      subtotal: '€ 10.00',
    },
  },
  {
    id: '03',
    amount: '€5,956',
    paymentType: 'Cash',
    status: 'Decline',
    details: null,
  },
  {
    id: '04',
    amount: '€5,956',
    paymentType: 'Card',
    status: 'Approved',
    details: null,
  },
  {
    id: '05',
    amount: '€5,956',
    paymentType: 'Cash',
    status: 'Approved',
    details: null,
  },
  {
    id: '06',
    amount: '€5,956',
    paymentType: 'Card',
    status: 'Approved',
    details: null,
  },
  {
    id: '07',
    amount: '€5,956',
    paymentType: 'Cash',
    status: 'Decline',
    details: null,
  },
  {
    id: '08',
    amount: '€5,956',
    paymentType: 'Cash',
    status: 'Decline',
    details: null,
  },
  {
    id: '09',
    amount: '€5,956',
    paymentType: 'Card',
    status: 'Approved',
    details: null,
  },
  {
    id: '10',
    amount: '€5,956',
    paymentType: 'Card',
    status: 'Decline',
    details: null,
  },
];

const TransactionReportScreen = () => {
  const [activeTab, setActiveTab] = useState('Sales');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItem, setSelectedItem] = useState(dummyData[0]);
  const [showSortModal, setShowSortModal] = useState(false);
  const [currentFilter, setCurrentFilter] = useState('a-z');

  const processedData = useMemo(() => {
    let data = [...dummyData];

    if (searchQuery.trim() !== '') {
      data = data.filter(
        item =>
          item.id.includes(searchQuery) ||
          item.amount.includes(searchQuery) ||
          (item.details && item.details.customer.toLowerCase().includes(searchQuery.toLowerCase())) ||
          (item.details && item.details.transactionNumber.includes(searchQuery))
      );
    }

    return applySort(data, currentFilter, item => item.details?.customer);
  }, [searchQuery, currentFilter]);

  const processedOrderItems = useMemo(() => {
    if (!selectedItem?.details?.items) return [];
    
    return applySort(selectedItem.details.items, currentFilter, item => item.name);
  }, [selectedItem, currentFilter]);

  return (
    <View style={styles.root}>
      {/* Header Row */}
      <View style={styles.headerRow}>
        <Text style={[styles.title, H2]}>Transaction Report</Text>
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tabBtn, activeTab === 'Sales' && styles.tabBtnActive]}
            onPress={() => setActiveTab('Sales')}
          >
            <Text style={[Subtitle2, activeTab === 'Sales' ? styles.tabTextActive : styles.tabText]}>
              Sales
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tabBtn, activeTab === 'Refund' && styles.tabBtnActive]}
            onPress={() => setActiveTab('Refund')}
          >
            <Text style={[Subtitle2, activeTab === 'Refund' ? styles.tabTextActive : styles.tabText]}>
              Refund
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.spacer} />

        <View style={styles.searchBar}>
          <Image source={SearchIcon} style={[IconSize12, styles.searchIcon]} />
          <TextInput
            style={[styles.searchInput, Body3]}
            placeholder="Search"
            placeholderTextColor="#3B4B8A"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        <TouchableOpacity style={styles.actionBtn} onPress={() => setShowSortModal(true)}>
          <Text style={[styles.actionBtnText, Caption]}>
            Filter by
          </Text>
          <Image source={FilterIcon} style={[IconSize12, styles.actionIconTint]} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionBtn}>
          <Image source={ExportIcon} style={[IconSize12, styles.actionIconTint]} />
          <Text style={[styles.actionBtnText, Caption]}>Export</Text>
        </TouchableOpacity>
      </View>

      {/* Main Content */}
      <View style={styles.contentContainer}>
        {/* Left List Panel */}
        <View style={styles.leftPanel}>
          <View style={styles.leftListHeader}>
            <Text style={[styles.colSr, styles.headerText, Body3]}>Sr.</Text>
            <Text style={[styles.colAmount, styles.headerText, Body3]}>Amount</Text>
            <Text style={[styles.colType, styles.headerText, Body3]}>Payment Type</Text>
            <Text style={[styles.colStatus, styles.headerText, Body3]}>Status</Text>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            {processedData.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={[styles.listItem, selectedItem?.id === item.id && styles.listItemActive]}
                onPress={() => setSelectedItem(item)}
              >
                <Text style={[styles.colSr, styles.rowText, Body3]}>{item.id}</Text>
                <Text style={[styles.colAmount, styles.rowText, Body3]}>{item.amount}</Text>
                <View style={[styles.colType, styles.typeRow]}>
                  <Image
                    source={item.paymentType === 'Card' ? CardpaymentIcon : CashIcon}
                    style={styles.typeIcon}
                  />
                  <Text style={[styles.rowText, Body3]}>{item.paymentType}</Text>
                </View>
                <View style={[styles.colStatus, { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }]}>
                  <Text
                    style={[
                      Overline2,
                      item.status === 'Approved' ? styles.approvedText : styles.declineText
                    ]}
                  >
                    {item.status}
                  </Text>
                  <Image source={RightArrowIcon} style={[IconSize12, styles.arrowIcon]} />
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Right Detail Panel */}
        <View style={styles.rightPanel}>
          {selectedItem?.details ? (
            <View style={{ flex: 1 }}>
              <View style={styles.topDetailsContainer}>
                <View>
                  <Text style={[styles.detailLabel, Body3]}>Transaction Number:</Text>
                  <Text style={[styles.detailValue, Subtitle2]}>{selectedItem.details.transactionNumber}</Text>
                </View>
                <View>
                  <Text style={[styles.detailLabel, Body3]}>Customer:</Text>
                  <Text style={[styles.detailValue, Subtitle2]}>{selectedItem.details.customer}</Text>
                </View>
                <View>
                  <Text style={[styles.detailLabel, Body3]}>Transaction Type:</Text>
                  <Text style={[styles.detailValue, Subtitle2]}>{selectedItem.details.transactionType}</Text>
                </View>
                <View>
                  <Text style={[styles.detailLabel, Body3]}>Date & Time:</Text>
                  <Text style={[styles.detailValue, Subtitle2]}>{selectedItem.details.dateTime}</Text>
                </View>
                <View>
                  <Text style={[styles.detailLabel, Body3]}>Total Amount:</Text>
                  <Text style={[styles.detailValue, Subtitle2]}>{selectedItem.details.totalAmount}</Text>
                </View>
              </View>

              <Text style={[styles.orderDetailTitle, Subtitle2]}>Order Detail:</Text>

              <View style={styles.orderDetailContainer}>
                <View style={styles.orderHeader}>
                  <Text style={[styles.orderTitleLabel, Subtitle2]}>{selectedItem.details.orderNumber}</Text>
                  <Text style={[styles.orderStatusLabel, Body3]}>{selectedItem.details.status}</Text>
                </View>

                <View style={styles.tableHeader}>
                  <Text style={[styles.colQT, styles.headerText, Body3]}>QT</Text>
                  <Text style={[styles.colItem, styles.headerText, Body3]}>Items</Text>
                  <Text style={[styles.colSKU, styles.headerText, Body3, { textAlign: 'center' }]}>SKU</Text>
                  <Text style={[styles.colPrice, styles.headerText, Body3]}>Price</Text>
                </View>

                <ScrollView showsVerticalScrollIndicator={false}>
                  {processedOrderItems.map((row, idx) => (
                    <View key={idx} style={styles.tableRow}>
                      <Text style={[styles.colQT, styles.tableRowText, Body3]}>{row.qt}</Text>
                      <Text style={[styles.colItem, styles.tableRowText, Body3]}>{row.name}</Text>
                      <Text style={[styles.colSKU, styles.tableRowText, Body3, { textAlign: 'center' }]}>{row.sku}</Text>
                      <Text style={[styles.colPrice, styles.tableRowPrice, Body3]}>{row.price}</Text>
                    </View>
                  ))}

                  <View style={styles.subtotalContainer}>
                    <Text style={[styles.subtotalLabel, Subtitle2]}>Subtotal:</Text>
                    <Text style={[styles.subtotalAmount, Subtitle2]}>{selectedItem.details.subtotal}</Text>
                  </View>
                </ScrollView>
              </View>
            </View>
          ) : (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
              <Text style={[Subtitle2, { color: '#999' }]}>No details available</Text>
            </View>
          )}
        </View>
      </View>

      <SortModal 
        visible={showSortModal}
        onClose={() => setShowSortModal(false)}
        onSelect={(val) => setCurrentFilter(val)}
        currentSort={currentFilter}
      />
    </View>
  );
};

export default TransactionReportScreen;
