import React, { useState, useMemo } from 'react';
import { View, Text, TouchableOpacity, ScrollView, TextInput, Image } from 'react-native';
import { Subtitle2, Body3, Caption, H2 } from '../../utils/fonts';
import { IconSize12 } from '../../utils/IconSizes';
import { SearchIcon, LeftArrowIcon, RightArrowIcon, ExportIcon } from '../../assets/Images';
import styles from './ZReportStyles';
import ZReportDetailModal from '../../components/ZReportDetailModal';

const dummyData = Array.from({ length: 10 }).map((_, index) => ({
  id: index.toString(),
  openedAt: 'Mon 05-06-24\n01:19 PM',
  closedAt: 'Mon 05-06-24\n01:19 PM',
  opener: 'admin@payblisss.com',
  closer: 'admin@payblisss.com',
  openAmount: '$ 12,000',
  closeAmount: '$ 12,000',
}));

const ZReport = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);

  const filteredData = useMemo(() => {
    let data = [...dummyData];
    if (searchQuery.trim() !== '') {
      data = data.filter(
        item =>
          item.opener.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.closer.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    }
    return data;
  }, [searchQuery]);

  const handleView = report => {
    setSelectedReport(report);
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
          {filteredData.map((item, index) => (
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
      <ZReportDetailModal
        visible={showDetailModal}
        onClose={() => setShowDetailModal(false)}
        reportData={selectedReport}
      />
    </View>
  );
};

export default ZReport;
