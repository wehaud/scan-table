import { makeAutoObservable } from "mobx";

class SelectedStore {
  private selectedIdsSet: Set<number> = new Set();

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true });
  }

  get selectedIds(): number[] {
    return Array.from(this.selectedIdsSet);
  }

  setSelectedIds(ids: number[]) {
    this.selectedIdsSet = new Set(ids);
  }

  toggle(id: number) {
    if (this.selectedIdsSet.has(id)) {
      this.selectedIdsSet.delete(id);
    } else {
      this.selectedIdsSet.add(id);
    }
  }

  clear() {
    this.selectedIdsSet.clear();
  }

  has(id: number) {
    return this.selectedIdsSet.has(id);
  }
}

export const selectedStore = new SelectedStore();
