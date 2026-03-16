import React, { useState } from 'react';
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
import { useNavigation } from '@react-navigation/native';
import { Colors } from '../../utils/Colors';
import { S, VS, MS } from '../../utils/Responsive';
import { H1, H2, Subtitle1, Subtitle2, Body2, Body3, Caption, Overline } from '../../utils/fonts';
import { IconSize8, IconSize12, IconSize16, IconSize20, IconSize24, IconSize28, IconSize50 } from '../../utils/IconSizes';
import {
  LeftArrowIcon,
  TableIcon,
  TickIcon,
  OverviewIcon,
  EditCircleIcon,
  DeleteCircleIcon,
  CancelOrderIcon,
} from '../../assets/Images';
import styles from './AddNewTableScreenStyles';
import SuccessModal from '../../components/SuccessModal'; 
import DeleteTableModal from '../../components/DeleteTableModal';

const areas = ['Ground Floor', '1st Floor', '2nd Floor', '3rd Floor'];

const AddNewTableScreen = () => {
  const navigation = useNavigation();
  const [selectedArea, setSelectedArea] = useState('Ground Floor');
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

  const renderTableGridItem = ({ item }) => {
    const isSelected = selectedTableId === item.id;
    const isAcquired = addedTables.some(t => t.id === item.id && t.area === selectedArea);
    
    return (
      <TouchableOpacity 
        style={styles.tableWrapper} 
        activeOpacity={0.7}
        onPress={() => setSelectedTableId(item.id)}
        disabled={isAcquired}
      >
        {/* Top Chair */}
        <View style={[styles.chairTop, { top: '5%', left: '31.5%', backgroundColor: (isSelected || isAcquired) ? '#A4B4FF' : '#E7E7E7' }]} />
        {/* Bottom Chair */}
        <View style={[styles.chairBottom, { bottom: '5%', left: '31.5%', backgroundColor: (isSelected || isAcquired) ? '#A4B4FF' : '#E7E7E7' }]} />
        {/* Left Chair */}
        <View style={[styles.chairLeft, { left: '5%', top: '31.5%', backgroundColor: (isSelected || isAcquired) ? '#A4B4FF' : '#E7E7E7' }]} />
        {/* Right Chair */}
        <View style={[styles.chairRight, { right: '5%', top: '31.5%', backgroundColor: (isSelected || isAcquired) ? '#A4B4FF' : '#E7E7E7' }]} />
        
        {/* Table Core */}
        <View style={[
          styles.tableCore, 
          { backgroundColor: isAcquired ? '#3E468A' : '#E7E7E7' },
          isSelected && styles.selectedTableCore,
          isAcquired && styles.acquiredTableCore
        ]}>
          {(isSelected || isAcquired) && (
            <View style={styles.selectionDotContainer}>
               <Image source={TickIcon} style={[styles.selectionDot, { tintColor: '#3E468A' }]} />
            </View>
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
            <Image source={LeftArrowIcon} style={[IconSize20, { tintColor: Colors.white }]} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, H2]}>Add New Table</Text>
        </View>
        <TouchableOpacity style={styles.addAreaBtn}>
          <Text style={[styles.addAreaText, Subtitle2]}>Add Table Area +</Text>
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView 
            style={styles.mainContainer}
            contentContainerStyle={{ flexGrow: 1 }}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.topSection}>
              {/* Table Grid Selection */}
              <View style={styles.gridContainer}>
                <FlatList
                  data={tableData}
                  keyExtractor={(item) => item.id}
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
                  {areas.map((area) => (
                    <TouchableOpacity
                      key={area}
                      style={[
                        styles.areaBtn,
                        selectedArea === area && styles.activeAreaBtn,
                      ]}
                      onPress={() => setSelectedArea(area)}
                    >
                      <Text
                        style={[
                          styles.areaBtnText,
                          selectedArea === area && styles.activeAreaBtnText,
                        ]}
                      >
                        {area}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>

                <Text style={[styles.controlLabel, { marginTop: VS(12) }]}>Add Seats:</Text>
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
            <View style={styles.visualizationContainer}>
              <View style={styles.visualizationHeader}>
                <Text style={[styles.showingAreaText, Subtitle1]}>Showing Area: {selectedArea}</Text>
              </View>
              
              <View style={addedTables.filter(t => t.area === selectedArea).length > 0 ? styles.addedTablesContainer : styles.emptyStateContainer}>
                {addedTables.filter(t => t.area === selectedArea).length > 0 ? (
                  addedTables.filter(t => t.area === selectedArea).map((table, index) => (
                    <TouchableOpacity 
                      key={index} 
                      style={[styles.tableWrapper, { width: S(80), marginRight: S(15), marginBottom: VS(15) }]}
                      onPress={() => setActiveActionId(activeActionId === table.id ? null : table.id)}
                    >
                      {/* Top Chair */}
                      <View style={[styles.chairTop, { top: '5%', left: '31.5%', backgroundColor: '#A4B4FF' }]} />
                      {/* Bottom Chair */}
                      <View style={[styles.chairBottom, { bottom: '5%', left: '31.5%', backgroundColor: '#A4B4FF' }]} />
                      {/* Left Chair */}
                      <View style={[styles.chairLeft, { left: '5%', top: '31.5%', backgroundColor: '#A4B4FF' }]} />
                      {/* Right Chair */}
                      <View style={[styles.chairRight, { right: '5%', top: '31.5%', backgroundColor: '#A4B4FF' }]} />
                      
                      {/* Table Core */}
                      <View style={[styles.tableCore, { backgroundColor: '#A4B4FF' }]}>
                        <Text style={[styles.vizTableText, { fontSize: MS(10) }]}>Table {parseInt(table.id) + 1}</Text>
                        <Text style={[styles.vizSeatText, { fontSize: MS(8) }]}>Seats: {table.seats}</Text>
                      </View>

                      {/* Action Overlay */}
                      {activeActionId === table.id && (
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
                      )}
                    </TouchableOpacity>
                  ))
                ) : (
                  <>
                    <Image source={TableIcon} style={[IconSize50, { tintColor: '#CCCCCC', marginBottom: VS(10) }]} />
                    <Text style={[styles.emptyText, Subtitle1]}>No Tables Yet!</Text>
                  </>
                )}
              </View>

              <TouchableOpacity 
                style={[
                  styles.addTableBtn, 
                  (selectedTableId && seats) && { backgroundColor: '#3E468A' }
                ]}
                disabled={!(selectedTableId && seats)}
                onPress={() => {
                  setAddedTables(prev => [...prev, { id: selectedTableId, seats: seats, area: selectedArea }]);
                  setSelectedTableId(null);
                  // setSeats(''); // Keep seats for "last one" UX
                }}
              >
                <Text style={[styles.addTableBtnText, Subtitle1, (selectedTableId && seats) && { color: Colors.white }]}>Add Table</Text>
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
              <TouchableOpacity onPress={() => setShowEditModal(false)} style={styles.modalCloseBtn}>
                <Image source={CancelOrderIcon} style={[IconSize20, { tintColor: '#FF4D4D' }]} />
              </TouchableOpacity>
            </View>

            <Text style={[styles.modalTitle, Subtitle1]}>Edit Table: {editingTable ? parseInt(editingTable.id) + 1 : ''}</Text>

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

            <TouchableOpacity 
              style={styles.saveChangesBtn}
              onPress={() => {
                setAddedTables(addedTables.map(t => 
                  (t.id === editingTable.id && t.area === selectedArea) 
                    ? { ...t, seats: editSeats } 
                    : t
                ));
                setShowEditModal(false);
                setSuccessMessage('Table Updated Successfully');
                setShowSuccessModal(true);
                setTimeout(() => setShowSuccessModal(false), 2000);
              }}
            >
              <Text style={[styles.saveChangesText, Subtitle1]}>Save Changes</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <DeleteTableModal 
        visible={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onDelete={() => {
          setAddedTables(addedTables.filter(t => t.id !== tableToDelete.id || t.area !== selectedArea));
          setShowDeleteModal(false);
          setSuccessMessage('Table Deleted Successfully');
          setShowSuccessModal(true);
          setTimeout(() => setShowSuccessModal(false), 2000);
          setTableToDelete(null);
        }}
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
