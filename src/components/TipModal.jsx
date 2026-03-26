import React, { useState, useEffect } from 'react';
import { View, Text, Modal, TouchableOpacity, TextInput, StyleSheet } from 'react-native';
import { Colors } from '../utils/Colors';
import { S, VS, MS } from '../utils/Responsive';
import { H4, Body2, Subtitle2, ButtonText } from '../utils/fonts';

const TIP_OPTIONS = [5.0, 10.0, 15.0];

const TipModal = ({
  visible = false,
  isEditMode = false,
  initialTipAmount = null,
  onAddTip,
  onSaveTip,
  onDeleteTip,
  onClose,
}) => {
  const [selectedPreset, setSelectedPreset] = useState(null);
  const [customTip, setCustomTip] = useState('');

  useEffect(() => {
    if (visible) {
      if (initialTipAmount !== null) {
        // Check if the initial amount matches a preset
        if (TIP_OPTIONS.includes(initialTipAmount)) {
          setSelectedPreset(initialTipAmount);
          setCustomTip('');
        } else {
          setSelectedPreset(null);
          setCustomTip(initialTipAmount.toFixed(2));
        }
      } else {
        setSelectedPreset(null);
        setCustomTip('');
      }
    }
  }, [visible, initialTipAmount]);

  const handlePresetSelect = amount => {
    setSelectedPreset(amount);
    setCustomTip('');
  };

  const handleCustomTipChange = text => {
    setCustomTip(text);
    setSelectedPreset(null);
  };

  const getTipAmount = () => {
    if (selectedPreset !== null) {
      return selectedPreset;
    }
    const parsed = parseFloat(customTip);
    if (!isNaN(parsed) && parsed > 0) {
      return parsed;
    }
    return null;
  };

  const handleAddTip = () => {
    const amount = getTipAmount();
    if (amount !== null && onAddTip) {
      onAddTip(amount);
    }
  };

  const handleSaveTip = () => {
    const amount = getTipAmount();
    if (amount !== null && onSaveTip) {
      onSaveTip(amount);
    }
  };

  const handleDeleteTip = () => {
    if (onDeleteTip) {
      onDeleteTip();
    }
  };

  return (
    <Modal animationType="fade" transparent={true} visible={visible} onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.container}>
          {/* Close Button */}
          <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
            <Text style={[styles.closeBtnText, Subtitle2]}>✕</Text>
          </TouchableOpacity>

          {/* Title */}
          <Text style={[styles.title, H4]}>
            {isEditMode ? 'Edit Tip Information' : 'Tip Information'}
          </Text>

          {/* Select your Tip */}
          <View style={styles.sectionContainer}>
            <Text style={[styles.sectionLabel, Subtitle2]}>Select your Tip:</Text>
            <View style={styles.presetRow}>
              {TIP_OPTIONS.map(amount => (
                <TouchableOpacity
                  key={amount}
                  style={[styles.presetBtn, selectedPreset === amount && styles.presetBtnActive]}
                  onPress={() => handlePresetSelect(amount)}
                >
                  <View style={styles.radioOuter}>
                    {selectedPreset === amount && <View style={styles.radioInner} />}
                  </View>
                  <Text style={[styles.presetText, Body2]}>CAD {amount.toFixed(2)}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Custom Tip Input */}
          <View style={styles.sectionContainer}>
            <Text style={[styles.sectionLabel, Subtitle2]}>Enter your Tip</Text>
            <TextInput
              style={[styles.tipInput, Body2]}
              placeholder="eg: CAD 0.00"
              placeholderTextColor={Colors.grey}
              keyboardType="numeric"
              value={customTip}
              onChangeText={handleCustomTipChange}
            />
          </View>

          {/* Action Buttons */}
          {isEditMode ? (
            <View style={styles.editButtonRow}>
              <TouchableOpacity style={styles.deleteBtn} onPress={handleDeleteTip}>
                <Text style={[styles.deleteBtnText, ButtonText]}>Delete Tip</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveBtn} onPress={handleSaveTip}>
                <Text style={[styles.saveBtnText, ButtonText]}>Save Changes →</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity style={styles.addTipBtn} onPress={handleAddTip}>
              <Text style={[styles.addTipBtnText, ButtonText]}>Add Tip →</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
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
  container: {
    width: '45%',
    backgroundColor: Colors.white,
    borderRadius: MS(20),
    padding: MS(32),
    position: 'relative',
  },
  closeBtn: {
    position: 'absolute',
    top: VS(14),
    right: S(14),
    zIndex: 10,
    width: S(28),
    height: VS(28),
    borderRadius: MS(14),
    backgroundColor: '#F5F7FA',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeBtnText: {
    color: Colors.grey,
  },
  title: {
    textAlign: 'center',
    color: Colors.black,
    marginBottom: VS(20),
  },
  sectionContainer: {
    marginBottom: VS(16),
  },
  sectionLabel: {
    color: Colors.black,
    marginBottom: VS(10),
  },
  presetRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: MS(10),
  },
  presetBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: VS(12),
    paddingHorizontal: S(12),
    borderRadius: MS(20),
    borderWidth: MS(1.5),
    borderColor: Colors.lightGrey,
    backgroundColor: Colors.white,
  },
  presetBtnActive: {
    borderColor: Colors.black,
  },
  radioOuter: {
    width: S(18),
    height: VS(18),
    borderRadius: MS(9),
    borderWidth: 2,
    borderColor: Colors.lightGrey,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: S(8),
  },
  radioInner: {
    width: S(10),
    height: VS(10),
    borderRadius: MS(5),
    backgroundColor: '#00BFFF',
  },
  presetText: {
    color: Colors.black,
  },
  tipInput: {
    backgroundColor: '#F1F1F1',
    borderRadius: MS(12),
    paddingHorizontal: S(16),
    paddingVertical: VS(14),
    color: Colors.black,
  },
  addTipBtn: {
    alignSelf: 'center',
    width: '50%',
    paddingVertical: VS(14),
    borderRadius: MS(12),
    backgroundColor: '#B8C8E8',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: VS(8),
  },
  addTipBtnText: {
    color: Colors.black,
  },
  editButtonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: MS(12),
    marginTop: VS(8),
  },
  deleteBtn: {
    flex: 1,
    paddingVertical: VS(14),
    borderRadius: MS(12),
    backgroundColor: '#E74C3C',
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteBtnText: {
    color: Colors.white,
  },
  saveBtn: {
    flex: 1,
    paddingVertical: VS(14),
    borderRadius: MS(12),
    backgroundColor: '#B8C8E8',
    justifyContent: 'center',
    alignItems: 'center',
  },
  saveBtnText: {
    color: Colors.black,
  },
});

export default TipModal;
