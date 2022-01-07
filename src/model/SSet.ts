import { SID } from "./SID";
import { SMatrix } from "./SMatrix";


export class SSet {
  // Constants
  private readonly WIDTH: number = 6;
  private readonly HEIGHT: number = 4;
  private readonly MAX_SP: number = 21;

  public remainingSP: number;

  public constructor() {
    this.remainingSP = this.MAX_SP;
    this.skillMatrix = new SMatrix(this.WIDTH, this.HEIGHT);
  }

  public reset(): void {
    this.remainingSP = this.MAX_SP; // Reset all skillpoints to MAX_SP
    this.skillMatrix.reset(); // Reset the data
  }

  public tryLearnSkill(sid: SID): boolean {
    // Learn a new skill
    if (this.check(sid) && this.skillMatrix.tryAddSkill(sid)) {
      this.remainingSP -= this.getPoints(sid); // Update remaining points
      return true;
    } else {
      return false;
    }
  }

  public saveAsJSON(): string {
    return this.skillMatrix.saveAsJSON();
  }

  private getPoints(sid: SID): number {
    return sid.row + 1;
  }

  private check(sid: SID): boolean {
    // Check if points is enough
    if (this.getPoints(sid) <= this.remainingSP) {
      return true;
    } else {
      alert("技能点不足！");
      return false;
    }
  }
  
  private skillMatrix: SMatrix;
}

