import { StyleSheet } from 'react-native';
import { Colors } from '../../utils/Colors';
import { S, VS, MS } from '../../utils/Responsive';

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#F0F4FF', // Light blue background from image
    justifyContent: 'center',
    alignItems: 'center',
    padding: MS(20),
  },
  card: {
    width: '90%',
    backgroundColor: Colors.white,
    borderRadius: MS(20),
    padding: MS(24),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
    minHeight: VS(400),
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: VS(40),
  },
  btnOutline: {
    borderWidth: 1,
    borderColor: '#B6C8FB',
    borderRadius: MS(8),
    paddingVertical: VS(12),
    paddingHorizontal: S(16),
  },
  btnText: {
    color: '#27548C',
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  deviceIcon: {
    width: S(200),
    height: VS(200),
  },
  infoContainer: {
    alignItems: 'center',
    marginBottom: VS(30),
  },
  infoLabel: {
    color: Colors.black,
    marginBottom: VS(8),
  },
  deviceName: {
    color: Colors.black,
  },
  hamburgerBtn: {
    position: 'absolute',
    top: VS(20),
    left: S(20),
    zIndex: 10,
    padding: MS(10),
  },
  hamburgerLine: {
    width: S(24),
    height: VS(2.5),
    backgroundColor: Colors.black,
    marginVertical: VS(2),
    borderRadius: MS(2),
  },
  hamburgerLineShort: {
    width: S(16),
  },
});

export default styles;
