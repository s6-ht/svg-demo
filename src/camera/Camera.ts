import { mat4, quat, vec3, vec4 } from "gl-matrix";
import { CameraType } from "./types";
import { createVec3, rad2deg } from "@/utils/math";
import { Canvas } from "@/canvas";

export enum CameraProjectionMode {
  ORTHOGRAPHIC,
}

export default class Camera {
  canvas?: Canvas;

  private type = CameraType.ORBITING;
  private position: vec3 = vec3.fromValues(0, 0, 1);
  private focalPoint: vec3 = vec3.fromValues(0, 0, 0);
  /** 相机矩阵 */
  protected matrix = mat4.create();

  right = vec3.fromValues(1, 0, 0);
  up = vec3.fromValues(0, 1, 0);
  forward = vec3.fromValues(0, 0, 1);

  /** 视点到相机位置的向量 focalPoint - position */
  distanceVector = vec3.fromValues(0, 0, -1);
  distance = 1;
  // 相机的俯仰角
  elevation = 0;
  // 相机的方位角
  azimuth = 0;

  // 是否反转相机的水平坐标系
  protected rotateWorld = false;

  /** 沿n(通常与z对齐, 可以看作z)轴移动时 每次移动的bu chang */
  dollyingStep = 0;
  // 绕n轴
  roll = 0;

  projectionMode = CameraProjectionMode.ORTHOGRAPHIC;
  fov = 30;
  near = 0.1;
  far = 1000;
  aspect = 1;
  left: number = 0;
  rright: number = 0;
  top = 0;
  bottom = 0;

  protected projectionMatrix = mat4.create();
  protected projectionMatrixInverse = mat4.create();

  zoom = 1;

  protected orthoMatrix: mat4 = mat4.create();

  protected view:
    | {
        enabled: boolean;
        fullWidth: number;
        fullHeight: number;
        offsetX: number;
        offsetY: number;
        width: number;
        height: number;
      }
    | undefined;

  constructor() {}

  setType(cameraType: CameraType) {
    this.type = cameraType;

    return this;
  }

  protected _getAxes() {
    // FIXME: 查看right和up的值 是否和position一样
    vec3.copy(
      this.right,
      createVec3(vec4.transformMat4(vec4.create(), [1, 0, 0, 0], this.matrix))
    );
    vec3.copy(
      this.up,
      createVec3(vec4.transformMat4(vec4.create(), [0, 1, 0, 0], this.matrix))
    );
    vec3.copy(
      this.forward,
      createVec3(vec4.transformMat4(vec4.create(), [0, 0, 1, 0], this.matrix))
    );

    // FIXME: 归一化的原因 在哪里用到吗？
    vec3.normalize(this.right, this.right);
    vec3.normalize(this.up, this.up);
    vec3.normalize(this.forward, this.forward);
  }

  protected _getDistance() {
    this.distanceVector = vec3.subtract(
      vec3.create(),
      this.focalPoint,
      this.position
    );
    this.distance = vec3.length(this.distanceVector);
    this.dollyingStep = this.distance / 100;
  }

  protected _getAngles() {
    const [x, y, z] = this.distanceVector;
    const r = vec3.length(this.distanceVector);

    // FIXME:
    if (this.rotateWorld) {
      this.elevation = rad2deg(Math.asin(y / r));
      this.azimuth = rad2deg(Math.atan2(-x, -z));
    } else {
      this.elevation = -rad2deg(Math.asin(y / r));
      this.azimuth = -rad2deg(Math.atan2(-x, -z));
    }
  }

  setPosition(x: number, y: number, z = 0) {
    const position = vec3.fromValues(x, y, z || this.position[2]);
    this.position = position;
    this.setFocalPoint(
      this.focalPoint[0],
      this.focalPoint[1],
      this.focalPoint[2]
    );
    return this;
  }

  // FIXME:
  setFocalPoint(x: number, y: number, z: number) {
    const focalPoint = vec3.fromValues(x, y, z);
    this.focalPoint = focalPoint;

    const up = vec3.fromValues(0, 1, 0);

    // 创建一个视图矩阵 用户定义相机在三维空间的位置和方向
    const matrix = mat4.lookAt(
      mat4.create(),
      this.position,
      this.focalPoint,
      up
    );

    // TODO: 调试这里的matrix

    // 将视图矩阵转换为世界空间中的变换矩阵
    mat4.invert(this.matrix, matrix);

    this._getAxes();
    this._getDistance();
    this._getAngles();

    return this;
  }

  protected _getOrthoMatrix() {
    const position = this.position;

    const rotZ = quat.setAxisAngle(
      quat.create(),
      [0, 0, 1],
      (-this.roll * Math.PI) / 180
    );

    // 生成一个旋转、平移和缩放的4x4矩阵
    mat4.fromRotationTranslationScaleOrigin(
      this.orthoMatrix,
      rotZ,
      vec3.fromValues(
        (this.rright - this.left) / 2 - position[0],
        (this.top - this.bottom) / 2 - position[1],
        0
      ),
      vec3.fromValues(this.zoom, this.zoom, 1),
      position
    );
  }

  setOrthographic(
    l: number,
    r: number,
    t: number,
    b: number,
    near: number,
    far: number
  ) {
    this.projectionMode = CameraProjectionMode.ORTHOGRAPHIC;
    this.rright = r;
    this.left = l;
    this.top = t;
    this.bottom = b;
    this.near = near;
    this.far = far;

    const dx = (this.rright - this.left) / (2 * this.zoom);
    const dy = (this.top - this.bottom) / (2 * this.zoom);
    // TODO: 为什么中心点不考虑zoom的影响
    const cx = (this.rright + this.left) / 2;
    const cy = (this.top + this.bottom) / 2;

    let left = cx - dx;
    let right = cx + dx;
    let top = cy + dy;
    let bottom = cy - dy;

    // TODO:
    if (this.view?.enabled) {
      const scaleW =
        (this.rright - this.left) / this.view.fullWidth / this.zoom;
      const scaleH =
        (this.top - this.bottom) / this.view.fullHeight / this.zoom;

      left += scaleW * this.view.offsetX;
      right = left + scaleW * this.view.width;
      top -= scaleH * this.view.offsetY;
      bottom = top - scaleH * this.view.height;
    }

    mat4.ortho(this.projectionMatrix, left, right, top, bottom, near, far);

    // 它在 Y 轴上进行了反向缩放（-1），这意味着在 OpenGL/WebGL 中，Y 轴的方向被翻转。
    // 这通常是因为 OpenGL 的坐标系统与某些其他图形系统（如 Canvas2D）不同，
    // 后者的原点在左上角，而 OpenGL 的原点在左下角。
    mat4.scale(
      this.projectionMatrix,
      this.projectionMatrix,
      vec3.fromValues(1, -1, 1)
    );

    mat4.invert(this.projectionMatrixInverse, this.projectionMatrix);
    this._getOrthoMatrix();
    return this;
  }

  getOrthoMatrix() {
    return this.orthoMatrix;
  }
}
