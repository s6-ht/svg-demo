import { vec2, vec3, vec4 } from "gl-matrix";
import { isNumber } from "lodash";

export function createVec3(x: number | vec2 | vec3 | vec4, y = 0, z = 0) {
  if (Array.isArray(x) && x.length === 3) {
    return vec3.clone(x);
  }

  if (isNumber(x)) {
    return vec3.fromValues(x, y, z);
  }

  return vec3.fromValues(x[0], x[1] || y, x[2] || z);
}

export function deg2rad(deg: number) {
  return (deg / 180) * Math.PI;
}

export function rad2deg(rad: number) {
  return (rad / Math.PI) * 180;
}
