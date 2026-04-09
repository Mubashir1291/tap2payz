import { StyleSheet } from 'react-native';
import { Colors } from '../../utils/Colors';
import { S, VS, MS } from '../../utils/Responsive';

const styles = StyleSheet.create({
  // ── Layout ──
  root: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: Colors.white,
  },

  // ── Left Panel ──
  leftPanel: {
    flex: 0.4,
    paddingVertical: VS(36),
    paddingHorizontal: S(32),
    borderRightWidth: VS(1),
    borderRightColor: Colors.lightGrey,
  },
  welcomeSection: {
    marginBottom: VS(16),
  },
  welcomeText: {
    color: Colors.grey,
  },
  userName: {
    color: Colors.black,
    marginTop: VS(2),
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: VS(18),
    paddingHorizontal: S(4),
  },
  summaryText: {
    color: Colors.black,
  },
  divider: {
    height: VS(1),
    backgroundColor: Colors.lightGrey,
  },

  // ── Right Panel ──
  rightPanel: {
    flex: 0.6,
    backgroundColor: '#EBF0FF',
    justifyContent: 'center',
    alignItems: 'center',
    padding: MS(32),
  },
  cashInCard: {
    width: '80%',
    backgroundColor: Colors.white,
    borderRadius: MS(20),
    padding: MS(28),
    elevation: 4,
    position: 'relative',
  },
  closeBtn: {
    position: 'absolute',
    top: VS(16),
    right: S(20),
    zIndex: 10,
    width: S(32),
    height: VS(32),
    borderRadius: MS(16),
    backgroundColor: Colors.lightGrey,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeBtnText: {
    color: Colors.grey,
  },
  cashInHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: VS(20),
    paddingRight: S(40),
  },
  cashInLabel: {
    color: Colors.grey,
  },
  cashInAmount: {
    color: Colors.black,
  },

  // ── Numpad ──
  numpad: {
    marginBottom: VS(20),
  },
  numpadRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: VS(10),
  },
  numpadKey: {
    flex: 1,
    aspectRatio: 2.8,
    marginHorizontal: S(5),
    backgroundColor: '#F5F7FA',
    borderRadius: MS(12),
    justifyContent: 'center',
    alignItems: 'center',
  },
  numpadKeyText: {
    color: Colors.black,
  },
  numpadClearText: {
    color: Colors.primary,
  },
  openRegisterBtn: {
    height: VS(50),
    backgroundColor: Colors.primary,
    borderRadius: MS(12),
    justifyContent: 'center',
    alignItems: 'center',
  },
  openRegisterBtnText: {
    color: Colors.white,
  },
  errorText: {
    color: '#E74C3C',
    textAlign: 'center',
    marginTop: VS(8),
  },

  // ── Modals (shared) ──
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },

  // ── Currency Modal ──
  currencyModalContainer: {
    width: '60%',
    maxWidth: S(600),
    backgroundColor: Colors.white,
    borderRadius: MS(18),
    padding: MS(20),
    position: 'relative',
  },
  closeBtnTop: {
    position: 'absolute',
    top: VS(14),
    right: S(18),
  },
  closeBtnTopText: {
    color: Colors.grey,
  },
  currencyTitle: {
    textAlign: 'center',
    marginBottom: VS(14),
  },
  enteredAmountBanner: {
    backgroundColor: '#EBF0FF',
    borderRadius: MS(10),
    paddingVertical: VS(10),
    paddingHorizontal: S(14),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: VS(16),
  },
  enteredAmountLabel: {
    color: Colors.black,
  },
  enteredAmountValue: {
    color: Colors.primary,
  },
  currencyGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  currencyColumn: {
    flex: 0.48,
  },
  currencyColumnTitle: {
    marginBottom: VS(8),
  },
  currencyGrayCard: {
    backgroundColor: '#F7F8FA',
    borderRadius: MS(12),
    padding: MS(14),
  },
  currencyInputRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: VS(10),
  },
  currencyInputLabel: {
    color: Colors.black,
  },
  currencyBox: {
    backgroundColor: Colors.white,
    width: S(55),
    height: VS(28),
    borderRadius: MS(5),
    textAlign: 'center',
    borderWidth: VS(1),
    borderColor: '#EEE',
    padding: 0,
  },
  currencyFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: VS(20),
  },
  totalLabel: {
    color: Colors.black,
  },
  totalAmount: {
    color: Colors.black,
  },
  confirmBlueBtn: {
    backgroundColor: '#C8D7FF',
    paddingHorizontal: S(28),
    paddingVertical: VS(8),
    borderRadius: MS(8),
    flexDirection: 'row',
    alignItems: 'center',
  },
  confirmBlueBtnText: {
    color: Colors.primary,
  },
  confirmBlueBtnDisabled: {
    backgroundColor: '#E8E8E8',
  },
  confirmBlueBtnTextDisabled: {
    color: Colors.grey,
  },
  remainingContainer: {
    alignItems: 'center',
  },
  remainingLabel: {
    color: Colors.grey,
    marginBottom: VS(2),
  },
  remainingValue: {},
  matchedText: {
    color: '#2ECC71',
  },
  mismatchText: {
    color: '#E74C3C',
  },
  overAmountWarning: {
    color: '#E74C3C',
    textAlign: 'center',
    marginTop: VS(10),
  },

  // ── Final Confirmation Modal ──
  modalContainer: {
    width: '35%',
    backgroundColor: Colors.white,
    borderRadius: MS(20),
    padding: MS(32),
    alignItems: 'center',
    gap: MS(20),
  },
  modalTitle: {
    textAlign: 'center',
  },
  modalSubtitle: {
    textAlign: 'center',
    color: Colors.grey,
  },
  modalButtonContainer: {
    flexDirection: 'row',
    width: '100%',
  },
  modalButton: {
    flex: 1,
    height: VS(50),
    borderRadius: MS(12),
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: Colors.white,
    borderWidth: VS(1.5),
    borderColor: Colors.lightGrey,
    marginRight: S(8),
  },
  cancelButtonText: {
    color: Colors.primary,
  },
  confirmButton: {
    backgroundColor: Colors.primary,
    marginLeft: S(8),
  },
  confirmButtonText: {
    color: Colors.white,
  },
  skipButtonText: {
    color: Colors.primary,
  },
  skipButton: {
    position: 'absolute',
    top: VS(16),
    right: S(20),
    zIndex: 10,
    paddingHorizontal: S(12),
    paddingVertical: VS(6),
    borderRadius: MS(10),
    backgroundColor: Colors.white,
  },
});

export default styles;
