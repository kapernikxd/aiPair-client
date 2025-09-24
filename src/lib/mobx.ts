export function makeAutoObservable<T extends object>(target: T): T {
  return target;
}

export function runInAction(fn: () => void): void {
  fn();
}
