import React from 'react';
import Svg, { Path, Rect, Text as SvgText, Line } from 'react-native-svg';

const Logo = ({ size = 80, color = '#4a3f38', bgColor = '#e8c4a8' }) => (
  <Svg width={size} height={size} viewBox="0 0 64 64" fill="none">
    {/* Film strip */}
    <Rect x="4" y="4" width="56" height="56" rx="4" stroke={color} strokeWidth="3" fill="none" />

    {/* Perforation strip backgrounds */}
    <Rect x="4" y="4" width="10" height="56" fill={color} />
    <Rect x="50" y="4" width="10" height="56" fill={color} />

    {/* Film perforations left (punch-outs) */}
    <Rect x="6" y="10" width="6" height="5" rx="1" fill={bgColor} />
    <Rect x="6" y="20" width="6" height="5" rx="1" fill={bgColor} />
    <Rect x="6" y="30" width="6" height="5" rx="1" fill={bgColor} />
    <Rect x="6" y="40" width="6" height="5" rx="1" fill={bgColor} />
    <Rect x="6" y="50" width="6" height="5" rx="1" fill={bgColor} />

    {/* Film perforations right (punch-outs) */}
    <Rect x="52" y="10" width="6" height="5" rx="1" fill={bgColor} />
    <Rect x="52" y="20" width="6" height="5" rx="1" fill={bgColor} />
    <Rect x="52" y="30" width="6" height="5" rx="1" fill={bgColor} />
    <Rect x="52" y="40" width="6" height="5" rx="1" fill={bgColor} />
    <Rect x="52" y="50" width="6" height="5" rx="1" fill={bgColor} />

    {/* Dividing line between panels */}
    <Line x1="14" y1="32" x2="50" y2="32" stroke={color} strokeWidth="1.5" />

    {/* "A" character - top panel (y: 4-32, center: 18) */}
    <SvgText
      x="32"
      y="25"
      fontSize="20"
      fontFamily="Arial, sans-serif"
      fontWeight="bold"
      fill={color}
      textAnchor="middle"
    >
      A
    </SvgText>

    {/* "文" character - bottom panel (y: 32-60, center: 46) */}
    <SvgText
      x="32"
      y="53"
      fontSize="18"
      fontFamily="Arial, sans-serif"
      fontWeight="bold"
      fill={color}
      textAnchor="middle"
    >
      文
    </SvgText>
  </Svg>
);

export default Logo;
