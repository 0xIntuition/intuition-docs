/**
 * Directions on a sphere and the rotations that turn it: what a graph drawn
 * on a sphere needs, as the playground's story does.
 * Directions are unit vectors, x to the right, y up and z toward the viewer;
 * rotations are unit quaternions. Pure.
 */

export type Vec3 = readonly [number, number, number];
/** A rotation, as a unit quaternion: x, y, z, w. */
export type Quat = readonly [number, number, number, number];

export const IDENTITY_ROTATION: Quat = [0, 0, 0, 1];
/** The direction that faces the viewer. */
export const FRONT: Vec3 = [0, 0, 1];

export function normalize([x, y, z]: Vec3): Vec3 {
  const length = Math.hypot(x, y, z);

  return length === 0 ? [0, 0, 1] : [x / length, y / length, z / length];
}

export function dot(a: Vec3, b: Vec3): number {
  return a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
}

export function cross(a: Vec3, b: Vec3): Vec3 {
  return [
    a[1] * b[2] - a[2] * b[1],
    a[2] * b[0] - a[0] * b[2],
    a[0] * b[1] - a[1] * b[0],
  ];
}

/** The rotation `b` followed by the rotation `a`. */
export function multiply(a: Quat, b: Quat): Quat {
  const [ax, ay, az, aw] = a;
  const [bx, by, bz, bw] = b;

  return [
    aw * bx + ax * bw + ay * bz - az * by,
    aw * by - ax * bz + ay * bw + az * bx,
    aw * bz + ax * by - ay * bx + az * bw,
    aw * bw - ax * bx - ay * by - az * bz,
  ];
}

export function axisAngle(axis: Vec3, angle: number): Quat {
  const [x, y, z] = normalize(axis);
  const half = angle / 2;
  const s = Math.sin(half);

  return [x * s, y * s, z * s, Math.cos(half)];
}

/** `v` turned by the rotation `q`. */
export function rotate(q: Quat, v: Vec3): Vec3 {
  const [qx, qy, qz, qw] = q;
  const u: Vec3 = [qx, qy, qz];
  const uv = cross(u, v);
  const uuv = cross(u, uv);

  return [
    v[0] + 2 * (qw * uv[0] + uuv[0]),
    v[1] + 2 * (qw * uv[1] + uuv[1]),
    v[2] + 2 * (qw * uv[2] + uuv[2]),
  ];
}

/** The shortest rotation that turns the direction `from` onto `to`. */
export function fromTo(from: Vec3, to: Vec3): Quat {
  const a = normalize(from);
  const b = normalize(to);
  const cosine = dot(a, b);
  if (cosine < -0.999999) {
    // Opposite directions: half a turn about any axis at right angles.
    const axis =
      Math.abs(a[0]) < 0.9 ? cross(a, [1, 0, 0]) : cross(a, [0, 1, 0]);

    return axisAngle(axis, Math.PI);
  }
  const [x, y, z] = cross(a, b);
  const w = 1 + cosine;
  const length = Math.hypot(x, y, z, w);

  return [x / length, y / length, z / length, w / length];
}

/** Part of the way from rotation `a` to rotation `b`, the short way. */
export function slerp(a: Quat, b: Quat, t: number): Quat {
  let [bx, by, bz, bw] = b;
  let cosine = a[0] * bx + a[1] * by + a[2] * bz + a[3] * bw;
  if (cosine < 0) {
    [bx, by, bz, bw] = [-bx, -by, -bz, -bw];
    cosine = -cosine;
  }
  if (cosine > 0.9995) {
    const mixed: Quat = [
      a[0] + (bx - a[0]) * t,
      a[1] + (by - a[1]) * t,
      a[2] + (bz - a[2]) * t,
      a[3] + (bw - a[3]) * t,
    ];
    const length = Math.hypot(...mixed);

    return [
      mixed[0] / length,
      mixed[1] / length,
      mixed[2] / length,
      mixed[3] / length,
    ];
  }
  const angle = Math.acos(cosine);
  const sine = Math.sin(angle);
  const wa = Math.sin((1 - t) * angle) / sine;
  const wb = Math.sin(t * angle) / sine;

  return [
    wa * a[0] + wb * bx,
    wa * a[1] + wb * by,
    wa * a[2] + wb * bz,
    wa * a[3] + wb * bw,
  ];
}

/** Part of the way along the great circle from direction `a` to `b`. */
export function arcPoint(a: Vec3, b: Vec3, t: number): Vec3 {
  return rotate(slerp(IDENTITY_ROTATION, fromTo(a, b), t), a);
}
