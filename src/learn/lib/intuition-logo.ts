/**
 * The Intuition logo as the bands it is drawn with, measured from its SVG
 * (48 units across): a ring, and five arcs round it. Each band is a stretch
 * of a circle round the Intuition logo's centre: its radius and half its width, in
 * the Intuition logo's units, and where it starts and how far it goes, in degrees
 * counterclockwise from the right. The front page's stars form it, and the
 * film draws it for the protocol.
 */
export const INTUITION_LOGO = {
  size: 48,
  /** The centre, from the view box's top left, y down. */
  center: [23.75, 24],
  bands: [
    { radius: 18.97, halfWidth: 1.89, start: 0, span: 360 },
    { radius: 23.15, halfWidth: 0.72, start: -52.5, span: 107 },
    { radius: 23.15, halfWidth: 0.72, start: 59.5, span: 99 },
    { radius: 23.15, halfWidth: 0.72, start: 164.5, span: 17 },
    { radius: 23.15, halfWidth: 0.72, start: 187.5, span: 93 },
    { radius: 23.15, halfWidth: 0.72, start: 285.5, span: 17 },
  ],
} as const;

/** How far the Intuition logo reaches from its centre, in its units: its outer bands' outer edge. */
export const INTUITION_LOGO_REACH = Math.max(
  ...INTUITION_LOGO.bands.map((band) => band.radius + band.halfWidth),
);

/** The Intuition logo's color in the film: pure black, as a vault's lid and a fee. */
export const INTUITION_LOGO_COLOR = [0, 0, 0] as const;

/** A number for an SVG attribute: three decimals at most, no trailing zeros. */
const svgNumber = (value: number): string => String(Number(value.toFixed(3)));

/**
 * The Intuition logo as SVG elements to place in a document, `diameter` across its
 * reach (`INTUITION_LOGO_REACH`), its centre on `cx`, `cy`, in `color`. Every band is
 * stroked along its middle radius, as wide as the band: the ring a circle,
 * each arc a path from its start to its end, counterclockwise on screen as
 * `INTUITION_LOGO` measures it, with butt caps so it ends square where the band does.
 */
export function intuitionLogoSvg({
  cx,
  cy,
  diameter,
  color,
}: {
  cx: number;
  cy: number;
  diameter: number;
  color: string;
}): string {
  const scale = diameter / (2 * INTUITION_LOGO_REACH);
  // A point on a band's circle at `degrees`, counterclockwise from the right, y up.
  const pointAt = (radius: number, degrees: number): string => {
    const angle = (degrees * Math.PI) / 180;
    return `${svgNumber(cx + radius * Math.cos(angle))} ${svgNumber(cy - radius * Math.sin(angle))}`;
  };
  const bands = INTUITION_LOGO.bands.map(
    ({ radius, halfWidth, start, span }) => {
      const r = radius * scale;
      const stroke = `stroke-width="${svgNumber(2 * halfWidth * scale)}"`;
      if (span >= 360) {
        return `<circle cx="${svgNumber(cx)}" cy="${svgNumber(cy)}" r="${svgNumber(r)}" ${stroke}/>`;
      }
      const isLarge = span > 180 ? 1 : 0;
      return `<path d="M${pointAt(r, start)}A${svgNumber(r)} ${svgNumber(r)} 0 ${isLarge} 0 ${pointAt(r, start + span)}" ${stroke}/>`;
    },
  );
  return `<g fill="none" stroke="${color}">${bands.join('')}</g>`;
}
