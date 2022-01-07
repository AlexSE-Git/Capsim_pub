import { SID } from "./SID";

export class SMatrix {
  public constructor(w: number, h: number) {
    this.width = w;
    this.height = h;

    this.data = this.initData();
  }

  public reset(): void {
    this.data = this.initData();
  }

  public tryAddSkill(sid: SID): boolean {
    if (sid.row == 0 || this.checkUpperRow(sid.row)) {
      this.insert(sid);
      return true;
    } else {
      return false;
    }
  }

  public saveAsJSON(): string {
    let outS = "[";
    for (let i = 0; i < this.height; i++) {
      outS += "[";
      for (let j = 0; j < this.width; j++) {
        outS += this.data.get(i).get(j);
        if (j == this.width - 1) {
          outS += "]";
        } else {
          outS += ",";
        }
      }
      if (i == this.height - 1) {
        outS += "]";
      } else {
        outS += ",";
      }
    }
    return outS;
  }

  private initData(): Map<number, Map<number, boolean>> {
    const m: Map<number, Map<number, boolean>> = new Map();
    for (let i = 0; i < this.height; i++) {
      const currRow = new Map();
      for (let j = 0; j < this.width; j++) {
        currRow.set(j, false);
      }
      m.set(i, currRow);
    }
    return m;
  }

  private insert(sid: SID): void {
    this.data.get(sid.row).set(sid.col, true);
  }

  private checkUpperRow(r: number): boolean {
    for (let i = 0; i < this.width; i++) {
      if (this.data.get(r - 1).get(i)) {
        return true;
      }
    }
    alert("未学习前置技能！");
    return false; // None of the upper row skill is learnt
  }

  private width: number;
  private height: number;
  private data: Map<number, Map<number, boolean>>; // The matrix to store whether skill is learnt
}
