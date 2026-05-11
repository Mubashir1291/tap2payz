import React from 'react';
import { createShimmerPlaceholder } from 'react-native-shimmer-placeholder';
import LinearGradient from 'react-native-linear-gradient';

const ShimmerPlaceholder = createShimmerPlaceholder(LinearGradient);

const ShimmerEffect = ({
  width,
  height,
  borderRadius = 8,
  style,
  // Adjusted colors for a more visible, premium "silver sweep" effect
  shimmerColors = ['#EBEBEB', '#FFFFFF', '#EBEBEB'],
  duration = 1200, // Slightly faster sweep for better feel
}) => {
  const isWidthPercent = typeof width === 'string' && width.includes('%');
  const isHeightPercent = typeof height === 'string' && height.includes('%');

  return (
    <ShimmerPlaceholder
      width={isWidthPercent ? undefined : width}
      height={isHeightPercent ? undefined : height}
      shimmerColors={shimmerColors}
      shimmerStyle={{ borderRadius }}
      duration={duration}
      style={[
        {
          borderRadius,
          width: isWidthPercent ? width : width || '100%',
          height: isHeightPercent ? height : height || 100,
        },
        style,
      ]}
    />
  );
};

export default ShimmerEffect;
