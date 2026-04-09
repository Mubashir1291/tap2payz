import React, { useState, useMemo, useEffect, use } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Image,
  ActivityIndicator,
} from 'react-native';
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
  ExportIcon,
} from '../../assets/Images';
import styles from './TransactionReportScreenStyles';
import { S } from '../../utils/Responsive';
import SortModal, { applySort } from '../../components/SortModal';
import { GET_TRANSACTION_DETAIL } from '../../services/Transaction';
import { useSelector } from 'react-redux';

const TransactionReportScreen = () => {
  const [activeTab, setActiveTab] = useState('Sales');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItem, setSelectedItem] = useState(null);
  const [showSortModal, setShowSortModal] = useState(false);
  const [currentFilter, setCurrentFilter] = useState('a-z');
  const { store_id } = useSelector(state => state.user);
  const [detailLoading, setDetailLoading] = useState(false);
  const [detailError, setDetailError] = useState(null);

  // Sample transaction list - minimal data for the list view
  const [transactions] = useState([
    {
      id: '2135424624',
      amount: '$5,956',
      paymentType: 'Card',
      status: 'Approved',
      details: null,
    },
    {
      id: '2135424625',
      amount: '$3,200',
      paymentType: 'Cash',
      status: 'Approved',
      details: null,
    },
    {
      id: '2135424626',
      amount: '$1,500',
      paymentType: 'Card',
      status: 'Approved',
      details: null,
    },
    {
      id: '2135424627',
      amount: '$4,750',
      paymentType: 'Cash',
      status: 'Decline',
      details: null,
    },
    {
      id: '2135424628',
      amount: '$2,100',
      paymentType: 'Card',
      status: 'Approved',
      details: null,
    },
    {
      id: '2135424629',
      amount: '$3,900',
      paymentType: 'Cash',
      status: 'Approved',
      details: null,
    },
    {
      id: '2135424630',
      amount: '$5,100',
      paymentType: 'Card',
      status: 'Decline',
      details: null,
    },
  ]);

  const handleGetTransactionDetail = async id => {
    setDetailLoading(true);
    setDetailError(null);
    try {
      const response = await GET_TRANSACTION_DETAIL({
        id: id,
        store_id: store_id,
      });
      console.log('API Response for Transaction Detail:', response);
    } catch (error) {
      console.error('Error fetching transaction detail:', error);
      setDetailError('Failed to load transaction details');
    } finally {
      setDetailLoading(false);
    }
  };

  useEffect(() => {
    handleGetTransactionDetail(transactions[0].id);
  }, []);

  const processedData = useMemo(() => {
    let data = [...transactions];

    if (searchQuery.trim() !== '') {
      data = data.filter(
        item =>
          item.id.includes(searchQuery) ||
          item.amount.includes(searchQuery) ||
          (item.details &&
            item.details.customer?.toLowerCase().includes(searchQuery.toLowerCase())) ||
          (item.details && item.details.transactionNumber?.includes(searchQuery)),
      );
    }

    return applySort(data, currentFilter, item => item.details?.customer);
  }, [searchQuery, currentFilter, transactions]);

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
            <Text
              style={[Subtitle2, activeTab === 'Sales' ? styles.tabTextActive : styles.tabText]}
            >
              Sales
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tabBtn, activeTab === 'Refund' && styles.tabBtnActive]}
            onPress={() => setActiveTab('Refund')}
          >
            <Text
              style={[Subtitle2, activeTab === 'Refund' ? styles.tabTextActive : styles.tabText]}
            >
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
          <Text style={[styles.actionBtnText, Caption]}>Filter by</Text>
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

          {processedData.length === 0 ? (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
              <Text style={[Subtitle2, { color: '#999' }]}>No transactions found</Text>
            </View>
          ) : (
            <ScrollView showsVerticalScrollIndicator={false}>
              {processedData.map(item => (
                <TouchableOpacity
                  key={item.id}
                  style={[styles.listItem, selectedItem?.id === item.id && styles.listItemActive]}
                  onPress={() => {
                    setSelectedItem(item);
                    handleGetTransactionDetail(item.id);
                  }}
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
                  <View
                    style={[
                      styles.colStatus,
                      {
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                      },
                    ]}
                  >
                    <Text
                      style={[
                        Overline2,
                        item.status === 'Approved' ? styles.approvedText : styles.declineText,
                      ]}
                    >
                      {item.status}
                    </Text>
                    <Image source={RightArrowIcon} style={[IconSize12, styles.arrowIcon]} />
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          )}

          {/* Right Detail Panel */}
          <View style={styles.rightPanel}>
            {detailLoading ? (
              <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color="#3B4B8A" />
                <Text style={[Body3, { marginTop: 16, color: '#999' }]}>Loading details...</Text>
              </View>
            ) : detailError ? (
              <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Text style={[Subtitle2, { color: '#E74C3C', textAlign: 'center' }]}>
                  {detailError}
                </Text>
              </View>
            ) : selectedItem?.details ? (
              <View style={{ flex: 1 }}>
                <View style={styles.topDetailsContainer}>
                  <View>
                    <Text style={[styles.detailLabel, Body3]}>Transaction Number:</Text>
                    <Text style={[styles.detailValue, Subtitle2]}>
                      {selectedItem.details.transactionNumber}
                    </Text>
                  </View>
                  <View>
                    <Text style={[styles.detailLabel, Body3]}>Customer:</Text>
                    <Text style={[styles.detailValue, Subtitle2]}>
                      {selectedItem.details.customer}
                    </Text>
                  </View>
                  <View>
                    <Text style={[styles.detailLabel, Body3]}>Transaction Type:</Text>
                    <Text style={[styles.detailValue, Subtitle2]}>
                      {selectedItem.details.transactionType}
                    </Text>
                  </View>
                  <View>
                    <Text style={[styles.detailLabel, Body3]}>Date & Time:</Text>
                    <Text style={[styles.detailValue, Subtitle2]}>
                      {selectedItem.details.dateTime}
                    </Text>
                  </View>
                  <View>
                    <Text style={[styles.detailLabel, Body3]}>Total Amount:</Text>
                    <Text style={[styles.detailValue, Subtitle2]}>
                      {selectedItem.details.totalAmount}
                    </Text>
                  </View>
                </View>

                <Text style={[styles.orderDetailTitle, Subtitle2]}>Order Detail:</Text>

                <View style={styles.orderDetailContainer}>
                  <View style={styles.orderHeader}>
                    <Text style={[styles.orderTitleLabel, Subtitle2]}>
                      {selectedItem.details.orderNumber}
                    </Text>
                    <Text style={[styles.orderStatusLabel, Body3]}>
                      {selectedItem.details.status}
                    </Text>
                  </View>

                  <View style={styles.tableHeader}>
                    <Text style={[styles.colQT, styles.headerText, Body3]}>QT</Text>
                    <Text style={[styles.colItem, styles.headerText, Body3]}>Items</Text>
                    <Text
                      style={[styles.colSKU, styles.headerText, Body3, { textAlign: 'center' }]}
                    >
                      SKU
                    </Text>
                    <Text style={[styles.colPrice, styles.headerText, Body3]}>Price</Text>
                  </View>

                  <ScrollView showsVerticalScrollIndicator={false}>
                    {processedOrderItems.map((row, idx) => (
                      <View key={idx} style={styles.tableRow}>
                        <Text style={[styles.colQT, styles.tableRowText, Body3]}>{row.qt}</Text>
                        <Text style={[styles.colItem, styles.tableRowText, Body3]}>{row.name}</Text>
                        <Text
                          style={[
                            styles.colSKU,
                            styles.tableRowText,
                            Body3,
                            { textAlign: 'center' },
                          ]}
                        >
                          {row.sku}
                        </Text>
                        <Text style={[styles.colPrice, styles.tableRowPrice, Body3]}>
                          {row.price}
                        </Text>
                      </View>
                    ))}

                    <View style={styles.subtotalContainer}>
                      <Text style={[styles.subtotalLabel, Subtitle2]}>Subtotal:</Text>
                      <Text style={[styles.subtotalAmount, Subtitle2]}>
                        {selectedItem.details.subtotal}
                      </Text>
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
          onSelect={val => setCurrentFilter(val)}
          currentSort={currentFilter}
        />
      </View>
    </View>
  );
};

export default TransactionReportScreen;
