import Camera from "@/camera/Camera";

export interface GlobalRuntime {
  CameraContribution: new () => Camera;
  globalThis: any;
}

const getGlobalThis = () => {
  if (typeof globalThis !== "undefined") return globalThis;
  if (typeof self !== "undefined") return self;
  if (typeof window !== "undefined") return window;
  // @ts-ignore
  if (typeof global !== "undefined") return global;
  if (typeof this !== "undefined") return this;
  throw new Error("Unable to locate global `this`");
};

export const runtime: GlobalRuntime = {
  globalThis: getGlobalThis(),
  CameraContribution: Camera,
};
