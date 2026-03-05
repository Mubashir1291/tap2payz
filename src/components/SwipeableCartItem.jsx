import React, {useRef} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Animated,
  PanResponder,
  StyleSheet,
} from 'react-native';
import {Colors} from '../utils/Colors';
import {S, VS, MS} from '../utils/Responsive';
import {DeleteIcon} from '../assets/Images';

const SWIPE_THRESHOLD = -80;
const DELETE_BUTTON_WIDTH = S(70);

const SwipeableCartItem = ({children, onDelete}) => {
  const translateX = useRef(new Animated.Value(0)).current;

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gestureState) => {
        return Math.abs(gestureState.dx) > 10 && Math.abs(gestureState.dy) < 10;
      },
      onPanResponderMove: (_, gestureState) => {
        if (gestureState.dx < 0) {
          translateX.setValue(Math.max(gestureState.dx, -DELETE_BUTTON_WIDTH));
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dx < SWIPE_THRESHOLD) {
          // Snap open
          Animated.spring(translateX, {
            toValue: -DELETE_BUTTON_WIDTH,
            useNativeDriver: true,
            bounciness: 5,
          }).start();
        } else {
          // Snap closed
          Animated.spring(translateX, {
            toValue: 0,
            useNativeDriver: true,
            bounciness: 5,
          }).start();
        }
      },
    }),
  ).current;

  const handleDelete = () => {
    Animated.timing(translateX, {
      toValue: -500,
      duration: 250,
      useNativeDriver: true,
    }).start(() => {
      if (onDelete) onDelete();
    });
  };

  return (
    <View style={styles.wrapper}>
      {/* Delete button behind */}
      <View style={styles.deleteContainer}>
        <TouchableOpacity style={styles.deleteBtn} onPress={handleDelete}>
          <Image
            source={DeleteIcon}
            style={styles.deleteIcon}
          />
        </TouchableOpacity>
      </View>

      {/* Swipeable content */}
      <Animated.View
        style={[styles.content, {transform: [{translateX}]}]}
        {...panResponder.panHandlers}>
        {children}
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    position: 'relative',
    overflow: 'hidden',
  },
  deleteContainer: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    width: DELETE_BUTTON_WIDTH,
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteBtn: {
    width: '100%',
    height: '100%',
    backgroundColor: '#E74C3C',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: MS(10),
  },
  deleteIcon: {
    width: S(18),
    height: VS(18),
    resizeMode: 'contain',
    tintColor: Colors.white,
  },
  content: {
    backgroundColor: Colors.white,
  },
});

export default SwipeableCartItem;
