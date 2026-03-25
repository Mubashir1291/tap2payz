import React, { useState, useMemo } from 'react';
import { View, Text, TouchableOpacity, ScrollView, TextInput, Image } from 'react-native';
import { Colors } from '../../utils/Colors';
import { Subtitle2, Body3, Caption, H1 } from '../../utils/fonts';
import { IconSize12, IconSize24, IconSize40 } from '../../utils/IconSizes';
import {
  SearchIcon,
  LeftArrowIcon,
  RightArrowIcon,
  DeleteCircleIcon,
  EditCircleIcon,
  LockCircleIcon,
  WarningIcon,
} from '../../assets/Images';
import styles from './EmployeeManagementStyles';
import CreateEmployeeModal from '../../components/CreateEmployeeModal';
import EditEmployeeModal from '../../components/EditEmployeeModal';
import SuccessModal from '../../components/SuccessModal';
import SortModal from '../../components/SortModal';
import ConfirmationModal from '../../components/ConfirmationModal';

const dummyData = [
  {
    id: '25312152',
    name: 'Michel Gerdes',
    email: 'michelgerdes@gmail.com',
    sales: '$5,956.00',
    tips: '$520.00',
  },
  {
    id: '25312153',
    name: 'John Peterson',
    email: 'john.peterson@gmail.com',
    sales: '$4,120.00',
    tips: '$310.00',
  },
  {
    id: '25312154',
    name: 'Emma Wilson',
    email: 'emmawilson@gmail.com',
    sales: '$6,540.00',
    tips: '$640.00',
  },
  {
    id: '25312155',
    name: 'David Miller',
    email: 'davidmiller@gmail.com',
    sales: '$3,890.00',
    tips: '$250.00',
  },
  {
    id: '25312156',
    name: 'Sophia Anderson',
    email: 'sophia.anderson@gmail.com',
    sales: '$7,120.00',
    tips: '$720.00',
  },
  {
    id: '25312157',
    name: 'Liam Johnson',
    email: 'liamjohnson@gmail.com',
    sales: '$2,980.00',
    tips: '$180.00',
  },
  {
    id: '25312158',
    name: 'Olivia Brown',
    email: 'oliviabrown@gmail.com',
    sales: '$5,430.00',
    tips: '$410.00',
  },
  {
    id: '25312159',
    name: 'Noah Davis',
    email: 'noahdavis@gmail.com',
    sales: '$6,010.00',
    tips: '$505.00',
  },
];

const EmployeeManagement = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showSortModal, setShowSortModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [sortType, setSortType] = useState('a-z');

  const sortedData = useMemo(() => {
    let data = [...dummyData];
    if (sortType === 'a-z' || sortType === 'name') {
      data.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortType === 'z-a') {
      data.sort((a, b) => b.name.localeCompare(a.name));
    }

    // Optionally also filter by searchQuery
    if (searchQuery.trim() !== '') {
      data = data.filter(item => item.name.toLowerCase().includes(searchQuery.toLowerCase()));
    }

    return data;
  }, [sortType, searchQuery]);

  const handleCreate = () => {
    setShowCreateModal(false);
  };

  const handleEdit = () => {
    setShowEditModal(false);
  };

  const handleDeleteClick = emp => {
    setSelectedEmployee(emp);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    setShowDeleteModal(false);
    setTimeout(() => {
      setShowSuccessModal(true);
    }, 500);
  };

  const handleSortSelect = type => {
    setSortType(type);
    setShowSortModal(false);
  };

  return (
    <View style={styles.root}>
      {/* Header Row */}
      <View style={styles.headerRow}>
        <Text style={[styles.headerTitle, H1]}>Employee Management</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.sortBtn} onPress={() => setShowSortModal(true)}>
            <Text style={[styles.sortText, Caption]}>Sort by ⇅</Text>
          </TouchableOpacity>

          <View style={styles.searchBar}>
            <Image source={SearchIcon} style={IconSize12} />
            <TextInput
              style={[styles.searchInput, Body3]}
              placeholder="Search Merchant"
              placeholderTextColor="#3B4B8A"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>

          <TouchableOpacity style={styles.createBtn} onPress={() => setShowCreateModal(true)}>
            <Text style={[styles.createBtnText, Caption]}>Create Merchant +</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Table Container */}
      <View style={styles.tableContainer}>
        {/* Table Header */}
        <View style={styles.tableHeader}>
          <Text style={[styles.colId, styles.headerText, Subtitle2]}>Merchant ID</Text>
          <Text style={[styles.colName, styles.headerText, Subtitle2]}>Employee Name</Text>
          <Text style={[styles.colEmail, styles.headerText, Subtitle2]}>Email Address</Text>
          <Text style={[styles.colSales, styles.headerText, Subtitle2]}>Sales</Text>
          <Text style={[styles.colTips, styles.headerText, Subtitle2]}>Tips</Text>
          <Text style={[styles.colAction, styles.headerText, Subtitle2]}>
            Actions
          </Text>
        </View>

        {/* Table Content */}
        <ScrollView showsVerticalScrollIndicator={false}>
          {sortedData.map((item, index) => (
            <View key={index} style={styles.tableRow}>
              <Text style={[styles.colId, styles.rowText, Body3]}>{item.id}</Text>

              <View style={styles.colName}>
                <View style={[styles.avatar, { backgroundColor: Colors.lightGrey }]} />
                <Text style={[styles.rowText, Body3]}>{item.name}</Text>
              </View>

              <Text style={[styles.colEmail, styles.rowText, Body3]}>{item.email}</Text>
              <Text style={[styles.colSales, styles.rowText, Body3]}>{item.sales}</Text>
              <Text style={[styles.colTips, styles.rowText, Body3]}>{item.tips}</Text>

              <View style={styles.colAction}>
                <TouchableOpacity
                  onPress={() => {
                    setSelectedEmployee(item);
                    setShowEditModal(true);
                  }}
                >
                  <Image source={EditCircleIcon} style={[IconSize24]} />
                </TouchableOpacity>
                <TouchableOpacity>
                  <Image source={LockCircleIcon} style={[IconSize24]} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleDeleteClick(item)}>
                  <Image source={DeleteCircleIcon} style={[IconSize24]} />
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

      {/* Modals */}
      <CreateEmployeeModal
        visible={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onCreate={handleCreate}
      />
      <EditEmployeeModal
        visible={showEditModal}
        onClose={() => setShowEditModal(false)}
        onSave={handleEdit}
        employeeData={selectedEmployee}
      />
      <ConfirmationModal
        visible={showDeleteModal}
        icon={WarningIcon} // Reusing Warning icon for now as a stand-in, user can change if needed
        iconStyle={IconSize40}
        subtitle="Want to Delete Merchant!?"
        subtitle2="Are you sure you want to delete this merchant? they will lost their all data."
        confirmText="Yes, Delete"
        confirmButtonColor="#E74C3C"
        onConfirm={confirmDelete}
        onCancel={() => setShowDeleteModal(false)}
      />
      <SuccessModal
        visible={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        message="Merchant Deleted Successfully!"
      />
      <SortModal
        visible={showSortModal}
        onClose={() => setShowSortModal(false)}
        onSelect={handleSortSelect}
        currentSort={sortType}
      />
    </View>
  );
};

export default EmployeeManagement;
