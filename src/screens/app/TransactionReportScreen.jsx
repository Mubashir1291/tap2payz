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
import { Subtitle2, Body3, Caption, H2, Overline } from '../../utils/fonts';
import { IconSize12 } from '../../utils/IconSizes';
import {
  SearchIcon,
  RightArrowIcon,
  CardpaymentIcon,
  CashIcon,
  FilterIcon,
  ExportIcon,
} from '../../assets/Images';
import styles from './TransactionReportScreenStyles';
import SortModal, { applySort } from '../../components/SortModal';
import { useSelector } from 'react-redux';
import { GET_ALL_TRANSACTION } from '../../services/Reports';
import useDebounce from '../../utils/useDebounce';

import { useNavigation } from '@react-navigation/native';

const TransactionReportScreen = ({ hideDrawerMenu = false }) => {
  const navigation = useNavigation();
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
    deviceId,
    transType: '',
  });
  const [transactions, setTransactions] = useState([]);
  const [transactionsData, setTransactionsData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [detailLoading, setDetailLoading] = useState(false);
  const [detailError, _setDetailError] = useState(null);
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
        if (items.length > 0) {
          setSelectedItem(items[0]);
        }
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

  const isLoadMore = transactionSearchQuery.page > 1;

  useEffect(() => {
    handleFetchAllTransactions(transactionSearchQuery, isLoadMore);
  }, [transactionSearchQuery, isLoadMore]);

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
      deviceId,
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
    if (!selectedItem?.products) {
      return [];
    }

    return applySort(selectedItem.products, currentFilter, item => item.product_name);
  }, [selectedItem, currentFilter]);

  return (
    <View style={styles.root}>
      {/* Header Row */}
      <View style={styles.headerRow}>
        {!hideDrawerMenu && (
          <TouchableOpacity style={styles.hamburgerBtn} onPress={() => navigation.openDrawer()}>
            <View style={styles.hamburgerLine} />
            <View style={[styles.hamburgerLine, styles.hamburgerLineShort]} />
            <View style={styles.hamburgerLine} />
          </TouchableOpacity>
        )}
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
            <View style={styles.centerContainer}>
              <ActivityIndicator size="large" color="#3B4B8A" />
            </View>
          ) : processedData.length === 0 ? (
            <View style={styles.centerContainer}>
              <Text style={[Subtitle2, styles.emptyText]}>No transactions found</Text>
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
                  <View style={[styles.colStatus, styles.statusWrapper]}>
                    <Text
                      style={[
                        Overline,
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
                  <View style={styles.footerLoader}>
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
            <View style={styles.centerContainer}>
              <ActivityIndicator size="large" color="#3B4B8A" />
              <Text style={[Body3, styles.loadingText]}>Loading details...</Text>
            </View>
          ) : detailError ? (
            <View style={styles.centerContainer}>
              <Text style={[Subtitle2, styles.errorText]}>{detailError}</Text>
            </View>
          ) : selectedItem ? (
            <View style={styles.flexFull}>
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
                  <Text style={[styles.colSKU, styles.headerText, Body3, styles.centerTextAlign]}>
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
                        style={[styles.colSKU, styles.tableRowText, Body3, styles.centerTextAlign]}
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
            <View style={styles.centerContainer}>
              <Text style={[Subtitle2, styles.emptyText]}>No details available</Text>
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
