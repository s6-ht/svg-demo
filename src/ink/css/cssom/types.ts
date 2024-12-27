// These units are iterated through, so be careful when adding or changing the
// order.
export enum UnitType {
  kUnknown,
  kNumber,
  kPercentage,
  // Length units
  kEms,
  // kExs,
  kPixels,
  // kCentimeters,
  // kMillimeters,
  // kInches,
  // kPoints,
  // kPicas,
  // kQuarterMillimeters,
  // https://drafts.csswg.org/css-values-4/#viewport-relative-lengths
  //
  // See also IsViewportPercentageLength.
  // kViewportWidth,
  // kViewportHeight,
  // kViewportInlineSize,
  // kViewportBlockSize,
  // kViewportMin,
  // kViewportMax,
  // kSmallViewportWidth,
  // kSmallViewportHeight,
  // kSmallViewportInlineSize,
  // kSmallViewportBlockSize,
  // kSmallViewportMin,
  // kSmallViewportMax,
  // kLargeViewportWidth,
  // kLargeViewportHeight,
  // kLargeViewportInlineSize,
  // kLargeViewportBlockSize,
  // kLargeViewportMin,
  // kLargeViewportMax,
  // kDynamicViewportWidth,
  // kDynamicViewportHeight,
  // kDynamicViewportInlineSize,
  // kDynamicViewportBlockSize,
  // kDynamicViewportMin,
  // kDynamicViewportMax,
  // https://drafts.csswg.org/css-contain-3/#container-lengths
  //
  // See also IsContainerPercentageLength.
  // kContainerWidth,
  // kContainerHeight,
  // kContainerInlineSize,
  // kContainerBlockSize,
  // kContainerMin,
  // kContainerMax,
  kRems,
  // kChs,
  // kUserUnits, // The SVG term for unitless lengths
  // Angle units
  kDegrees,
  kRadians,
  kGradians,
  kTurns,
  // Time units
  kMilliseconds,
  kSeconds,
  // kHertz,
  // kKilohertz,
  // Resolution
  // kDotsPerPixel,
  // kDotsPerInch,
  // kDotsPerCentimeter,
  // Other units
  // kFraction,
  kInteger
}

export enum UnitCategory {
  kUNumber,
  kUPercent,
  kULength,
  kUAngle,
  kUTime,
  // kUFrequency,
  // kUResolution,
  kUOther
}

export enum ValueRange {
  kAll,
  kNonNegative,
  kInteger,
  kNonNegativeInteger,
  kPositiveInteger
}

export enum Nested {
  kYes,
  kNo
}
export enum ParenLess {
  kYes,
  kNo
}
