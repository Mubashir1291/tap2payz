import React from 'react';
import { View, Text, Modal, TouchableOpacity, StyleSheet, TextInput } from 'react-native';
import { Colors } from '../utils/Colors';
import { S, VS, MS } from '../utils/Responsive';
import { H4, Body2, Subtitle1, Subtitle2 } from '../utils/fonts';
import DatePicker from 'react-native-date-picker';

// Fallback to text if no icons to perfectly match the design

const DurationModal = ({ visible = false, onClose, onProceed }) => {
  const [fromDate, setFromDate] = React.useState(new Date('2023-12-01'));
  const [toDate, setToDate] = React.useState(new Date('2023-12-31'));
  const [activeDateField, setActiveDateField] = React.useState(null); // 'from' | 'to' | null

  const formatDate = date => {
    const options = { day: 'numeric', month: 'short', year: 'numeric' };
    return date.toLocaleDateString('en-GB', options); // e.g. "1 Dec 2023"
  };

  return (
    <Modal animationType="fade" transparent={true} visible={visible} onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.modalContent}>
          {/* Close Button */}
          <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
            <Text style={[styles.closeBtnText, Subtitle2]}>✕</Text>
          </TouchableOpacity>

          <Text style={[styles.title, H4]}>Choose the time duration.</Text>

          <View style={styles.row}>
            {/* From Section */}
            <View style={styles.col}>
              <Text style={[styles.sectionTitle, Subtitle1]}>From</Text>

              <Text style={[styles.inputLabel, Body2]}>Date</Text>
              <TouchableOpacity
                style={styles.inputContainer}
                onPress={() => setActiveDateField('from')}
              >
                <TextInput
                  style={[styles.input, Body2]}
                  value={formatDate(fromDate)}
                  editable={false}
                  pointerEvents="none"
                />
                <Text style={styles.iconPlaceholder}>📅</Text>
              </TouchableOpacity>

              <Text style={[styles.inputLabel, Body2]}>Time</Text>
              <View style={styles.inputContainer}>
                <TextInput style={[styles.input, Body2]} value="9:00 am" editable={false} />
                <Text style={styles.iconPlaceholder}>🕒</Text>
              </View>
            </View>

            {/* To Section */}
            <View style={styles.col}>
              <Text style={[styles.sectionTitle, Subtitle1]}>To</Text>

              <Text style={[styles.inputLabel, Body2]}>Date</Text>
              <TouchableOpacity
                style={styles.inputContainer}
                onPress={() => setActiveDateField('to')}
              >
                <TextInput
                  style={[styles.input, Body2]}
                  value={formatDate(toDate)}
                  editable={false}
                  pointerEvents="none"
                />
                <Text style={styles.iconPlaceholder}>📅</Text>
              </TouchableOpacity>

              <Text style={[styles.inputLabel, Body2]}>Time</Text>
              <View style={styles.inputContainer}>
                <TextInput style={[styles.input, Body2]} value="9:00 am" editable={false} />
                <Text style={styles.iconPlaceholder}>🕒</Text>
              </View>
            </View>
          </View>

          <View style={styles.bottomRow}>
            <TouchableOpacity style={styles.proceedBtn} onPress={onProceed}>
              <Text style={[styles.proceedBtnText, Subtitle2]}>Proceed</Text>
              <Text style={styles.arrowIcon}>↘</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Date Picker Modal */}
      <DatePicker
        modal
        mode="date"
        open={!!activeDateField}
        date={
          activeDateField === 'from' ? fromDate : activeDateField === 'to' ? toDate : new Date()
        }
        buttonColor="#3B4B8A"
        dividerColor="#3B4B8A"
        onConfirm={date => {
          if (activeDateField === 'from') {
            setFromDate(date);
          } else if (activeDateField === 'to') {
            setToDate(date);
          }
          setActiveDateField(null);
        }}
        onCancel={() => {
          setActiveDateField(null);
        }}
      />
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  modalContent: {
    width: '50%',
    backgroundColor: Colors.white,
    borderRadius: MS(20),
    padding: MS(32),
    position: 'relative',
  },
  closeBtn: {
    position: 'absolute',
    top: VS(16),
    right: S(16),
    zIndex: 10,
    width: S(32),
    height: VS(32),
    borderRadius: MS(16),
    backgroundColor: Colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  closeBtnText: {
    color: Colors.grey,
  },
  title: {
    textAlign: 'center',
    color: Colors.black,
    marginBottom: VS(32),
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: MS(24),
  },
  col: {
    flex: 1,
  },
  sectionTitle: {
    color: Colors.black,
    marginBottom: VS(16),
  },
  inputLabel: {
    color: Colors.black,
    marginBottom: VS(8),
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E6EAFA',
    borderRadius: MS(10),
    paddingHorizontal: S(16),
    paddingVertical: VS(12),
    marginBottom: VS(16),
  },
  input: {
    flex: 1,
    color: Colors.black,
    padding: 0,
  },
  iconPlaceholder: {
    fontSize: MS(16),
  },
  bottomRow: {
    alignItems: 'center',
    marginTop: VS(24),
  },
  proceedBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#BECDFF',
    paddingVertical: VS(14),
    paddingHorizontal: S(32),
    borderRadius: MS(10),
  },
  proceedBtnText: {
    color: '#16192C',
    marginRight: S(8),
  },
  arrowIcon: {
    fontSize: MS(18),
    color: '#16192C',
  },
  // Removing unused calendar styles
});

export default DurationModal;
