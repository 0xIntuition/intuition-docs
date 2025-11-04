import { forwardRef, ReactNode, SVGProps } from 'react';

export type IconProps = Omit<SVGProps<SVGSVGElement>, 'children'> & {
  viewBox?: string;
  children?: ReactNode;
  width?: number | string;
  height?: number | string;
  size?: number | string;
};

const defaultAttrs = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2 as number,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
};

export const Icon = forwardRef<SVGSVGElement, IconProps>(
  ({
    viewBox = '0 0 24 24',
    width = "1lh",
    height = "1lh",
    size,
    children,
    ...props
  }, ref) => (
    <svg
      ref={ref}
      viewBox={viewBox}
      width={size ?? width}
      height={size ?? height}
      role={props['aria-label'] ? 'img' : 'presentation'}
      aria-hidden={props['aria-label'] ? 'false' : 'true'}
      {...defaultAttrs}
      {...props}
    >
      {children}
    </svg>
  )
);

Icon.displayName = 'Icon';