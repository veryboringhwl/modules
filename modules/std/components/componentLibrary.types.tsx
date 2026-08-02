export interface TextProps extends React.ComponentPropsWithoutRef<"span"> {
  as?: React.ElementType;
  variant?: string;
  semanticColor?: string;
  paddingBottom?: string | number;
  lineClamp?: number;
}

export interface AdaptiveTitleProps extends React.ComponentPropsWithoutRef<"span"> {
  trackingRef?: React.RefObject<HTMLElement>;
  maxLines?: number;
  semanticColor?: string;
  unclampedMinimum?: boolean;
  minimumWidth?: number;
  minimumTextStyle?: string;
  maximumTextStyle?: string;
  forceExtraBold?: boolean;
  style?: React.CSSProperties;
}

export interface BoxProps extends React.ComponentPropsWithoutRef<"div"> {
  as?: React.ElementType;
  variant?: string;
  colorSet?: string;
  isInteractive?: boolean;
  href?: string;
  disabled?: boolean;
  borderRadius?: string | number;
  minBlockSize?: string | number;
  padding?: string | number;
  paddingBlockStart?: string | number;
  paddingBlockEnd?: string | number;
  paddingInlineStart?: string | number;
  paddingInlineEnd?: string | number;
  hoverBackgroundColor?: string;
  activeBackgroundColor?: string;
  hoverAnimationDuration?: string;
  hasFocus?: boolean;
}

export interface ButtonPrimaryProps extends React.ComponentPropsWithoutRef<"button"> {
  as?: React.ElementType;
  size?: "small" | "medium" | "large";
  buttonSize?: string;
  colorSet?: string;
  fullWidth?: boolean;
  iconLeading?: React.ReactNode;
  iconTrailing?: React.ReactNode;
  iconOnly?: React.ComponentType;
  "aria-label"?: string;
  "aria-labelledby"?: string;
  "aria-hidden"?: boolean;
  href?: string;
  target?: string;
  UNSAFE_colorSet?: object;
}

export interface ButtonSecondaryProps extends React.ComponentPropsWithoutRef<"button"> {
  as?: React.ElementType;
  size?: "small" | "medium" | "large";
  buttonSize?: string;
  semanticColor?: string;
  fullWidth?: boolean;
  iconLeading?: React.ReactNode;
  iconTrailing?: React.ReactNode;
  iconOnly?: React.ComponentType;
  "aria-label"?: string;
  "aria-labelledby"?: string;
  "aria-hidden"?: boolean;
  href?: string;
}

export interface ButtonTertiaryProps extends React.ComponentPropsWithoutRef<"button"> {
  as?: React.ElementType;
  size?: "small" | "medium" | "large";
  buttonSize?: string;
  semanticColor?: string;
  condensed?: boolean;
  condensedAll?: boolean;
  iconLeading?: React.ComponentType;
  iconTrailing?: React.ComponentType;
  iconOnly?: React.ComponentType;
  "aria-label"?: string;
  "aria-labelledby"?: string;
  "aria-hidden"?: boolean;
  href?: string;
}

export interface CardProps extends React.ComponentPropsWithoutRef<"div"> {
  as?: React.ElementType;
  id: string;
  size?: "sm" | "md";
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  pretitle?: React.ReactNode;
  media?: React.ReactNode;
  leading?: React.ReactNode;
  trailing?: React.ReactNode;
  body?: React.ReactNode;
  footer?: React.ReactNode;
  contentAlign?: boolean;
  onClick?: (e: React.MouseEvent) => void;
  onClickHint?: string;
  onClickRole?: string;
  isRedundantOnClick?: boolean;
  isSelected?: boolean;
  disabled?: boolean;
  "aria-disabled"?: boolean;
  titleGap?: string;
  verticalGap?: string;
  horizontalGap?: string;
  draggable?: boolean;
  onDragEnd?: (e: React.DragEvent) => void;
}

export interface CardTitleProps extends React.ComponentPropsWithoutRef<"p"> {
  as?: React.ElementType;
  variant?: string;
  weight?: string;
  lineClamp?: number;
  href?: string;
  onClick?: React.MouseEventHandler;

  id?: string;
  "aria-describedby"?: string;
}

export interface CardSubtitleProps extends React.ComponentPropsWithoutRef<"p"> {
  id?: string;
}

export interface CardDetailsProps extends React.ComponentPropsWithoutRef<"p"> {
  as?: React.ElementType;
  variant?: string;
  semanticColor?: string;
  href?: string;
  weight?: string;
  lineClamp?: number;

  hasTextSeparator?: boolean;
}

export interface CardImageProps extends React.ComponentPropsWithoutRef<"img"> {
  size?: "sm" | "md";
  imageWidth?: string | number;
  imageHeight?: string | number;
  borderRadius?: string | number;
  alt?: string;
}

export interface ChipProps extends React.ComponentPropsWithoutRef<"button"> {
  as?: React.ElementType;
  href?: string;
  size?: "sm" | "md";
  variant?: "tinted" | "contrasting" | "bordered";
  selected?: boolean;
  selectedColorSet?: string;
  secondary?: boolean;
  disabled?: boolean;
  imageSrc?: string;
  iconLeading?: React.ElementType;
  iconTrailing?: React.ElementType;
  iconLeadingIsHidden?: boolean;
  iconTrailingIsHidden?: boolean;
  role?: string;
  "aria-checked"?: boolean;
  "data-encore-chip-id"?: string;
}

