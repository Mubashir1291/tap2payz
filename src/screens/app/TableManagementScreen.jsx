import React, { useState, useCallback, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  TextInput,
  Image,
  StatusBar,
  Modal,
  TouchableWithoutFeedback,
} from 'react-native';
import Toast from 'react-native-toast-message';
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
import { GET_FLOORS } from '../../services/Restaurant/Floors/Floor';

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
  const [areas, setAreas] = useState([]);
  const [selectedArea, setSelectedArea] = useState(null);
  const [isAreaDropdownVisible, setIsAreaDropdownVisible] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0, width: 0 });
  const areaSelectorRef = useRef(null);

  const handleDeletePress = table => {
    setSelectedTable(table);
    setShowDeleteModal(true);
  };

  const handleGetFloors = useCallback(async () => {
    if (!store_id) return;
    try {
      const response = await GET_FLOORS({
        page: 1,
        itemsPerPage: 10,
        storeId: store_id,
      });
      const fetchedAreas = response?.items || [];
      setAreas(fetchedAreas);

      // Auto-select first floor if nothing is selected
      if (fetchedAreas.length > 0 && !selectedArea) {
        setSelectedArea(fetchedAreas[0]);
      }
    } catch (error) {
      console.error('Error fetching floors:', error);
    }
  }, [store_id, selectedArea]);

  const toggleDropdown = () => {
    if (areaSelectorRef.current) {
      areaSelectorRef.current.measure((fx, fy, width, height, px, py) => {
        setDropdownPosition({
          top: py + height,
          left: px,
          width,
        });
        setIsAreaDropdownVisible(true);
      });
    }
  };

  const handleEditPress = table => {
    setSelectedTable(table);
    setShowEditModal(true);
  };

  const confirmDelete = async () => {
    if (!selectedTable?._id) return;
    try {
      const response = await DELETE_TABLE(selectedTable._id);
      setShowDeleteModal(false);
      setSuccessMessage('Table Deleted Successfully');
      setShowSuccessModal(true);
      // Refresh the current page
      handleGetTables({ page, itemsPerPage: 10 });
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Delete Failed',
        text2: error.message || 'Something went wrong while deleting the table.',
      });
      setShowDeleteModal(false);
    }
  };

  const confirmEdit = async updatedSeats => {
    if (!selectedTable?._id) return;
    try {
      const response = await UPDATE_TABLE(selectedTable._id, {
        seats: parseInt(updatedSeats, 10) || 0,
      });

      // Update local state for immediate UI feedback (optional but good)
      setTables(prev =>
        prev.map(t =>
          (t._id || t.id) === (selectedTable._id || selectedTable.id)
            ? { ...t, seats: updatedSeats }
            : t,
        ),
      );

      setShowEditModal(false);
      setSuccessMessage('Table Updated Successfully');
      setShowSuccessModal(true);
      handleGetTables({ page, itemsPerPage: 10 }); // Refetch to sync with server
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Update Failed',
        text2: error.message || 'Could not update table seats.',
      });
    }
  };

  const handleUpdateTable = async () => {
    if (!editingTable?._id) return;
    try {
      const payload = { seats: parseInt(editSeats, 10) || 0 };
      const response = await UPDATE_TABLE(editingTable._id, payload);

      setShowEditModal(false);
      setSuccessMessage('Table Updated Successfully');
      setShowSuccessModal(true);
      setTimeout(() => setShowSuccessModal(false), 2000);
      handleGetTables(selectedArea._id); // Refresh data from server
    } catch (error) {
      console.error('Error updating table:', error);
    }
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

  const handleGetTables = useCallback(
    async query => {
      if (!store_id) return;
      setIsLoading(true);
      try {
        const response = await GET_TABLES({
          ...query,
          storeId: store_id,
          floor_id: selectedArea?._id,
        });
        setTables(response?.items || []);
        setPaginationData(response);
      } catch (error) {
        console.error('Error fetching tables:', error);
      } finally {
        setIsLoading(false);
      }
    },
    [store_id, selectedArea?._id],
  );

  useFocusEffect(
    useCallback(() => {
      handleGetFloors();
    }, [handleGetFloors]),
  );

  useEffect(() => {
    if (selectedArea?._id || !selectedArea) {
      handleGetTables({ page, itemsPerPage: 10 });
    }
  }, [page, store_id, selectedArea, handleGetTables]);

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
            <TouchableOpacity
              ref={areaSelectorRef}
              style={styles.areaDropdown}
              onPress={toggleDropdown}
            >
              <Text style={[styles.areaText, Subtitle2]}>
                {selectedArea?.name || 'Select Area'}
              </Text>
              <Image source={MenuIcon} style={[IconSize16, styles.whiteIconTint]} />
            </TouchableOpacity>

            <Modal
              visible={isAreaDropdownVisible}
              transparent={true}
              animationType="fade"
              onRequestClose={() => setIsAreaDropdownVisible(false)}
            >
              <TouchableWithoutFeedback onPress={() => setIsAreaDropdownVisible(false)}>
                <View style={styles.modalOverlay}>
                  <View
                    style={[
                      styles.dropdownContainer,
                      {
                        position: 'absolute',
                        top: dropdownPosition.top + 5,
                        left: dropdownPosition.left,
                        width: dropdownPosition.width,
                        backgroundColor: Colors.white,
                        borderRadius: 8,
                        elevation: 5,
                        shadowColor: '#000',
                        shadowOffset: { width: 0, height: 2 },
                        shadowOpacity: 0.1,
                        shadowRadius: 4,
                        overflow: 'hidden',
                      },
                    ]}
                  >
                    {areas.map(area => (
                      <TouchableOpacity
                        key={area._id}
                        style={[
                          styles.dropdownItem,
                          { paddingVertical: 12, paddingHorizontal: 16 },
                          selectedArea?._id === area._id && { backgroundColor: '#F0F4F9' },
                        ]}
                        onPress={() => {
                          setSelectedArea(area);
                          setIsAreaDropdownVisible(false);
                          setPage(1); // Reset to first page when changing area
                        }}
                      >
                        <Text
                          style={[
                            styles.dropdownItemText,
                            Subtitle2,
                            {
                              color: selectedArea?._id === area._id ? Colors.primary : Colors.black,
                            },
                          ]}
                        >
                          {area.name}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              </TouchableWithoutFeedback>
            </Modal>

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
        onDelete={confirmDelete}
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
