export enum CameraType {
  /** 所有旋转操作都以焦点而不是相机位置进行 */
  ORBITING,
  EXPLORING,
  /**
   * 所有旋转操作都以相机位置进行。
   * 在第一人称射击游戏中非常有用。
   * 相机无法在南北极上方旋转。
   */
  TRACKING,
}
