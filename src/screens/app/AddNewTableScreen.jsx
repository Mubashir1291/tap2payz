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
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Colors } from '../../utils/Colors';
import { S, VS, MS } from '../../utils/Responsive';
import { H1, H2, Subtitle1, Subtitle2, Body2, Body3, Caption, Overline } from '../../utils/fonts';
import { IconSize12, IconSize16, IconSize20, IconSize28, IconSize50 } from '../../utils/IconSizes';
import {
  LeftArrowIcon,
  TableIcon,
  OverviewIcon, // Using this as a placeholder for the "No Tables Yet" icon if a specific one isn't found
} from '../../assets/Images';
import styles from './AddNewTableScreenStyles';

const areas = ['Ground Floor', '1st Floor', '2nd Floor', '3rd Floor'];

const AddNewTableScreen = () => {
  const navigation = useNavigation();
  const [selectedArea, setSelectedArea] = useState('1st Floor');
  const [seats, setSeats] = useState('');

  const renderTableGridItem = () => (
    <View style={styles.tableWrapper}>
      {/* Top Chair */}
      <View style={[styles.chairTop, { top: '5%', left: '31.5%', backgroundColor: '#E7E7E7' }]} />
      {/* Bottom Chair */}
      <View style={[styles.chairBottom, { bottom: '5%', left: '31.5%', backgroundColor: '#E7E7E7' }]} />
      {/* Left Chair */}
      <View style={[styles.chairLeft, { left: '5%', top: '31.5%', backgroundColor: '#E7E7E7' }]} />
      {/* Right Chair */}
      <View style={[styles.chairRight, { right: '5%', top: '31.5%', backgroundColor: '#E7E7E7' }]} />
      
      {/* Table Core */}
      <View style={[styles.tableCore, { backgroundColor: '#E7E7E7' }]} />
    </View>
  );

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

      <View style={styles.mainContainer}>
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
          
          <View style={styles.emptyStateContainer}>
            {seats ? (
              <View style={[styles.tableWrapper, { width: S(120) }]}>
                 {/* Top Chair */}
                <View style={[styles.chairTop, { top: '5%', left: '31.5%', backgroundColor: '#3E468A' }]} />
                {/* Bottom Chair */}
                <View style={[styles.chairBottom, { bottom: '5%', left: '31.5%', backgroundColor: '#3E468A' }]} />
                {/* Left Chair */}
                <View style={[styles.chairLeft, { left: '5%', top: '31.5%', backgroundColor: '#3E468A' }]} />
                {/* Right Chair */}
                <View style={[styles.chairRight, { right: '5%', top: '31.5%', backgroundColor: '#3E468A' }]} />
                
                {/* Table Core */}
                <View style={[styles.tableCore, { backgroundColor: '#A4B4FF' }]}>
                  <Text style={[styles.showingAreaText, { fontSize: MS(14) }]}>New Table</Text>
                  <Text style={[styles.emptyText, { fontSize: MS(10), color: '#333' }]}>Seats: {seats}</Text>
                </View>
              </View>
            ) : (
              <>
                <Image source={TableIcon} style={[IconSize50, { tintColor: '#CCCCCC', marginBottom: VS(10) }]} />
                <Text style={[styles.emptyText, Subtitle1]}>No Tables Yet!</Text>
              </>
            )}
          </View>

          <TouchableOpacity 
            style={[styles.addTableBtn, seats && { backgroundColor: '#3E468A' }]}
            disabled={!seats}
          >
            <Text style={[styles.addTableBtnText, Subtitle1]}>Add Table</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default AddNewTableScreen;
