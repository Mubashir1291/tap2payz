import React, { useState, useMemo, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Image,
  ActivityIndicator,
} from 'react-native';
import Toast from 'react-native-toast-message';
import { useSelector } from 'react-redux';
import { Colors } from '../../utils/Colors';
import { Subtitle2, Body3, Caption, H1 } from '../../utils/fonts';
import { IconSize12, IconSize20, IconSize24, IconSize40 } from '../../utils/IconSizes';
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
import SortModal, { applySort } from '../../components/SortModal';
import ConfirmationModal from '../../components/ConfirmationModal';
import { DELETE_EMPLOYEE, GET_EMPLOYEES } from '../../services/Employee';
import useDebounce from '../../utils/useDebounce';

const EmployeeManagement = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showSortModal, setShowSortModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [sortType, setSortType] = useState('a-z');

  const debounceSearch = useDebounce(searchQuery, 500);

  const { store_id } = useSelector(state => state.user);
  const [employees, setEmployees] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [paginationData, setPaginationData] = useState(null);

  const sortedData = useMemo(() => {
    return applySort([...employees], sortType, item => item.name);
  }, [sortType, employees]);

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

  const confirmDelete = async () => {
    try {
      await DELETE_EMPLOYEE(selectedEmployee?.id);
    } catch (error) {
      console.error('Network Error', error);
      Toast.show({
        type: 'error',
        text1: 'Delete Failed',
        text2: error?.message || 'Could not delete employee',
      });
    }
    setShowDeleteModal(false);
    // setTimeout(() => {
    //   setShowSuccessModal(true);
    // }, 500);
  };

  const handleSortSelect = type => {
    setSortType(type);
    setShowSortModal(false);
  };

  useEffect(() => {
    const fetchEmployees = async (pageNumber = 1) => {
      setIsLoading(true);
      try {
        const response = await GET_EMPLOYEES({
          storeid: store_id,
          searchText: debounceSearch,
          page: pageNumber,
          itemPerPage: 10,
        });
        const mappedEmployees = (response?.items || []).map(emp => ({
          id: emp._id || emp.id,
          image: emp.employee_profile || null,
          name: emp.employee_name || emp.name || 'Unknown',
          email: emp.employee_email || 'N/A',
          sales: emp.sales || '$0.00',
          tips: emp.tips || '$0.00',
        }));
        setEmployees(mappedEmployees);
        setPaginationData(response);
        setPage(pageNumber);
      } catch (error) {
        console.error('Error fetching employees:', error);
        Toast.show({
          type: 'error',
          text1: 'Fetch Error',
          text2: 'Could not load employees list',
        });
      } finally {
        setIsLoading(false);
      }
    };

    if (store_id) {
      fetchEmployees(page);
    }
  }, [store_id, debounceSearch, page]);

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
              placeholder="Search Employee"
              placeholderTextColor="#3B4B8A"
              value={searchQuery}
              onChangeText={e => setSearchQuery(e)}
            />
          </View>

          <TouchableOpacity style={styles.createBtn} onPress={() => setShowCreateModal(true)}>
            <Text style={[styles.createBtnText, Caption]}>Create Employee +</Text>
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
          <Text style={[styles.colAction, styles.headerText, Subtitle2]}>Actions</Text>
        </View>

        {/* Table Content */}
        <ScrollView showsVerticalScrollIndicator={false}>
          {isLoading ? (
            <View style={styles.loadingWrapper}>
              <ActivityIndicator size="large" color={Colors.primary} />
            </View>
          ) : (
            sortedData.map((item, index) => (
              <View key={index} style={styles.tableRow}>
                <Text style={[styles.colId, styles.rowText, Body3]}>{item.id}</Text>

                <View style={styles.colName}>
                  {item.image ? (
                    <Image
                      source={{ uri: item?.image }}
                      style={[IconSize20, styles.employeeImage]}
                    />
                  ) : (
                    <View style={[IconSize40, styles.placeholderImage]}>
                      <Text style={styles.placeholderText}>{item.name.charAt(0)}</Text>
                    </View>
                  )}
                  <Text style={[styles.rowText, Body3]}>{item.name}</Text>
                </View>

                <Text style={[styles.colEmail, styles.rowText, Body3]}>{item?.email}</Text>
                <Text style={[styles.colSales, styles.rowText, Body3]}>{item?.sales}</Text>
                <Text style={[styles.colTips, styles.rowText, Body3]}>{item?.tips}</Text>

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
            ))
          )}
        </ScrollView>
      </View>

      {/* Pagination Footer */}
      <View style={styles.paginationRow}>
        <TouchableOpacity
          style={[styles.pageBtn, page <= 1 && styles.disabledPageBtn]}
          disabled={page <= 1 || isLoading}
          onPress={() => setPage(prev => prev - 1)}
        >
          <Image source={LeftArrowIcon} style={styles.actionIcon} resizeMode="contain" />
        </TouchableOpacity>
        <Text style={[styles.pageText, Body3]}>{String(page).padStart(2, '0')}</Text>
        <TouchableOpacity
          style={[
            styles.pageBtn,
            (!paginationData?.hasNextPage || page >= paginationData?.lastPage) && styles.disabledPageBtn,
          ]}
          disabled={!paginationData?.hasNextPage || page >= paginationData?.lastPage || isLoading}
          onPress={() => setPage(prev => prev + 1)}
        >
          <Image source={RightArrowIcon} style={styles.actionIcon} resizeMode="contain" />
        </TouchableOpacity>
        <Text style={[styles.pageText, Body3]}>
          out of {String(paginationData?.lastPage || 1).padStart(2, '0')}
        </Text>
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
