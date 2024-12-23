export type AsArray<T> = T extends any[] ? T : [T];

export class SyncHook<T, R = void> {
  private callbacks: ((...args: AsArray<T>) => R)[] = [];

  tap(fn: (...args: AsArray<T>) => R) {
    this.callbacks.push(fn);
  }

  call(...args: any) {
    this.callbacks.forEach((cb) => {
      cb(...args);
    });
  }
}
