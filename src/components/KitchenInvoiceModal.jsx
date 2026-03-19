import React from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  Image,
  ScrollView,
  StyleSheet,
  Dimensions,
} from 'react-native';
// Assuming you have these util files. If not, replace them with standard RN styles.
import {Colors} from '../utils/Colors';
import {S, VS, MS} from '../utils/Responsive';
import {H3, Body1, Body2, Subtitle2} from '../utils/fonts';
import {PSPIcon} from '../assets/Images'; // Example logo icon

const {width} = Dimensions.get('window');

const KitchenInvoiceModal = ({
  visible = true, // Set to true for demonstration
  onClose,
  tableNo = '06',
  orderNo = '#012546',
  itemsCount = '03',
  items = [
    {
      name: 'Sodavand',
      qty: 1,
      category: 'Appetizer',
      note: 'do not add spices on salad, and additionally add lots of latus in it.',
    },
    {
      name: 'Water',
      qty: 1,
      category: 'Drink',
      note: '',
    },
    {
      name: 'Red Wine',
      qty: 2,
      category: 'Wine',
      note: 'don’t add lemon in one drink',
    },
  ],
}) => {

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.container}>
          {/* Main White Card with rounded top corners */}
          <View style={styles.mainCard}>
            {/* Close Button */}
            <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
              <Text style={styles.closeBtnText}>✕</Text>
            </TouchableOpacity>

            {/* Logo Section */}
            <View style={styles.logoContainer}>
              <View style={styles.logoCircle}>
                {/* Replace with your logo source */}
                <Text style={{fontSize: MS(40), color: '#31333A'}}>FL</Text>
                {/* <Image source={PSPIcon} style={styles.logo} /> */}
              </View>
            </View>

            {/* Order Info */}
            <View style={styles.infoSection}>
              <View style={styles.infoRow}>
                <Text style={[styles.infoLabel, Body1]}>Table no:</Text>
                <Text style={[styles.infoValue, H3]}>{tableNo}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={[styles.infoLabel, Body1]}>Order no:</Text>
                <Text style={[styles.infoValue, H3]}>{orderNo}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={[styles.infoLabel, Body1]}>Items:</Text>
                <Text style={[styles.infoValue, H3]}>{itemsCount}</Text>
              </View>
            </View>

            {/* Dashed Divider */}
            <View style={styles.dashedDivider} />

            {/* Items Section with Light Blue Background */}
            <View style={styles.itemsSection}>
              <ScrollView showsVerticalScrollIndicator={false}>
                {items.map((item, index) => (
                  <View key={index} style={styles.itemContainer}>
                    <View style={styles.itemHeader}>
                      <Text style={[styles.itemName, Body1]}>
                        {item.name} (x{item.qty})
                      </Text>
                      <Text style={[styles.itemCategory, Body1]}>
                        ({item.category})
                      </Text>
                    </View>
                    <View style={styles.noteSection}>
                      <Text style={[styles.noteText, Body2]}>
                        Note: {item.note}
                      </Text>
                    </View>
                    {index < items.length - 1 && <View style={styles.itemDivider} />}
                  </View>
                ))}
              </ScrollView>
            </View>
            
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  // Assuming these are defined in your utils. Adding fallbacks here.
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    // Width and alignment to resemble the modal in the image.
    width: '45%', 
    alignItems: 'center',
  },
  mainCard: {
    width: '100%',
    backgroundColor: 'white', // Colors.white
    borderRadius: MS(25),
    paddingTop: VS(30),
    position: 'relative',
    overflow: 'hidden', // Crucial to prevent scallops from spilling out
  },
  closeBtn: {
    position: 'absolute',
    top: VS(15),
    right: S(15),
    zIndex: 10,
    width: S(30),
    height: S(30),
    borderRadius: S(15),
    backgroundColor: '#F5F7FA',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeBtnText: {
    fontSize: MS(16),
    color: '#31333A', // Colors.grey
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: VS(25),
  },
  logoCircle: {
    width: MS(90),
    height: MS(90),
    borderRadius: MS(45),
    backgroundColor: '#FFB79D',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: MS(55),
    height: MS(55),
    resizeMode: 'contain',
  },
  infoSection: {
    paddingHorizontal: MS(30),
    marginBottom: VS(15),
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: VS(8),
  },
  infoLabel: {
    color: '#31333A', // Colors.black
    opacity: 0.8,
  },
  infoValue: {
    color: '#31333A', // Colors.black
    fontWeight: 'bold', // H3 fallback
    fontSize: MS(22), // H3 fallback
  },
  dashedDivider: {
    borderBottomWidth: 1.5,
    borderBottomColor: '#D1D1D1',
    borderStyle: 'dashed',
    marginHorizontal: MS(30),
    marginBottom: VS(20),
  },
  itemsSection: {
    backgroundColor: '#F0F4F9', // The light blue color
    paddingHorizontal: MS(30),
    paddingTop: VS(20),
    // Reduced bottom padding slightly to allow scallops to sit at edge
    paddingBottom: VS(35), 
    minHeight: VS(250),
    maxHeight: VS(400),
    position: 'relative',
    borderBottomWidth: 0, // Ensure no bottom border
  },
  itemContainer: {
    marginBottom: VS(15),
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemName: {
    color: '#31333A', // Colors.black
    fontWeight: '500',
    fontSize: MS(16), // Body1 fallback
  },
  itemCategory: {
    color: '#31333A', // Colors.black
    opacity: 0.7,
    fontSize: MS(16), // Body1 fallback
  },
  noteSection: {
    marginTop: VS(5),
  },
  noteText: {
    color: '#31333A', // Colors.black
    opacity: 0.6,
    lineHeight: VS(18),
    fontSize: MS(14), // Body2 fallback
  },
  itemDivider: {
    height: 1,
    backgroundColor: '#D1D1D1',
    marginTop: VS(15),
    opacity: 0.4,
  },
});

export default KitchenInvoiceModal;