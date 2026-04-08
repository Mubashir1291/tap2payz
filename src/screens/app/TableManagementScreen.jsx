import React, { useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, FlatList, TextInput, Image, StatusBar } from 'react-native';
import { useSelector } from 'react-redux';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { Colors } from '../../utils/Colors';
import { H2, Subtitle2, Body2, Body3 } from '../../utils/fonts';
import { IconSize16, IconSize20 } from '../../utils/IconSizes';
import { MenuIcon, SearchIcon, EditCircleIcon, DeleteCircleIcon } from '../../assets/Images';
import styles from './TableManagementScreenStyles';
import DeleteTableModal from '../../components/DeleteTableModal';
import EditTableModal from '../../components/EditTableModal';
import SuccessModal from '../../components/SuccessModal';
import { DELETE_TABLE, GET_TABLES, UPDATE_TABLE } from '../../services/Restaurant/Tables/Table';

const TableManagementScreen = () => {
  const navigation = useNavigation();
  const { store_id } = useSelector(state => state.user);

  const [search, setSearch] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [selectedTable, setSelectedTable] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [tables, setTables] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [paginationData, setPaginationData] = useState(null);
  const [page, setPage] = useState(1);

  const handleDeletePress = table => {
    setSelectedTable(table);
    setShowDeleteModal(true);
  };

  const handleEditPress = table => {
    setSelectedTable(table);
    setShowEditModal(true);
  };

  const confirmDelete = async () => {
    try {
      const response = await DELETE_TABLE(selectedTable._id);
      console.log('Table deleted successfully:', response);
    } catch (error) {
      // TODO: Handle error more gracefully, e.g., show a Toast message
      console.log('Something Wrong', error);
    }
    setShowDeleteModal(false);
    setSuccessMessage('Table Deleted Successfully');
    setShowSuccessModal(true);
  };

  const confirmEdit = async updatedSeats => {
    try {
      const response = await UPDATE_TABLE(selectedTable._id, { seats: updatedSeats });
      console.log('Table updated successfully:', response);
    } catch (error) {
      // TODO: Handle error more gracefully, e.g., show a Toast message
      console.error('Error updating table:', error);
    }

    // Local UI update
    setTables(prev =>
      prev.map(t =>
        (t._id || t.id) === (selectedTable._id || selectedTable.id)
          ? { ...t, seats: updatedSeats }
          : t,
      ),
    );
    handleGetTables({ page: 1, itemsPerPage: 10 }); // Refetch tables after successful edit
    setShowEditModal(false);
    setSuccessMessage('Table Updated Successfully');
    setShowSuccessModal(true);
  };

  const renderItem = ({ item }) => (
    <View style={styles.tableRow}>
      <Text style={[styles.cell, Body2, styles.flexLarge]}>{item.floor_id?.name || 'N/A'}</Text>
      <Text style={[styles.cell, Body2, styles.flexCenterText]}>{item.table_no || 'N/A'}</Text>
      <Text style={[styles.cell, Body2, styles.flexCenterText]}>{item.seats} Seats</Text>
      <View style={[styles.cell, styles.actionCell, styles.flexEqual]}>
        <TouchableOpacity style={styles.actionBtn} onPress={() => handleEditPress(item)}>
          <Image source={EditCircleIcon} style={IconSize20} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionBtn} onPress={() => handleDeletePress(item)}>
          <Image source={DeleteCircleIcon} style={IconSize20} />
        </TouchableOpacity>
      </View>
    </View>
  );

  const handleGetTables = async query => {
    if (!store_id) return;
    setIsLoading(true);
    try {
      const response = await GET_TABLES({ ...query, storeId: store_id });
      console.log('Tables fetched successfully:', response);
      setTables(response?.items || []);
      setPaginationData(response);
    } catch (error) {
      console.error('Error fetching tables:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      handleGetTables({ page, itemsPerPage: 10 });
    }, [page, store_id]),
  );

  const handleNextPage = () => {
    if (paginationData?.hasNextPage) setPage(prev => prev + 1);
  };

  const handlePrevPage = () => {
    if (page > 1) setPage(prev => prev - 1);
  };

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={Colors.primary} barStyle="light-content" />

      {/* Top Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.openDrawer()}>
          <Image source={MenuIcon} style={[IconSize20, styles.whiteIconTint]} />
        </TouchableOpacity>
      </View>

      <View style={styles.contentContainer}>
        {/* Title and Controls */}
        <View style={styles.titleRow}>
          <Text style={[styles.title, H2]}>Table Management</Text>
          <View style={styles.controls}>
            <TouchableOpacity style={styles.areaDropdown}>
              <Text style={[styles.areaText, Subtitle2]}>1st Floor</Text>
              <Image source={MenuIcon} style={[IconSize16, styles.whiteIconTint]} />
            </TouchableOpacity>

            <View style={styles.searchContainer}>
              <Image source={SearchIcon} style={[IconSize16, styles.searchIcon]} />
              <TextInput
                style={[styles.searchInput, Body3]}
                placeholder="Search Tables"
                placeholderTextColor={Colors.white}
                value={search}
                onChangeText={setSearch}
              />
            </View>

            <TouchableOpacity
              style={styles.createBtn}
              onPress={() => navigation.navigate('AddNewTableScreen')}
            >
              <Text style={[styles.createBtnText, Subtitle2]}>Create Table +</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Table List Section */}
        <View style={styles.tableContainer}>
          {/* Table Header */}
          <View style={styles.tableHeader}>
            <Text style={[styles.headerCell, Subtitle2, styles.flexLarge]}>Table Area</Text>
            <Text style={[styles.headerCell, Subtitle2, styles.flexCenterText]}>Table no</Text>
            <Text style={[styles.headerCell, Subtitle2, styles.flexCenterText]}>Table Seats</Text>
            <Text style={[styles.headerCell, Subtitle2, styles.flexCenterText]}>Actions</Text>
          </View>

          <FlatList
            data={tables}
            renderItem={renderItem}
            keyExtractor={item => item._id || item.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContent}
            refreshing={isLoading}
            onRefresh={() => handleGetTables({ page, itemsPerPage: 10 })}
          />

          {/* Pagination */}
          <View style={styles.pagination}>
            <TouchableOpacity
              style={[styles.pageArrow, page === 1 && { opacity: 0.5 }]}
              disabled={page === 1}
              onPress={handlePrevPage}
            >
              <Text style={styles.arrowText}>{'<'}</Text>
            </TouchableOpacity>
            <Text style={[styles.pageText, Body2]}>{String(page).padStart(2, '0')}</Text>
            <TouchableOpacity
              style={[styles.pageArrow, !paginationData?.hasNextPage && { opacity: 0.5 }]}
              disabled={!paginationData?.hasNextPage}
              onPress={handleNextPage}
            >
              <Text style={styles.arrowText}>{'>'}</Text>
            </TouchableOpacity>
            <Text style={[styles.outOfText, Body3]}>
              out of {String(paginationData?.lastPage || 1).padStart(2, '0')}
            </Text>
          </View>
        </View>
      </View>

      <DeleteTableModal
        visible={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onDelete={async () => {
          await confirmDelete();
          handleGetTables({ page: 1, itemsPerPage: 10 });
        }} // Refetch after delete
      />

      <EditTableModal
        visible={showEditModal}
        tableData={selectedTable}
        onClose={() => setShowEditModal(false)}
        onSave={confirmEdit}
      />

      <SuccessModal
        visible={showSuccessModal}
        message={successMessage}
        onClose={() => setShowSuccessModal(false)}
      />
    </View>
  );
};

export default TableManagementScreen;
