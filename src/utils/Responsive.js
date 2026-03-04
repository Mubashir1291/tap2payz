import { moderateScale, moderateVerticalScale } from 'react-native-size-matters';
// Re-export with different names
// Using factor 0.3 for gentler scaling on tablets

export const S = (size) => moderateScale(size, 0.3);    // for width and margin right & left
export const VS = (size) => moderateVerticalScale(size, 0.3); // for height, margin top & bottom
export const MS = (size) => moderateScale(size, 0.3);    // for fontSize, borderRadius, padding

// Width

// width: scale(200),
// paddingLeft: scale(15),
// paddingRight: scale(15),
// marginLeft: scale(10),
// marginRight: scale(10),
// paddingHorizontal: scale(20),
// marginHorizontal: scale(20),

// Height
// for height and margin top & Botom
// height: verticalScale(100),
// paddingTop: verticalScale(12),
// paddingBottom: verticalScale(12),
// marginTop: verticalScale(10),
// marginBottom: verticalScale(10),
// paddingVertical: verticalScale(20),
// marginVertical: verticalScale(15),

// fontSize: moderateScale(16),
// gap: moderateScale(8),
// borderRadius: moderateScale(12),
// padding: moderateScale(16),
