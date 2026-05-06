import React, { useEffect, useState, useCallback, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  TextInput,
  FlatList,
  StatusBar,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SearchIcon, LeftArrowIcon, RightArrowIcon } from '../../assets/Images';
import { H1, Subtitle2, Body3 } from '../../utils/fonts';
import { IconSize12, IconSize24 } from '../../utils/IconSizes';
import styles from './ViewOrdersScreenStyles';
import ViewInvoiceModal from '../../components/ViewInvoiceModal';
import { GET_RES_ORDERS } from '../../services/Restaurant/Order/Order';
import { useSelector } from 'react-redux';
import { Colors } from '../../utils/Colors';

const ViewOrdersScreen = () => {
  const navigation = useNavigation();
  const [activeTab, setActiveTab] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [paginationData, setPaginationData] = useState(null);
  const [page, setPage] = useState(1);
  const { store_id } = useSelector(state => state.user);

  const isFirstRender = useRef(true);

  const handleGetResOrders = useCallback(
    async (pageNumber = 1) => {
      if (!store_id) {
        return;
      }

      const statusMap = {
        All: '',
        Completed: 'Completed',
        'In Processing': 'Processing',
      };

      const payload = {
        page: pageNumber,
        itemsPerPage: 10,
        store_id,
        status: statusMap[activeTab],
        // type: 'DineIn',
        // sort: 'desc',
      };

      setIsLoading(true);
      try {
        const response = await GET_RES_ORDERS(payload);
        // console.log(response, "=====================================")

        const mappedOrders = (response?.items || []).map(item => ({
          id: item.order_number || item.order_id || item._id?.toString().slice(-6).toUpperCase() || 'N/A',
          table: item.table_id?.table_no || 'N/A',
          productsSummary: (item.products || [])
            .map(p => p.product_id?.product_name || p.product_name || 'Unknown')
            .join(', '),
          handleBy: item?.transactions[0]?.empID?.employee_name || 'N/A',
          date: new Date(item.updated_at).toLocaleString('en-GB', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true,
          }),
          total: `$ ${item.total_price?.toFixed(2) || '0.00'}`,
          // subTotal: `$ ${item.subtotal?.toFixed(2) || '0.00'}`,
          rawOrder: item,
        }));
        setOrders(mappedOrders);
        setPaginationData(response);
        setPage(pageNumber);
      } catch (error) {
        console.error('Error fetching orders:', error);
      } finally {
        setIsLoading(false);
      }
    },
    [store_id, activeTab],
  );

  useEffect(() => {
    handleGetResOrders(1);
  }, [handleGetResOrders]);

  // Optional: Reset page when tab changes
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    setPage(1);
  }, [activeTab]);

  const handleOpenInvoice = orderData => {
    setSelectedOrder(orderData);
    setModalVisible(true);
  };

  const renderOrderRow = ({ item }) => (
    <View style={styles.tableRow}>
      <View style={styles.colId}>
        <Text style={[styles.rowText, Body3]}>{item.id}</Text>
      </View>
      <View style={styles.colTable}>
        <Text style={[styles.rowText, Body3]}>{item.table}</Text>
      </View>
      {/* <View style={styles.colWaiter}>
        <Text style={[styles.rowText, Body3]} numberOfLines={1}>
          {item.productsSummary || 'No Items'}
        </Text>
      </View> */}
      <View style={styles.colHandleBy}>
        <Text style={[styles.rowText, Body3]}>{item.handleBy}</Text>
      </View>
      <View style={styles.colDate}>
        <Text style={[styles.rowText, Body3]}>{item.date}</Text>
      </View>
      <View style={styles.colTotal}>
        <Text style={[styles.rowTextRight, Body3]}>{item.total}</Text>
      </View>
      {/* <View style={styles.colSubTotal}>
        <Text style={[styles.rowText, Body3]}>{item.subTotal}</Text>
      </View> */}
      <View style={styles.colActions}>
        <TouchableOpacity
          style={styles.viewInvoiceBtn}
          onPress={() => handleOpenInvoice(item.rawOrder)}
        >
          <Text style={styles.viewInvoiceText}>View Invoice</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.root}>
      <StatusBar backgroundColor="#C6CDEF" barStyle="dark-content" />

      {/* ─── Header ─── */}
      <View style={styles.headerRow}>
        <View style={styles.headerLeft}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Image source={LeftArrowIcon} style={[IconSize24, styles.backIcon]} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, H1]}>View Orders</Text>
        </View>

        <View style={styles.headerActions}>
          <View style={styles.searchBar}>
            <Image source={SearchIcon} style={[IconSize12, styles.searchIconTint]} />
            <TextInput
              style={[styles.searchInput, Body3]}
              placeholder="Search Orders"
              placeholderTextColor="#666"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>

          <View style={styles.tabsContainer}>
            {['All', 'Completed', 'In Processing'].map(tab => (
              <TouchableOpacity
                key={tab}
                style={[styles.tabBtn, activeTab === tab && styles.activeTabBtn]}
                onPress={() => setActiveTab(tab)}
              >
                <Text
                  style={[Subtitle2, activeTab === tab ? styles.activeTabText : styles.tabText]}
                >
                  {tab}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>

      {/* ─── Table Container ─── */}
      <View style={styles.tableContainer}>
        {/* Table Header */}
        <View style={styles.tableHeader}>
          <View style={styles.colId}>
            <Text style={[styles.headerText, Subtitle2]}>ID</Text>
          </View>
          <View style={styles.colTable}>
            <Text style={[styles.headerText, Subtitle2]}>Table</Text>
          </View>
          {/* <View style={styles.colWaiter}>
            <Text style={[styles.headerText, Subtitle2]}>Products</Text>
          </View> */}
          <View style={styles.colHandleBy}>
            <Text style={[styles.headerText, Subtitle2]}>Order Handle By</Text>
          </View>
          <View style={styles.colDate}>
            <Text style={[styles.headerText, Subtitle2]}>Date</Text>
          </View>
          <View style={styles.colTotal}>
            <Text style={[styles.headerTextRight, Subtitle2]}>Total</Text>
          </View>
          {/* <View style={styles.colSubTotal}>
            <Text style={[styles.headerText, Subtitle2]}>Sub Total</Text>
          </View> */}
          <View style={styles.colActions}>
            <Text style={[styles.headerText, Subtitle2]}>Actions</Text>
          </View>
        </View>

        {/* Table List */}
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={Colors.primary} />
          </View>
        ) : (
          <FlatList
            data={orders}
            keyExtractor={item => item.id}
            renderItem={renderOrderRow}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Text style={[Subtitle2, styles.emptyText]}>No orders found.</Text>
              </View>
            }
            ListFooterComponent={
              <View style={styles.paginationRow}>
                <TouchableOpacity
                  style={[styles.pageBtn, page <= 1 && styles.disabledPageBtn]}
                  onPress={() => handleGetResOrders(page - 1)}
                  disabled={page <= 1}
                >
                  <Image
                    source={LeftArrowIcon}
                    style={[IconSize12, styles.pageIcon]}
                    resizeMode="contain"
                  />
                </TouchableOpacity>
                <Text style={[styles.pageText, Body3]}>{String(page).padStart(2, '0')}</Text>
                <TouchableOpacity
                  style={[styles.pageBtn, !paginationData?.hasNextPage && styles.nextPageBtn]}
                  onPress={() => handleGetResOrders(page + 1)}
                  disabled={!paginationData?.hasNextPage}
                >
                  <Image
                    source={RightArrowIcon}
                    style={[IconSize12, styles.pageIcon]}
                    resizeMode="contain"
                  />
                </TouchableOpacity>
                <Text style={[styles.pageText, Body3]}>
                  out of {String(paginationData?.lastPage || 1).padStart(2, '0')}
                </Text>
              </View>
            }
          />
        )}
      </View>

      <ViewInvoiceModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        orderData={selectedOrder}
      />
    </View>
  );
};

export default ViewOrdersScreen;
