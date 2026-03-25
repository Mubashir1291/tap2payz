import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  TextInput,
  FlatList,
  StatusBar,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SearchIcon, LeftArrowIcon } from '../../assets/Images';
import { Colors } from '../../utils/Colors';
import { S, VS, MS } from '../../utils/Responsive';
import { H1, Subtitle2, Body3, Caption } from '../../utils/fonts';
import { IconSize12, IconSize16, IconSize24 } from '../../utils/IconSizes';
import styles from './ViewOrdersScreenStyles';
import ViewInvoiceModal from '../../components/ViewInvoiceModal';

// Dummy data based on the screenshot
const dummyOrders = Array.from({ length: 15 }, (_, i) => ({
  id: `559${4 + i}`,
  table: (i + 1).toString().padStart(2, '0'),
  waiter: 'Joe Smith',
  handleBy: 'Joe Smith',
  date: '30 Apr 2024, 04:06 PM',
  total: '$ 12,000',
  subTotal: '$ 12,000',
}));

const ViewOrdersScreen = () => {
  const navigation = useNavigation();
  const [activeTab, setActiveTab] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const handleOpenInvoice = (orderNumber) => {
    setSelectedOrder(orderNumber);
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
      <View style={styles.colWaiter}>
        <Text style={[styles.rowText, Body3]}>{item.waiter}</Text>
      </View>
      <View style={styles.colHandleBy}>
        <Text style={[styles.rowText, Body3]}>{item.handleBy}</Text>
      </View>
      <View style={styles.colDate}>
        <Text style={[styles.rowText, Body3]}>{item.date}</Text>
      </View>
      <View style={styles.colTotal}>
        <Text style={[styles.rowText, Body3]}>{item.total}</Text>
      </View>
      <View style={styles.colSubTotal}>
        <Text style={[styles.rowText, Body3]}>{item.subTotal}</Text>
      </View>
      <View style={styles.colActions}>
        <TouchableOpacity 
          style={styles.viewInvoiceBtn}
          onPress={() => handleOpenInvoice(item.id)}
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
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Image source={LeftArrowIcon} style={[IconSize24, styles.backIcon]} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, H1]}>View Orders</Text>
        </View>

        <View style={styles.headerActions}>
          <View style={styles.searchBar}>
            <Image source={SearchIcon} style={[IconSize12, { tintColor: '#666' }]} />
            <TextInput
              style={[styles.searchInput, Body3]}
              placeholder="Search Orders"
              placeholderTextColor="#666"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>

          <View style={styles.tabsContainer}>
            {['All', 'Completed', 'In Processing'].map((tab) => (
              <TouchableOpacity
                key={tab}
                style={[
                  styles.tabBtn,
                  activeTab === tab && styles.activeTabBtn,
                ]}
                onPress={() => setActiveTab(tab)}
              >
                <Text
                  style={[
                    Subtitle2,
                    activeTab === tab ? styles.activeTabText : styles.tabText,
                  ]}
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
          <View style={styles.colWaiter}>
            <Text style={[styles.headerText, Subtitle2]}>Waiter</Text>
          </View>
          <View style={styles.colHandleBy}>
            <Text style={[styles.headerText, Subtitle2]}>Order Handle By</Text>
          </View>
          <View style={styles.colDate}>
            <Text style={[styles.headerText, Subtitle2]}>Date</Text>
          </View>
          <View style={styles.colTotal}>
            <Text style={[styles.headerText, Subtitle2]}>Total</Text>
          </View>
          <View style={styles.colSubTotal}>
            <Text style={[styles.headerText, Subtitle2]}>Sub Total</Text>
          </View>
          <View style={styles.colActions}>
            <Text style={[styles.headerText, Subtitle2]}>Actions</Text>
          </View>
        </View>

        {/* Table List */}
        <FlatList
          data={dummyOrders}
          keyExtractor={(item) => item.id}
          renderItem={renderOrderRow}
          showsVerticalScrollIndicator={false}
          ListFooterComponent={
            <View style={styles.paginationRow}>
              <TouchableOpacity style={styles.pageBtn}>
                <Image source={LeftArrowIcon} style={[IconSize12, styles.pageIcon]} />
              </TouchableOpacity>
              <Text style={[styles.pageText, Body3]}>01</Text>
              <TouchableOpacity style={styles.pageBtn}>
                {/* Reusing LeftArrowIcon and rotating it by 180 deg in style if needed, or simply using text. Wait, we have RightArrowIcon exported. We can import it. */}
                <Image source={LeftArrowIcon} style={[IconSize12, styles.pageIcon, { transform: [{ rotate: '180deg' }] }]} />
              </TouchableOpacity>
              <Text style={[styles.pageText, Body3]}>out of 20</Text>
            </View>
          }
        />
      </View>

      <ViewInvoiceModal 
        visible={modalVisible} 
        onClose={() => setModalVisible(false)} 
        orderNumber={selectedOrder}
      />
    </View>
  );
};

export default ViewOrdersScreen;
