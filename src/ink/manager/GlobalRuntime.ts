import Camera from "@/ink/camera/Camera";

export interface GlobalRuntime {
  CameraContribution: new () => Camera;
  globalThis: any;
}

export const runtime: GlobalRuntime = {
  globalThis: window,
  CameraContribution: Camera,
};
