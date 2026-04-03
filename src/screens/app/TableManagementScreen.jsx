import React, { useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, FlatList, TextInput, Image, StatusBar } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { Colors } from '../../utils/Colors';
import { H2, Subtitle2, Body2, Body3 } from '../../utils/fonts';
import { IconSize16, IconSize20 } from '../../utils/IconSizes';
import { MenuIcon, SearchIcon, EditCircleIcon, DeleteCircleIcon } from '../../assets/Images';
import styles from './TableManagementScreenStyles';
import DeleteTableModal from '../../components/DeleteTableModal';
import EditTableModal from '../../components/EditTableModal';
import SuccessModal from '../../components/SuccessModal';
import { GET_TABLES } from '../../services/Restaurant/Tables/Table';

const dummyData = [
  { id: '1', area: '1st Floor', tableNo: '01', seats: '5, Seats' },
  { id: '2', area: '1st Floor', tableNo: '02', seats: '2, Seats' },
  { id: '3', area: '1st Floor', tableNo: '03', seats: '2, Seats' },
  { id: '4', area: '1st Floor', tableNo: '04', seats: '10, Seats' },
  { id: '5', area: '1st Floor', tableNo: '05', seats: '12, Seats' },
  { id: '6', area: '1st Floor', tableNo: '06', seats: '6, Seats' },
  { id: '7', area: '1st Floor', tableNo: '07', seats: '8, Seats' },
  { id: '8', area: '1st Floor', tableNo: '08', seats: '6, Seats' },
  { id: '9', area: '1st Floor', tableNo: '09', seats: '2, Seats' },
];

const TableManagementScreen = () => {
  const navigation = useNavigation();
  const [search, setSearch] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [selectedTable, setSelectedTable] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  const handleDeletePress = table => {
    setSelectedTable(table);
    setShowDeleteModal(true);
  };

  const handleEditPress = table => {
    setSelectedTable(table);
    setShowEditModal(true);
  };

  const confirmDelete = () => {
    setShowDeleteModal(false);
    setSuccessMessage('Table Deleted Successfully');
    setShowSuccessModal(true);
    // Logic to actually delete would go here (e.g., API call or state update)
  };

  const confirmEdit = () => {
    setShowEditModal(false);
    setSuccessMessage('Table Updated Successfully');
    setShowSuccessModal(true);
    // Logic to actually update would go here (e.g., API call or state update)
  };

  const renderItem = ({ item }) => (
    <View style={styles.tableRow}>
      <Text style={[styles.cell, Body2, styles.flexLarge]}>{item.area}</Text>
      <Text style={[styles.cell, Body2, styles.flexCenterText]}>{item.tableNo}</Text>
      <Text style={[styles.cell, Body2, styles.flexCenterText]}>{item.seats}</Text>
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

  const handleGetTables = async () => {
    try {
      const response = await GET_TABLES();
      console.log('Tables fetched successfully:', response);
    } catch (error) {
      console.error('Error fetching tables:', error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      handleGetTables();
    }, []),
  );

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
            data={dummyData}
            renderItem={renderItem}
            keyExtractor={item => item.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContent}
          />

          {/* Pagination */}
          <View style={styles.pagination}>
            <TouchableOpacity style={styles.pageArrow}>
              <Text style={styles.arrowText}>{'<'}</Text>
            </TouchableOpacity>
            <Text style={[styles.pageText, Body2]}>01</Text>
            <TouchableOpacity style={styles.pageArrow}>
              <Text style={styles.arrowText}>{'>'}</Text>
            </TouchableOpacity>
            <Text style={[styles.outOfText, Body3]}>out of 20</Text>
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