export interface FormCheckboxProps extends React.ComponentPropsWithoutRef<"input"> {
  as?: React.ElementType;
  small?: boolean;
  size?: "small" | "medium";
  indeterminate?: boolean;
  semanticColor?: string;
  id?: string;
}

export interface FormInputProps extends React.ComponentPropsWithoutRef<"input"> {
  as?: React.ElementType;
  size?: "small" | "medium" | "large";
  error?: boolean;
}

export interface FormInputIconProps extends React.ComponentPropsWithoutRef<"div"> {
  as?: React.ElementType;
  iconLeading?: React.ReactElement;
  iconTrailing?: React.ReactElement;
  children: React.ReactNode;
}

export interface FormTextareaProps extends React.ComponentPropsWithoutRef<"textarea"> {
  as?: React.ElementType;
  size?: "small" | "medium";
  error?: boolean;
}
export interface HorizontalRuleProps extends React.ComponentPropsWithoutRef<"hr"> {
  as?: React.ElementType;
}
export interface IconProps extends React.ComponentPropsWithoutRef<"svg"> {
  as?: React.ElementType;
  size?: "xsmall" | "small" | "medium" | "large" | "xlarge" | "xxlarge" | "xxxlarge" | "xxxxlarge";
  iconSize?: number;
  semanticColor?: string;
  autoMirror?: boolean;
  title?: string;
  desc?: string;
}
export interface ImageProps extends React.ComponentPropsWithoutRef<"img"> {
  as?: React.ElementType;
  placeholderSrc?: string;
  placeholderIcon?: React.ElementType;
  imageWidth?: string | number;
  imageHeight?: string | number;
  borderRadius?: string | number;
  circle?: boolean;
  crop?: boolean;
  fluid?: boolean;
  onLoad?: React.ReactEventHandler<HTMLImageElement>;
}
export interface ListProps extends React.ComponentPropsWithoutRef<"div"> {
  as?: React.ElementType;
  orientation?: "row" | "column";
  hasDividers?: boolean;
  gap?: string | number;
}
export interface ListRowProps extends React.ComponentPropsWithoutRef<"div"> {
  as?: React.ElementType;
  id: string;
  size?: "sm" | "md" | "lg" | "xl" | "xxl";
  layout?: "regular" | "wide";

  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  pretitle?: React.ReactNode;
  media?: string;
  leading?: React.ReactNode;
  trailing?: React.ReactNode;
  body?: React.ReactNode;
  footer?: React.ReactNode;

  onClick?: (e: React.MouseEvent) => void;
  onClickHint?: string;
  onClickRole?: string;
  isRedundantOnClick?: boolean;
  isSelected?: boolean;
  disabled?: boolean;

  titleGap?: string;
  verticalGap?: string;
  horizontalGap?: string;
}

export interface ListRowTextProps extends React.ComponentPropsWithoutRef<"p"> {
  as?: React.ElementType;
  variant?: string;
  weight?: string;
  lineClamp?: number;
  semanticColor?: string;
}
export interface ListRowImageProps {
  size?: "sm" | "md" | "lg" | "xl" | "xxl";
  imageWidth?: string | number;
  imageHeight?: string | number;
  borderRadius?: string | number;
}
export interface LogoSpotifyProps extends React.ComponentPropsWithoutRef<"svg"> {
  as?: React.ElementType;

  condensed?: boolean;

  semanticColor?: string;

  useBrandColor?: boolean;

  label?: string;
}
export interface PopoverProps extends React.ComponentPropsWithoutRef<"div"> {
  as?: React.ElementType;

  colorSet?: string;
  popoverTitle?: string;
  popoverTitleId?: string;
  onClose?: () => void;

  large?: boolean;
  closeButtonAriaLabel?: string;

  closeButtonRef?: React.Ref<HTMLButtonElement>;

  arrow?: "top" | "bottom" | "left" | "right";
}
export interface ProgressCircleProps extends React.ComponentPropsWithoutRef<"div"> {
  as?: React.ElementType;

  value?: number;

  variant?: "determinate" | "indeterminate";

  size?: "xsmall" | "small" | "medium" | "large" | "xlarge" | "xxlarge";

  semanticColor?: string;

  showTrack?: boolean;

  hasMinimumFill?: boolean;

  valuetext?: string | ((value: number) => string);
  "aria-label"?: string;
  "aria-labelledby"?: string;
}
export interface ProgressDotsProps extends React.ComponentPropsWithoutRef<"svg"> {
  as?: React.ElementType;
  size?: "small" | "medium" | "large";
  role?: string;
  ariaValueText?: string;
}
export interface TextLinkProps extends React.ComponentPropsWithoutRef<"a"> {
  as?: React.ElementType;
  href?: string;

  component?: "a" | "button" | "span";

  variant?: string;

  semanticColor?: string;

  hasInheritColor?: boolean;

  standalone?: boolean;
  disabled?: boolean;
}
export interface TypeProps extends React.ComponentPropsWithoutRef<"span"> {
  as?: React.ElementType;

  weight?: string;

  variant?: string;
  semanticColor?: string;
  paddingBottom?: string | number;
}
export interface TypeListProps extends React.ComponentPropsWithoutRef<"ul"> {
  as?: React.ElementType;

  listStyleReset?: boolean;

  condensed?: boolean;

  condensedAll?: boolean;
  role?: string;
}
export interface VisuallyHiddenProps extends React.ComponentPropsWithoutRef<"span"> {
  as?: React.ElementType;

  component?: React.ElementType;
}
