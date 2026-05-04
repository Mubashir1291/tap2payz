import React, { useCallback, useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  FlatList,
  TextInput,
  ScrollView,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  Modal,
} from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { Colors } from '../../utils/Colors';
import { H2, Subtitle1, Subtitle2, Body3, Overline2 } from '../../utils/fonts';
import { IconSize12, IconSize20, IconSize50 } from '../../utils/IconSizes';
import {
  LeftArrowIcon,
  TableIcon,
  TickIcon,
  EditCircleIcon,
  DeleteCircleIcon,
} from '../../assets/Images';
import styles from './AddNewTableScreenStyles';
import SuccessModal from '../../components/SuccessModal';
import DeleteTableModal from '../../components/DeleteTableModal';
import {
  CREATE_TABLE,
  GET_TABLES,
  UPDATE_TABLE,
  DELETE_TABLE,
} from '../../services/Restaurant/Tables/Table';
import { useSelector } from 'react-redux';
import { CREATE_FLOORS, GET_FLOORS } from '../../services/Restaurant/Floors/Floor';

const AddNewTableScreen = () => {
  const navigation = useNavigation();
  const { store_id } = useSelector(state => state.user);
  const [areas, setAreas] = useState([]);
  const [selectedArea, setSelectedArea] = useState(null);
  const [seats, setSeats] = useState('');
  const [selectedTableId, setSelectedTableId] = useState(null);
  const [addedTables, setAddedTables] = useState([]);
  const [activeActionId, setActiveActionId] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingTable, setEditingTable] = useState(null);
  const [editSeats, setEditSeats] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [tableToDelete, setTableToDelete] = useState(null);
  const [showAddAreaModal, setShowAddAreaModal] = useState(false);
  const [newAreaName, setNewAreaName] = useState('');

  const handleGetFloors = useCallback(async () => {
    if (!store_id) return;
    try {
      const response = await GET_FLOORS({ storeId: store_id });
      const fetchedAreas = response?.items || [];
      setAreas(fetchedAreas);
      if (fetchedAreas.length > 0) {
        setSelectedArea(prev => (prev === null ? fetchedAreas[0] : prev));
      }
    } catch (error) {
      console.error('Error fetching floors:', error);
    }
  }, [store_id]);

  const handleGetTables = useCallback(
    async floorId => {
      if (!store_id || !floorId) return;
      try {
        const response = await GET_TABLES({ floor_id: floorId, store_id: store_id });
        const fetchedTables = (response?.items || []).map(t => ({
          id: (t.table_no - 1).toString(), // Mapping table_no back to grid ID
          seats: t.seats,
          floorId: floorId,
          _id: t._id,
        }));
        setAddedTables(fetchedTables);
      } catch (error) {
        console.error('Error fetching tables:', error);
      }
    },
    [store_id],
  );

  useEffect(() => {
    if (selectedArea?._id) {
      handleGetTables(selectedArea._id);
    }
  }, [selectedArea, handleGetTables]);

  useFocusEffect(
    useCallback(() => {
      handleGetFloors();
    }, [handleGetFloors]),
  );

  const handleCreateFloor = async () => {
    if (newAreaName.trim() === '') return;
    const payload = {
      name: newAreaName.trim(),
      store_id: store_id || '',
    };
    try {
      const response = await CREATE_FLOORS(payload);
      setNewAreaName('');
      setShowAddAreaModal(false);
      setSuccessMessage('Area Added Successfully');
      setShowSuccessModal(true);
      setTimeout(() => setShowSuccessModal(false), 2000);
      handleGetFloors();
    } catch (error) {
      console.error('Error creating floor:', error);
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

  const handleDeleteTable = async () => {
    if (!tableToDelete?._id) return;
    try {
      const response = await DELETE_TABLE(tableToDelete._id);

      setShowDeleteModal(false);
      setSuccessMessage('Table Deleted Successfully');
      setShowSuccessModal(true);
      setTimeout(() => setShowSuccessModal(false), 2000);
      setTableToDelete(null);
      handleGetTables(selectedArea._id); // Refresh data from server
    } catch (error) {
      console.error('Error deleting table:', error);
    }
  };

  const handleCreateTable = async newTable => {
    if (!selectedArea || !newTable) return;

    try {
      const payload = {
        tables: [{ seats: parseInt(newTable.seats, 10) || 0 }],
        floor_id: selectedArea._id,
        store_id: store_id || '',
      };

      const response = await CREATE_TABLE(payload);
      setSuccessMessage('Table Added Successfully');
      handleGetTables(selectedArea._id); // Refresh tables from server
      setSelectedTableId(null);
      setSeats('');
      setShowSuccessModal(true);
      setTimeout(() => {
        setShowSuccessModal(false);
      }, 2000);
    } catch (error) {
      console.error('Error creating tables:', error);
    }
  };

  const renderTableGridItem = ({ item }) => {
    const isSelected = selectedTableId === item.id;
    const isAcquired = addedTables.some(t => t.id === item.id && t.floorId === selectedArea?._id);
    return (
      <TouchableOpacity
        style={styles.tableWrapper}
        activeOpacity={0.7}
        onPress={() => {
          setSelectedTableId(prev => (prev === item.id ? null : item.id));
          setActiveActionId(null);
        }}
        disabled={isAcquired}
      >
        {/* Top Chair */}
        <View
          style={[
            styles.chairTop,
            styles.chairTopPosition,
            isSelected || isAcquired ? styles.chairHighlight : styles.chairBase,
          ]}
        />
        {/* Bottom Chair */}
        <View
          style={[
            styles.chairBottom,
            styles.chairBottomPosition,
            isSelected || isAcquired ? styles.chairHighlight : styles.chairBase,
          ]}
        />
        {/* Left Chair */}
        <View
          style={[
            styles.chairLeft,
            styles.chairLeftPosition,
            isSelected || isAcquired ? styles.chairHighlight : styles.chairBase,
          ]}
        />
        {/* Right Chair */}
        <View
          style={[
            styles.chairRight,
            styles.chairRightPosition,
            isSelected || isAcquired ? styles.chairHighlight : styles.chairBase,
          ]}
        />

        {/* Table Core */}
        <View
          style={[
            styles.tableCore,
            isAcquired ? styles.tableCoreAcquiredState : styles.tableCoreBaseState,
            isSelected && styles.selectedTableCore,
            isAcquired && styles.acquiredTableCore,
          ]}
        >
          {isSelected || isAcquired ? (
            <View style={styles.selectionDotContainer}>
              <Image source={TickIcon} style={styles.selectionDot} />
            </View>
          ) : (
            <Text style={{ fontSize: 8, color: Colors.grey }}>{Number(item.id) + 1}</Text>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  const tableData = Array.from({ length: 24 }).map((_, i) => ({ id: i.toString() }));

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={Colors.primary} barStyle="light-content" />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Image source={LeftArrowIcon} style={[IconSize20, styles.whiteTint]} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, H2]}>Add New Table</Text>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <TouchableOpacity style={styles.addAreaBtn} onPress={() => setShowAddAreaModal(true)}>
            <Text style={[styles.addAreaText, Subtitle2]}>Add Area +</Text>
          </TouchableOpacity>
        </View>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.flex1}
      >
        <TouchableWithoutFeedback
          onPress={() => {
            Keyboard.dismiss();

            setActiveActionId(null);
          }}
        >
          <ScrollView
            style={styles.mainContainer}
            contentContainerStyle={styles.flexGrow1}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.topSection}>
              {/* Transparent overlay over top section to catch taps when action menu is open */}
              {activeActionId !== null && (
                <TouchableWithoutFeedback onPress={() => setActiveActionId(null)}>
                  <View style={styles.topSectionTapOverlay} />
                </TouchableWithoutFeedback>
              )}
              {/* Table Grid Selection */}
              <View style={styles.gridContainer}>
                <FlatList
                  data={tableData}
                  keyExtractor={item => item.id}
                  renderItem={renderTableGridItem}
                  numColumns={12}
                  showsVerticalScrollIndicator={false}
                  contentContainerStyle={styles.flatListContent}
                  scrollEnabled={false} // Since we are inside a ScrollView, we should disable internal scroll
                />
              </View>

              {/* Right Controls */}
              <View style={styles.controlsContainer}>
                <Text style={styles.controlLabel}>Select Table Area:</Text>
                <View style={styles.areaRow}>
                  {areas.map(area => (
                    <TouchableOpacity
                      key={area._id}
                      style={[
                        styles.areaBtn,
                        selectedArea?._id === area._id && styles.activeAreaBtn,
                      ]}
                      onPress={() => {
                        setSelectedArea(area);
                        setActiveActionId(null);
                      }}
                    >
                      <Text
                        style={[
                          styles.areaBtnText,
                          selectedArea?._id === area._id && styles.activeAreaBtnText,
                        ]}
                      >
                        {area.name}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>

                <Text style={[styles.controlLabel, styles.controlLabelWithMargin]}>Add Seats:</Text>
                <TextInput
                  style={[styles.input, Body3]}
                  placeholder="Add Seats..."
                  placeholderTextColor={Colors.grey}
                  value={seats}
                  onChangeText={setSeats}
                  keyboardType="numeric"
                />
              </View>
            </View>

            {/* Bottom Visualization Section */}
            <View
              style={[
                styles.visualizationContainer,
                activeActionId !== null && styles.visualizationContainerActive,
              ]}
            >
              {/* Transparent overlay over inactive tables to catch taps */}
              {activeActionId !== null && (
                <TouchableWithoutFeedback onPress={() => setActiveActionId(null)}>
                  <View style={styles.visualizationTapOverlay} />
                </TouchableWithoutFeedback>
              )}
              <View style={styles.visualizationHeader}>
                <Text style={[styles.showingAreaText, Subtitle1]}>
                  Showing Area: {selectedArea?.name || 'Select Area'}
                </Text>
              </View>

              <View
                style={
                  addedTables.filter(t => t.floorId === selectedArea?._id).length > 0
                    ? styles.addedTablesContainer
                    : styles.emptyStateContainer
                }
              >
                {addedTables.filter(t => t.floorId === selectedArea?._id).length > 0 ? (
                  addedTables
                    .filter(t => t.floorId === selectedArea?._id)
                    .map((table, index) => (
                      <TouchableOpacity
                        key={index}
                        style={[
                          styles.tableWrapper,
                          styles.addedTableWrapper,
                          activeActionId === table.id && styles.addedTableWrapperActive,
                        ]}
                        onPress={() =>
                          setActiveActionId(activeActionId === table.id ? null : table.id)
                        }
                      >
                        {/* Top Chair */}
                        <View
                          style={[styles.chairTop, styles.chairTopPosition, styles.chairHighlight]}
                        />
                        {/* Bottom Chair */}
                        <View
                          style={[
                            styles.chairBottom,
                            styles.chairBottomPosition,
                            styles.chairHighlight,
                          ]}
                        />
                        {/* Left Chair */}
                        <View
                          style={[
                            styles.chairLeft,
                            styles.chairLeftPosition,
                            styles.chairHighlight,
                          ]}
                        />
                        {/* Right Chair */}
                        <View
                          style={[
                            styles.chairRight,
                            styles.chairRightPosition,
                            styles.chairHighlight,
                          ]}
                        />

                        {/* Table Core */}
                        <View style={[styles.tableCore, styles.tableCoreSelectedState]}>
                          <Text style={[styles.vizTableText, styles.vizTableTextSmall]}>
                            Table {Number(table.id) + 1}
                          </Text>
                          <Text style={[styles.vizSeatText, Overline2]}>Seats: {table.seats}</Text>
                        </View>

                        {/* Action Overlay */}
                        {activeActionId === table.id && (
                          <View style={styles.actionOverlayContainer}>
                            <View style={styles.actionOverlay}>
                              <TouchableOpacity
                                style={[styles.actionBtn, styles.editActionBtn]}
                                onPress={() => {
                                  setEditingTable(table);
                                  setEditSeats(table.seats.toString());
                                  setShowEditModal(true);
                                  setActiveActionId(null);
                                }}
                              >
                                <Text style={styles.actionBtnText}>Edit</Text>
                                <View style={styles.actionIconContainer}>
                                  <Image source={EditCircleIcon} style={IconSize12} />
                                </View>
                              </TouchableOpacity>

                              <TouchableOpacity
                                style={[styles.actionBtn, styles.deleteActionBtn]}
                                onPress={() => {
                                  setTableToDelete(table);
                                  setShowDeleteModal(true);
                                  setActiveActionId(null);
                                }}
                              >
                                <Text style={styles.actionBtnText}>Delete</Text>
                                <View style={styles.actionIconContainer}>
                                  <Image source={DeleteCircleIcon} style={IconSize12} />
                                </View>
                              </TouchableOpacity>
                            </View>
                            <View style={styles.actionOverlayArrow} />
                          </View>
                        )}
                      </TouchableOpacity>
                    ))
                ) : (
                  <>
                    <Image source={TableIcon} style={[IconSize50, styles.emptyTableIcon]} />
                    <Text style={[styles.emptyText, Subtitle1]}>No Tables Yet!</Text>
                  </>
                )}
              </View>

              <TouchableOpacity
                style={[styles.addTableBtn, selectedTableId && seats && styles.addTableBtnEnabled]}
                disabled={!(selectedTableId && seats)}
                onPress={() => {
                  const newTable = { id: selectedTableId, seats, floorId: selectedArea?._id };
                  handleCreateTable(newTable);
                  setActiveActionId(null);
                }}
              >
                <Text
                  style={[
                    styles.addTableBtnText,
                    Subtitle1,
                    selectedTableId && seats && styles.addTableBtnTextEnabled,
                  ]}
                >
                  Add Table
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>

      {/* Edit Table Modal */}
      <Modal
        visible={showEditModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowEditModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <TouchableOpacity
                onPress={() => setShowEditModal(false)}
                style={styles.modalCloseBtn}
              >
                <Text style={styles.modalCloseText}>✕</Text>
              </TouchableOpacity>
            </View>

            <Text style={[styles.modalTitle, Subtitle1]}>
              Edit Table: {editingTable ? Number(editingTable.id) + 1 : ''}
            </Text>

            <View style={styles.inputGroup}>
              <Text style={[styles.modalLabel, Subtitle2]}>Table Seats</Text>
              <TextInput
                style={[styles.modalInput, Body3]}
                value={editSeats}
                onChangeText={setEditSeats}
                keyboardType="numeric"
                placeholder="Enter seats..."
                placeholderTextColor={Colors.grey}
              />
            </View>

            <TouchableOpacity style={styles.saveChangesBtn} onPress={handleUpdateTable}>
              <Text style={[styles.saveChangesText, Subtitle1]}>Save Changes</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Add Area Modal */}
      <Modal
        visible={showAddAreaModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowAddAreaModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <TouchableOpacity
                onPress={() => setShowAddAreaModal(false)}
                style={styles.modalCloseBtn}
              >
                <Text style={styles.modalCloseText}>✕</Text>
              </TouchableOpacity>
            </View>

            <Text style={[styles.modalTitle, Subtitle1]}>Add New Area</Text>

            <View style={styles.inputGroup}>
              <Text style={[styles.modalLabel, Subtitle2]}>Area Name</Text>
              <TextInput
                style={[styles.modalInput, Body3]}
                value={newAreaName}
                onChangeText={setNewAreaName}
                placeholder="Enter area name..."
                placeholderTextColor={Colors.grey}
              />
            </View>

            <TouchableOpacity style={styles.saveChangesBtn} onPress={handleCreateFloor}>
              <Text style={[styles.saveChangesText, Subtitle1]}>Add Area</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <DeleteTableModal
        visible={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onDelete={handleDeleteTable}
      />

      <SuccessModal
        visible={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        message={successMessage}
      />
    </View>
  );
};

export default AddNewTableScreen;
