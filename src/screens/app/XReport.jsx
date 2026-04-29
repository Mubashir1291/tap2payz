import React, { useState, useMemo, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { View, Text, TouchableOpacity, ScrollView, TextInput, Image } from 'react-native';
import { Subtitle2, Body3, Caption, H2 } from '../../utils/fonts';
import { IconSize12 } from '../../utils/IconSizes';
import { SearchIcon, LeftArrowIcon, RightArrowIcon, ExportIcon } from '../../assets/Images';
import styles from './XReportStyles';
import SalesRefundDetailModal from '../../components/SalesRefundDetailModal';
import DurationModal from '../../components/DurationModal';
import { Colors } from '../../utils/Colors';
import { ActivityIndicator } from 'react-native';
import { GET_X_REPORT } from '../../services/Sales&Analytics';

const XReport = ({ isActive }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showDurationModal, setShowDurationModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [hasSelectedDuration, setHasSelectedDuration] = useState(false);
  const [reportData, setReportData] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [currentParams, setCurrentParams] = useState(null);

  const { store_name } = useSelector(state => state.user);

  // When the tab becomes active, show the duration modal if not selected yet
  useEffect(() => {
    if (isActive) {
      if (!hasSelectedDuration) {
        setShowDurationModal(true);
      }
    } else {
      // Reset state when navigating away so it prompts again next time
      setHasSelectedDuration(false);
      setShowDurationModal(false);
    }
  }, [isActive, hasSelectedDuration]);

  const filteredData = useMemo(() => {
    let data = [...reportData];
    if (searchQuery.trim() !== '') {
      data = data.filter(
        item =>
          item.transactionNumber.includes(searchQuery) ||
          item.buyer_info?.name?.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    }
    return data;
  }, [searchQuery, reportData]);

  const formatSerialNumber = serial => {
    if (!serial) return 'N/A';
    return serial.length > 6 ? serial.slice(-6) : serial;
  };

  const handleViewDetail = item => {
    // Mapping API response to the format expected by SalesRefundDetailModal
    const detailObj = {
      serialNumber: formatSerialNumber(item.serialNumber),
      transactionNumber: item.transactionNumber,
      customer: item.buyer_info?.name || 'Walk-in',
      totalItems: item.totalItems,
      dateTime: new Date(item.date).toLocaleString('en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      }),
      totalSales: item.totalSales.toFixed(2),
      items: (item.products || []).map(p => ({
        name: p.product_name || 'Unknown',
        sku: p.sku_code || 'N/A',
        qty: p.quantity || 0,
      })),
      storeName: store_name || 'N/A',
    };
    setSelectedTransaction({ ...item, details: detailObj });
    setShowDetailModal(true);
  };

  const handleDurationProceed = (response, params) => {
    setReportData(response?.data?.items || []);
    setPagination(response?.data || null);
    setCurrentParams(params);
    setHasSelectedDuration(true);
    setShowDurationModal(false);
  };

  const handlePageChange = async newPage => {
    if (!currentParams || isLoading) return;
    if (newPage < 1 || (pagination && newPage > pagination.lastPage)) return;

    try {
      setIsLoading(true);
      const response = await GET_X_REPORT({
        ...currentParams,
        page: newPage,
      });
      if (response?.data) {
        setReportData(response.data.items || []);
        setPagination(response.data);
      }
    } catch (error) {
      console.error('Error fetching page:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDurationClose = () => {
    setShowDurationModal(false);
    // Note: If they close without proceeding, we could show an empty state or just show the table anyway.
    // For now, let's just show the table to avoid blocking the user entirely.
    setHasSelectedDuration(true);
  };

  if (!hasSelectedDuration) {
    return (
      <DurationModal
        visible={showDurationModal}
        onClose={handleDurationClose}
        onProceed={handleDurationProceed}
      />
    );
  }

  return (
    <View style={styles.root}>
      {/* Header Row */}
      <View style={styles.headerRow}>
        <Text style={[styles.headerTitle, H2]}>X - Reports</Text>
        <View style={styles.headerActions}>
          <View style={styles.searchBar}>
            <Image source={SearchIcon} style={IconSize12} />
            <TextInput
              style={[styles.searchInput, Body3]}
              placeholder="Search"
              placeholderTextColor="#3B4B8A"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>

          <TouchableOpacity style={styles.exportBtn}>
            <Image source={ExportIcon} style={[IconSize12, styles.exportIconTint]} />
            <Text style={[styles.exportBtnText, Caption]}>Export</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Table Container */}
      <View style={styles.tableContainer}>
        {/* Table Header */}
        <View style={styles.tableHeader}>
          <Text style={[styles.colSerial, styles.headerText, Subtitle2]}>Serial Number</Text>
          <Text style={[styles.colTransaction, styles.headerText, Subtitle2]}>
            Transaction Number
          </Text>
          <Text style={[styles.colCustomer, styles.headerText, Subtitle2]}>Customer</Text>
          <Text style={[styles.colItems, styles.headerText, Subtitle2]}>Total Items</Text>
          <Text style={[styles.colType, styles.headerText, Subtitle2]}>Transaction Type</Text>
          <Text style={[styles.colDate, styles.headerText, Subtitle2]}>by Date & Time</Text>
          <Text style={[styles.colSales, styles.headerText, Subtitle2]}>Total Sales</Text>
          <View style={styles.colAction}>
            <Text style={[styles.headerText, Subtitle2]}>Actions</Text>
          </View>
        </View>

        {/* Table Content */}
        <ScrollView showsVerticalScrollIndicator={false}>
          {isLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={Colors.primary} />
            </View>
          ) : filteredData.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={[Subtitle2, styles.emptyText]}>
                No transactions found for the selected duration.
              </Text>
            </View>
          ) : (
            filteredData.map((item, index) => (
              <View key={index} style={styles.tableRow}>
                <Text style={[styles.colSerial, styles.rowText, Body3]}>
                  {formatSerialNumber(item.serialNumber)}
                </Text>
                <Text style={[styles.colTransaction, styles.rowText, Body3]}>
                  {item.transactionNumber}
                </Text>
                <Text style={[styles.colCustomer, styles.rowText, Body3]}>
                  {item.buyer_info?.name || 'Walk-in'}
                </Text>
                <Text style={[styles.colItems, styles.rowText, Body3]}>
                  {item.totalItems} Items
                </Text>
                <Text style={[styles.colType, styles.rowText, Body3]}>
                  {item.transactionType?.charAt(0) + item.transactionType?.slice(1).toLowerCase()}
                </Text>
                <Text style={[styles.colDate, styles.rowText, Body3]}>
                  {new Date(item.date)
                    .toLocaleString('en-GB', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                      hour12: true,
                    })
                    .replace(',', '\n')}
                </Text>
                <Text style={[styles.colSales, styles.rowText, Body3]}>
                  $ {item.totalSales.toFixed(2)}
                </Text>

                <View style={styles.colAction}>
                  <TouchableOpacity style={styles.viewBtn} onPress={() => handleViewDetail(item)}>
                    <Text style={[styles.viewBtnText, Caption]}>View Detail</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))
          )}
        </ScrollView>
      </View>

      {/* Pagination Footer */}
      <View style={styles.paginationRow}>
        <TouchableOpacity
          style={[styles.pageBtn, (pagination?.currentPage || 1) <= 1 && { opacity: 0.5 }]}
          disabled={(pagination?.currentPage || 1) <= 1 || isLoading}
          onPress={() => handlePageChange((pagination?.currentPage || 1) - 1)}
        >
          <Image source={LeftArrowIcon} style={styles.actionIcon} />
        </TouchableOpacity>
        <Text style={[styles.pageText, Body3]}>
          {String(pagination?.currentPage || 1).padStart(2, '0')}
        </Text>
        <TouchableOpacity
          style={[
            styles.pageBtn,
            (pagination?.currentPage || 1) >= (pagination?.lastPage || 1) && { opacity: 0.5 },
          ]}
          disabled={(pagination?.currentPage || 1) >= (pagination?.lastPage || 1) || isLoading}
          onPress={() => handlePageChange((pagination?.currentPage || 1) + 1)}
        >
          <Image source={RightArrowIcon} style={styles.actionIcon} />
        </TouchableOpacity>
        <Text style={[styles.pageText, Body3]}>
          out of {String(pagination?.lastPage || 1).padStart(2, '0')}
        </Text>
      </View>

      {/* Detail Modal */}
      <SalesRefundDetailModal
        visible={showDetailModal}
        type={selectedTransaction?.type?.toLowerCase() === 'refund' ? 'refund' : 'sale'}
        transaction={selectedTransaction?.details}
        onClose={() => setShowDetailModal(false)}
      />
    </View>
  );
};

export default XReport;
