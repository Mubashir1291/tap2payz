import React, { useState, useMemo, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, TextInput, Image } from 'react-native';
import { Colors } from '../../utils/Colors';
import { S, VS, MS } from '../../utils/Responsive';
import { Subtitle2, Body3, Caption, H2 } from '../../utils/fonts';
import { IconSize12 } from '../../utils/IconSizes';
import { SearchIcon, LeftArrowIcon, RightArrowIcon, ExportIcon } from '../../assets/Images';
import styles from './XReportStyles';
import SalesRefundDetailModal from '../../components/SalesRefundDetailModal';
import DurationModal from '../../components/DurationModal';

const dummyData = [
  {
    id: '1',
    serialNumber: '213542',
    transactionNumber: '2135424624',
    customer: 'Michel Gerdes',
    totalItems: '10 Items',
    type: 'Sale',
    dateTime: '1st Dec, 2023\n5:00 PM',
    totalSales: '€5,956.00',
    details: {
      serialNumber: '213542',
      transactionNumber: '2135424624',
      customer: 'Michel Gerdes',
      totalItems: 10,
      dateTime: '1st Dec, 2023 (5:00 PM)',
      totalSales: '5,956.00',
      items: [
        { name: 'Denis T-Shirt', sku: '2152462', qty: 6 },
        { name: 'Pure Milk', sku: '2152463', qty: 2 },
        { name: 'Coca Cola', sku: '2152464', qty: 2 },
      ],
    },
  },
  {
    id: '2',
    serialNumber: '213543',
    transactionNumber: '2135424625',
    customer: 'John Smith',
    totalItems: '5 Items',
    type: 'Sale',
    dateTime: '2nd Dec, 2023\n3:30 PM',
    totalSales: '€320.00',
    details: {
      serialNumber: '213543',
      transactionNumber: '2135424625',
      customer: 'John Smith',
      totalItems: 5,
      dateTime: '2nd Dec, 2023 (3:30 PM)',
      totalSales: '320.00',
      items: [
        { name: 'Pizza', sku: '3152462', qty: 2 },
        { name: 'Burger', sku: '3152463', qty: 2 },
        { name: 'Pepsi', sku: '3152464', qty: 1 },
      ],
    },
  },
  {
    id: '3',
    serialNumber: '213544',
    transactionNumber: '2135424626',
    customer: '________',
    totalItems: '3 Items',
    type: 'Refund',
    dateTime: '3rd Dec, 2023\n1:15 PM',
    totalSales: '€120.00',
    details: {
      serialNumber: '213544',
      transactionNumber: '2135424626',
      customer: 'Michel Gerdes',
      totalItems: 3,
      dateTime: '3rd Dec, 2023 (1:15 PM)',
      totalSales: '120.00',
      items: [
        { name: 'Coca Cola', sku: '4152462', qty: 1 },
        { name: 'Denis T-Shirt', sku: '4152463', qty: 2 },
      ],
    },
  },
  {
    id: '4',
    serialNumber: '213545',
    transactionNumber: '2135424627',
    customer: 'Emma Watson',
    totalItems: '7 Items',
    type: 'Sale',
    dateTime: '4th Dec, 2023\n6:45 PM',
    totalSales: '€780.00',
    details: {
      serialNumber: '213545',
      transactionNumber: '2135424627',
      customer: 'Emma Watson',
      totalItems: 7,
      dateTime: '4th Dec, 2023 (6:45 PM)',
      totalSales: '780.00',
      items: [
        { name: 'Burger', sku: '5152462', qty: 3 },
        { name: 'Fries', sku: '5152463', qty: 2 },
        { name: 'Pepsi', sku: '5152464', qty: 2 },
      ],
    },
  },
];

const XReport = ({ isActive }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showDurationModal, setShowDurationModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [hasSelectedDuration, setHasSelectedDuration] = useState(false);

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
  }, [isActive]);

  const filteredData = useMemo(() => {
    let data = [...dummyData];
    if (searchQuery.trim() !== '') {
      data = data.filter(item => 
        item.transactionNumber.includes(searchQuery) || 
        item.customer.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    return data;
  }, [searchQuery]);

  const handleViewDetail = (item) => {
    setSelectedTransaction(item);
    setShowDetailModal(true);
  };

  const handleDurationProceed = () => {
    setShowDurationModal(false);
    setHasSelectedDuration(true);
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
            <Image source={ExportIcon} style={[IconSize12, { tintColor: '#3B4B8A' }]} />
            <Text style={[styles.exportBtnText, Caption]}>Export</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Table Container */}
      <View style={styles.tableContainer}>
        {/* Table Header */}
        <View style={styles.tableHeader}>
          <Text style={[styles.colSerial, styles.headerText, Subtitle2]}>Serial Number</Text>
          <Text style={[styles.colTransaction, styles.headerText, Subtitle2]}>Transaction Number</Text>
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
          {filteredData.map((item, index) => (
            <View key={index} style={styles.tableRow}>
              <Text style={[styles.colSerial, styles.rowText, Body3]}>{item.serialNumber}</Text>
              <Text style={[styles.colTransaction, styles.rowText, Body3]}>{item.transactionNumber}</Text>
              <Text style={[styles.colCustomer, styles.rowText, Body3]}>{item.customer}</Text>
              <Text style={[styles.colItems, styles.rowText, Body3]}>{item.totalItems}</Text>
              <Text style={[styles.colType, styles.rowText, Body3]}>{item.type}</Text>
              <Text style={[styles.colDate, styles.rowText, Body3]}>{item.dateTime}</Text>
              <Text style={[styles.colSales, styles.rowText, Body3]}>{item.totalSales}</Text>
              
              <View style={styles.colAction}>
                <TouchableOpacity style={styles.viewBtn} onPress={() => handleViewDetail(item)}>
                  <Text style={[styles.viewBtnText, Caption]}>View Detail</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </ScrollView>
      </View>

      {/* Pagination Footer */}
      <View style={styles.paginationRow}>
        <TouchableOpacity style={styles.pageBtn}>
          <Image source={LeftArrowIcon} style={styles.actionIcon} />
        </TouchableOpacity>
        <Text style={[styles.pageText, Body3]}>01</Text>
        <TouchableOpacity style={styles.pageBtn}>
          <Image source={RightArrowIcon} style={styles.actionIcon} />
        </TouchableOpacity>
        <Text style={[styles.pageText, Body3]}>out of 20</Text>
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
