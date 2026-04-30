import React, { useState, useMemo, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Image,
  ActivityIndicator,
} from 'react-native';
import { Subtitle2, Body3, Caption, H2 } from '../../utils/fonts';
import { IconSize12 } from '../../utils/IconSizes';
import { SearchIcon, LeftArrowIcon, RightArrowIcon, ExportIcon } from '../../assets/Images';
import styles from './ZReportStyles';
import ZReportDetailModal from '../../components/ZReportDetailModal';
import { GET_ALL_CASH_REGISTER } from '../../services/StoreService';
import { Colors } from '../../utils/Colors';
import { useSelector } from 'react-redux';


const ZReport = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);
  const [apiData, setApiData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const { store_id, userData, store_name } = useSelector(state => state.user);
  const { deviceId } = useSelector(state => state.device);

  const handleGetAllCashRegister = useCallback(async () => {
    setIsLoading(true);
    try {
      const payload = {
        store_id,
        device_id: deviceId,
        employee_id: userData?._id,
      };
      const response = await GET_ALL_CASH_REGISTER(payload);

      if (response && response.cashRegisters) {
        const transformedData = response.cashRegisters.map(item => ({
          id: item._id,
          openedAt: item.opening_amount?.opening_date
            ? new Date(item.opening_amount.opening_date)
                .toLocaleString('en-GB', {
                  day: '2-digit',
                  month: '2-digit',
                  year: '2-digit',
                  hour: '2-digit',
                  minute: '2-digit',
                  hour12: true,
                })
                .replace(',', '\n')
            : 'N/A',
          closedAt: item.is_close
            ? new Date(item.updated_at)
                .toLocaleString('en-GB', {
                  day: '2-digit',
                  month: '2-digit',
                  year: '2-digit',
                  hour: '2-digit',
                  minute: '2-digit',
                  hour12: true,
                })
                .replace(',', '\n')
            : 'Open',
          opener:
            item.opening_amount?.employee?.employee_email ||
            item.opening_amount?.employee?.employee_name ||
            'N/A',
          closer: item.is_close ? item.cash_out?.employee?.employee_email || 'N/A' : '________',
          openAmount: `$ ${item.opening_amount?.amount?.toLocaleString() || '0.00'}`,
          closeAmount: item.is_close
            ? `$ ${item.closing_amount?.amount?.toLocaleString() || '0.00'}`
            : '________',
          details: item,
        }));
        setApiData(transformedData);
      }
    } catch (error) {
      console.log('Error fetching cash registers:', error);
    } finally {
      setIsLoading(false);
    }
  }, [store_id, deviceId, userData?._id]);

  useEffect(() => {
    handleGetAllCashRegister();
  }, [handleGetAllCashRegister]);

  const filteredData = useMemo(() => {
    let data = apiData;
    if (searchQuery.trim() !== '') {
      data = data.filter(
        item =>
          item.opener.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.closer.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    }
    return data;
  }, [searchQuery, apiData]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredData.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredData, currentPage]);

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(prev => prev - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(prev => prev + 1);
    }
  };

  const handleView = report => {
    setSelectedReport({
      ...report,
      details: {
        ...report.details,
        store: {
          ...report.details?.store,
          name: report.details?.store?.name || store_name,
        },
      },
    });
    setShowDetailModal(true);
  };

  return (
    <View style={styles.root}>
      {/* Header Row */}
      <View style={styles.headerRow}>
        <Text style={[styles.headerTitle, H2]}>Z - Reports</Text>
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
          <Text style={[styles.colOpenedAt, styles.headerText, Subtitle2]}>Opened at</Text>
          <Text style={[styles.colClosedAt, styles.headerText, Subtitle2]}>Closed at</Text>
          <Text style={[styles.colEmployees, styles.headerText, Subtitle2]}>Employees</Text>
          <View style={styles.colOpenAmount}>
            <Text style={[styles.headerText, Subtitle2]}>Open Amount</Text>
          </View>
          <View style={styles.colCloseAmount}>
            <Text style={[styles.headerText, Subtitle2]}>Close Amount</Text>
          </View>
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
          ) : (
            paginatedData.map((item, index) => (
              <View key={index} style={styles.tableRow}>
                <Text style={[styles.colOpenedAt, styles.rowText, Body3]}>{item.openedAt}</Text>
                <Text style={[styles.colClosedAt, styles.rowText, Body3]}>{item.closedAt}</Text>

                <View style={[styles.colEmployees, styles.employeeTextContainer]}>
                  <Text style={[styles.rowText, Body3]}>Opener: {item.opener}</Text>
                  <Text style={[styles.rowText, Body3]}>Closer: {item.closer}</Text>
                </View>

                <View style={styles.colOpenAmount}>
                  <Text style={[styles.rowText, Body3]}>{item.openAmount}</Text>
                </View>
                <View style={styles.colCloseAmount}>
                  <Text style={[styles.rowText, Body3]}>{item.closeAmount}</Text>
                </View>

                <View style={styles.colAction}>
                  <TouchableOpacity style={styles.viewBtn} onPress={() => handleView(item)}>
                    <Text style={[styles.viewBtnText, Caption]}>View</Text>
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
          style={[styles.pageBtn, currentPage === 1 && { opacity: 0.5 }]}
          onPress={handlePrevPage}
          disabled={currentPage === 1}
        >
          <Image source={LeftArrowIcon} style={styles.actionIcon} />
        </TouchableOpacity>
        <Text style={[styles.pageText, Body3]}>{currentPage.toString().padStart(2, '0')}</Text>
        <TouchableOpacity
          style={[
            styles.pageBtn,
            (currentPage === totalPages || totalPages === 0) && { opacity: 0.5 },
          ]}
          onPress={handleNextPage}
          disabled={currentPage === totalPages || totalPages === 0}
        >
          <Image source={RightArrowIcon} style={styles.actionIcon} />
        </TouchableOpacity>
        <Text style={[styles.pageText, Body3]}>out of {totalPages || 1}</Text>
      </View>

      {/* Detail Modal */}
      <ZReportDetailModal
        visible={showDetailModal}
        onClose={() => setShowDetailModal(false)}
        reportData={selectedReport}
      />
    </View>
  );
};

export default ZReport;
