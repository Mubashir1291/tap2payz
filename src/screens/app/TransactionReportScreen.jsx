import React, { useState, useMemo, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Image,
  ActivityIndicator,
  FlatList,
} from 'react-native';
import { Subtitle2, Body3, Caption, H2, Overline, Overline2, Subtitle1 } from '../../utils/fonts';
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
import { useSelector } from 'react-redux';
import { GET_ALL_TRANSACTION } from '../../services/Reports';
import useDebounce from '../../utils/useDebounce';

const TransactionReportScreen = () => {
  const [activeTab, setActiveTab] = useState('Sales');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItem, setSelectedItem] = useState(null);
  const [showSortModal, setShowSortModal] = useState(false);
  const [currentFilter, setCurrentFilter] = useState('a-z');
  const { store_id } = useSelector(state => state.user);
  const { deviceId } = useSelector(state => state.device);

  const [transactionSearchQuery, setTransactionSearchQuery] = useState({
    page: 1,
    itemsPerPage: 10,
    searchText: '',
    storeId: store_id,
    deviceId: deviceId,
    transType: '',
  });
  const [transactions, setTransactions] = useState([]);
  const [transactionsData, setTransactionsData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [detailLoading, setDetailLoading] = useState(false);
  const [detailError, setDetailError] = useState(null);
  const isLoadingRef = useRef(false);

  const debouncedValue = useDebounce(searchQuery, 500);

  const handleFetchAllTransactions = async (query, loadMore = false) => {
    isLoadingRef.current = true;
    if (loadMore) {
      setLoadingMore(true);
    } else {
      setIsLoading(true);
    }
    try {
      const response = await GET_ALL_TRANSACTION(query);
      const items = response?.data?.items || [];

      if (loadMore) {
        setTransactions(prev => [...prev, ...items]);
      } else {
        setTransactions(items);
        if (items.length > 0) setSelectedItem(items[0]);
      }

      setTransactionsData(response?.data);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    } finally {
      setIsLoading(false);
      setLoadingMore(false);
      isLoadingRef.current = false;
    }
  };

  useEffect(() => {
    handleFetchAllTransactions(transactionSearchQuery, transactionSearchQuery.page > 1);
  }, [transactionSearchQuery, transactionSearchQuery.page > 1]);

  useEffect(() => {
    setTransactionSearchQuery(prev => ({
      ...prev,
      searchText: debouncedValue,
      page: 1,
    }));
  }, [debouncedValue]);

  useEffect(() => {
    setTransactionSearchQuery(prev => ({
      ...prev,
      storeId: store_id,
      deviceId: deviceId,
      page: 1,
    }));
  }, [store_id, deviceId]);

  const loadMoreTransactions = () => {
    if (loadingMore || isLoadingRef.current || !transactionsData || !transactionsData.hasNextPage) {
      return;
    }
    isLoadingRef.current = true;
    setTransactionSearchQuery(prev => ({ ...prev, page: prev.page + 1 }));
  };

  const handleGetTransactionDetail = id => {
    setDetailLoading(true);
    const item = transactions.find(t => t._id === id);
    if (item) {
      setSelectedItem(item);
    }
    setDetailLoading(false);
  };

  const processedData = useMemo(() => {
    // Search is handled by API; logic here focuses on local sorting
    return applySort(transactions, currentFilter, item =>
      item.buyer_info?.name ? `${item.buyer_info.name}` : 'Walk-in',
    );
  }, [currentFilter, transactions]);

  const processedOrderItems = useMemo(() => {
    if (!selectedItem?.products) return [];

    return applySort(selectedItem.products, currentFilter, item => item.product_name);
  }, [selectedItem, currentFilter]);

  return (
    <View style={styles.root}>
      {/* Header Row */}
      <View style={styles.headerRow}>
        <Text style={[styles.title, H2]}>Transaction Report</Text>

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

          {isLoading ? (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
              <ActivityIndicator size="large" color="#3B4B8A" />
            </View>
          ) : processedData.length === 0 ? (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
              <Text style={[Subtitle2, { color: '#999' }]}>No transactions found</Text>
            </View>
          ) : (
            <FlatList
              data={processedData}
              keyExtractor={item => item._id}
              renderItem={({ item, index }) => (
                <TouchableOpacity
                  style={[styles.listItem, selectedItem?._id === item._id && styles.listItemActive]}
                  onPress={() => handleGetTransactionDetail(item._id)}
                >
                  <Text style={[styles.colSr, styles.rowText, Body3]}>{index + 1}</Text>
                  <Text style={[styles.colAmount, styles.rowText, Body3]}>
                    $ {item?.totalAmount}
                  </Text>
                  <View style={[styles.colType, styles.typeRow]}>
                    <Image
                      source={item.transactionType === 'CARD' ? CardpaymentIcon : CashIcon}
                      style={styles.typeIcon}
                    />
                    <Text style={[styles.rowText, Body3]}>
                      {item.transactionType?.charAt(0) +
                        item.transactionType?.slice(1).toLowerCase()}
                    </Text>
                  </View>
                  <View
                    style={[
                      styles.colStatus,
                      {
                        flexDirection: 'row',
                        alignItems: 'center',
                        backgroundColor: 'yellow',
                      },
                    ]}
                  >
                    <Text
                      style={[
                        Body3,
                        item.status === 'Completed' ? styles.approvedText : styles.declineText,
                      ]}
                    >
                      {item.status || 'N/A'}
                    </Text>
                    <Image source={RightArrowIcon} style={[IconSize12, styles.arrowIcon]} />
                  </View>
                </TouchableOpacity>
              )}
              onEndReached={loadMoreTransactions}
              onEndReachedThreshold={0.1}
              ListFooterComponent={
                loadingMore ? (
                  <View style={{ paddingVertical: 20 }}>
                    <ActivityIndicator size="large" color="#3B4B8A" />
                  </View>
                ) : null
              }
              showsVerticalScrollIndicator={false}
            />
          )}
        </View>
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
          ) : selectedItem ? (
            <View style={{ flex: 1 }}>
              <View style={styles.topDetailsContainer}>
                <View>
                  <Text style={[styles.detailLabel, Body3]}>Transaction Number:</Text>
                  <Text style={[styles.detailValue, Subtitle2]}>
                    {selectedItem.transactionNumber}
                  </Text>
                </View>
                <View>
                  <Text style={[styles.detailLabel, Body3]}>Customer:</Text>
                  <Text style={[styles.detailValue, Subtitle2]}>
                    {selectedItem.buyer_info?.name
                      ? `${selectedItem.buyer_info.name}`
                      : 'Walk-in Customer'}
                  </Text>
                </View>
                <View>
                  <Text style={[styles.detailLabel, Body3]}>Transaction Type:</Text>
                  <Text style={[styles.detailValue, Subtitle2]}>{selectedItem.type}</Text>
                </View>
                <View>
                  <Text style={[styles.detailLabel, Body3]}>Date & Time:</Text>
                  <Text style={[styles.detailValue, Subtitle2]}>
                    {new Date(selectedItem.date).toLocaleDateString()} ({selectedItem.transTime})
                  </Text>
                </View>
                <View>
                  <Text style={[styles.detailLabel, Body3]}>Total Amount:</Text>
                  <Text style={[styles.detailValue, Subtitle2]}>$ {selectedItem.totalAmount}</Text>
                </View>
              </View>

              <Text style={[styles.orderDetailTitle, Subtitle2]}>Order Detail:</Text>

              <View style={styles.orderDetailContainer}>
                <View style={styles.orderHeader}>
                  <Text style={[styles.orderTitleLabel, Subtitle2]}>
                    Order # {selectedItem.transactionNumber}
                  </Text>
                  <Text style={[styles.orderStatusLabel, Body3]}>{selectedItem.status}</Text>
                </View>

                <View style={styles.tableHeader}>
                  <Text style={[styles.colQT, styles.headerText, Body3]}>QT</Text>
                  <Text style={[styles.colItem, styles.headerText, Body3]}>Items</Text>
                  <Text style={[styles.colSKU, styles.headerText, Body3, { textAlign: 'center' }]}>
                    SKU
                  </Text>
                  <Text style={[styles.colPrice, styles.headerText, Body3]}>Price</Text>
                </View>

                <ScrollView showsVerticalScrollIndicator={false}>
                  {processedOrderItems.map((row, idx) => (
                    <View key={idx} style={styles.tableRow}>
                      <Text style={[styles.colQT, styles.tableRowText, Body3]}>{row.quantity}</Text>
                      <Text style={[styles.colItem, styles.tableRowText, Body3]}>
                        {row.product_name}
                      </Text>
                      <Text
                        style={[styles.colSKU, styles.tableRowText, Body3, { textAlign: 'center' }]}
                      >
                        {row.sku_code || 'N/A'}
                      </Text>
                      <Text style={[styles.colPrice, styles.tableRowPrice, Body3]}>
                        $ {row.price}
                      </Text>
                    </View>
                  ))}

                  <View style={styles.subtotalContainer}>
                    <Text style={[styles.subtotalLabel, Subtitle2]}>Subtotal:</Text>
                    <Text style={[styles.subtotalAmount, Subtitle2]}>
                      $ {selectedItem.transAmntEx}
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
  );
};

export default TransactionReportScreen;
