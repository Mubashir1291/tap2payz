import React from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  ActivityIndicator,
  Image,
} from 'react-native';
import Toast from 'react-native-toast-message';
import { Colors } from '../utils/Colors';
import { S, VS, MS } from '../utils/Responsive';
import { H4, Body2, Subtitle1, Subtitle2 } from '../utils/fonts';
import DatePicker from 'react-native-date-picker';
import { useSelector } from 'react-redux';
import { GET_X_REPORT } from '../services/Sales&Analytics';
import { HalfArrowIcon } from '../assets/Images';
import { IconSize16 } from '../utils/IconSizes';

// ✅ API FUNCTION

const DurationModal = ({ visible = false, onClose, onProceed }) => {
  const [fromDate, setFromDate] = React.useState(new Date());
  const [toDate, setToDate] = React.useState(new Date());
  const [fromTime, setFromTime] = React.useState(new Date());
  const [toTime, setToTime] = React.useState(new Date());
  const [activeDateField, setActiveDateField] = React.useState(null);
  const [activeTimeField, setActiveTimeField] = React.useState(null);
  const [pickerMode, setPickerMode] = React.useState('date');
  const [loading, setLoading] = React.useState(false);

  const { store_id, business_id } = useSelector(state => state.user);

  // ✅ FORMAT FUNCTIONS
  const formatDate = date => {
    const options = { day: 'numeric', month: 'short', year: 'numeric' };
    return date.toLocaleDateString('en-GB', options);
  };

  const formatTime = date => {
    let hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12;
    return `${String(hours).padStart(2, '0')}:${minutes} ${ampm}`;
  };

  // ✅ COMBINE DATE + TIME
  const combineDateTime = (date, time) => {
    const d = new Date(date);
    d.setHours(time.getHours());
    d.setMinutes(time.getMinutes());
    d.setSeconds(0);
    return d;
  };

  // ✅ FORMAT FOR API
  const formatForAPI = date => {
    return date.toISOString();
  };

  // ✅ HANDLE PROCEED (API CALL)
  const handleProceed = async () => {
    try {
      setLoading(true);

      const fromDateTime = combineDateTime(fromDate, fromTime);
      const toDateTime = combineDateTime(toDate, toTime);

      const params = {
        businessId: business_id,
        storeId: store_id,
        fromDate: formatForAPI(fromDateTime),
        toDate: formatForAPI(toDateTime),
        fromTime: formatForAPI(fromDateTime),
        toTime: formatForAPI(toDateTime),
        transType: '',
      };

      const response = await GET_X_REPORT(params);

      // Pass both response and the params used so XReport can reuse params for pagination
      onProceed?.(response, params);

      onClose();
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Report Error',
        text2: error?.message || 'Could not fetch X Report',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal animationType="fade" transparent visible={visible} onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.modalContent}>
          {/* Close */}
          <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
            <Text style={[styles.closeBtnText, Subtitle2]}>✕</Text>
          </TouchableOpacity>

          <Text style={[styles.title, H4]}>Choose the time duration.</Text>

          <View style={styles.row}>
            {/* FROM */}
            <View style={styles.col}>
              <Text style={[styles.sectionTitle, Subtitle1]}>From</Text>

              <Text style={[styles.inputLabel, Body2]}>Date</Text>
              <TouchableOpacity
                style={styles.inputContainer}
                onPress={() => {
                  setActiveDateField('from');
                  setPickerMode('date');
                }}
              >
                <TextInput
                  style={[styles.input, Body2]}
                  value={formatDate(fromDate)}
                  editable={false}
                />
                <Text>📅</Text>
              </TouchableOpacity>

              <Text style={[styles.inputLabel, Body2]}>Time</Text>
              <TouchableOpacity
                style={styles.inputContainer}
                onPress={() => {
                  setActiveTimeField('fromTime');
                  setPickerMode('time');
                }}
              >
                <TextInput
                  style={[styles.input, Body2]}
                  value={formatTime(fromTime)}
                  editable={false}
                />
                <Text>🕒</Text>
              </TouchableOpacity>
            </View>

            {/* TO */}
            <View style={styles.col}>
              <Text style={[styles.sectionTitle, Subtitle1]}>To</Text>

              <Text style={[styles.inputLabel, Body2]}>Date</Text>
              <TouchableOpacity
                style={styles.inputContainer}
                onPress={() => {
                  setActiveDateField('to');
                  setPickerMode('date');
                }}
              >
                <TextInput
                  style={[styles.input, Body2]}
                  value={formatDate(toDate)}
                  editable={false}
                />
                <Text>📅</Text>
              </TouchableOpacity>

              <Text style={[styles.inputLabel, Body2]}>Time</Text>
              <TouchableOpacity
                style={styles.inputContainer}
                onPress={() => {
                  setActiveTimeField('toTime');
                  setPickerMode('time');
                }}
              >
                <TextInput
                  style={[styles.input, Body2]}
                  value={formatTime(toTime)}
                  editable={false}
                />
                <Text>🕒</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* BUTTON */}
          <View style={styles.bottomRow}>
            <TouchableOpacity style={styles.proceedBtn} onPress={handleProceed}>
              {loading ? (
                <ActivityIndicator />
              ) : (
                <>
                  <Text style={[styles.proceedBtnText, Subtitle2]}>Proceed</Text>
                  <Image source={HalfArrowIcon} style={IconSize16} />
                </>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* DATE PICKER */}
      <DatePicker
        modal
        mode={pickerMode}
        open={!!(activeDateField || activeTimeField)}
        date={
          activeDateField === 'from'
            ? fromDate
            : activeDateField === 'to'
              ? toDate
              : activeTimeField === 'fromTime'
                ? fromTime
                : activeTimeField === 'toTime'
                  ? toTime
                  : new Date()
        }
        onConfirm={date => {
          if (activeDateField === 'from') {
            setFromDate(date);
          } else if (activeDateField === 'to') {
            setToDate(date);
          } else if (activeTimeField === 'fromTime') {
            setFromTime(date);
          } else if (activeTimeField === 'toTime') {
            setToTime(date);
          }

          setActiveDateField(null);
          setActiveTimeField(null);
        }}
        onCancel={() => {
          setActiveDateField(null);
          setActiveTimeField(null);
        }}
      />
    </Modal>
  );
};

export default DurationModal;

// ✅ STYLES (same as yours)
const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  modalContent: {
    width: '50%',
    backgroundColor: Colors.white,
    borderRadius: MS(20),
    padding: MS(32),
  },
  closeBtn: {
    position: 'absolute',
    top: VS(16),
    right: S(16),
  },
  closeBtnText: {
    color: Colors.grey,
  },
  title: {
    textAlign: 'center',
    marginBottom: VS(32),
  },
  row: {
    flexDirection: 'row',
    gap: MS(24),
  },
  col: { flex: 1 },
  sectionTitle: { marginBottom: VS(16) },
  inputLabel: { marginBottom: VS(8) },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E6EAFA',
    borderRadius: MS(10),
    padding: MS(10),
    marginBottom: VS(16),
  },
  input: { flex: 1 },
  bottomRow: {
    alignItems: 'center',
    marginTop: VS(24),
  },
  proceedBtn: {
    flexDirection: 'row',
    backgroundColor: '#BECDFF',
    padding: MS(12),
    borderRadius: MS(10),
  },
  proceedBtnText: {
    marginRight: S(8),
  },
});
