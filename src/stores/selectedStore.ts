import { makeAutoObservable } from "mobx";

class SelectedStore {
  selectedIds: number[] = [];

  constructor() {
    makeAutoObservable(this);
  }

  setSelectedIds(ids: number[]) {
    this.selectedIds = ids;
  }

  toggle(id: number) {
    if (this.selectedIds.includes(id)) {
      this.selectedIds = this.selectedIds.filter((i) => i !== id);
    } else {
      this.selectedIds.push(id);
    }
  }

  clear() {
    this.selectedIds = [];
  }
}

export const selectedStore = new SelectedStore();
