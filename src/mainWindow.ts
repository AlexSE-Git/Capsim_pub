import * as bbJSON from "./txt/bb.json";
import * as caJSON from "./txt/ca.json";
import * as cvJSON from "./txt/cv.json";
import * as ddJSON from "./txt/dd.json";

import { ipcRenderer } from "electron";
import { SSet } from "./model/SSet";
import { SID } from "./model/SID";

const skillSet = new SSet();
// const testSet = new SSet();

// console.log(testSet.tryLearnSkill(new SID(0,0)));
// console.log(testSet.tryLearnSkill(new SID(1,0)));
// console.log(testSet.tryLearnSkill(new SID(2,0)));
// console.log(testSet.tryLearnSkill(new SID(3,0)));
// console.log(testSet.tryLearnSkill(new SID(2,3)));
// console.log(testSet.saveAsJSON());

function resolveST(): {
  name: string;
  detail: string;
}[][] {
  const shipT = (document.getElementById("shipType") as HTMLSelectElement)
    .selectedOptions[0].value;
  let jsonObj;
  switch (shipT) {
    case "bb":
      jsonObj = bbJSON;
      break;
    case "ca":
      jsonObj = caJSON;
      break;
    case "cv":
      jsonObj = cvJSON;
      break;
    case "dd":
      jsonObj = ddJSON;
      break;
  }
  return jsonObj;
}

function reset(): void {
  skillSet.reset();
  const resetElements = document.getElementsByClassName("skillBTN");
  for (let i = 0; i < resetElements.length; i++) {
    resetElements[i].removeAttribute("disabled");
  }
  document.getElementById("sp").innerHTML = "技能点：21/21";
}

function shipType(): void {
  // Load the correct file for shipType
  const jsonObj = resolveST();
  for (let row = 0; row < 4; row++) {
    for (let col = 0; col < 6; col++) {
      const selectStr = "[data-row='" + row + "'][data-col='" + col + "']";
      document.querySelector(selectStr).innerHTML = jsonObj[row][col].name;
    }
  }

  reset(); // Reset old tree after select shipType
}

window.addEventListener("load", () => shipType());

const elements = document.getElementsByClassName("skillBTN");

for (let i = 0; i < elements.length; i++) {
  
  elements[i].addEventListener("click", (event) => {
    const sid = new SID(
      parseInt((event.target as HTMLElement).dataset.row),
      parseInt((event.target as HTMLElement).dataset.col)
    );
    if (skillSet.tryLearnSkill(sid)) {
      (event.target as HTMLInputElement).disabled = true;
      document.getElementById("sp").innerHTML =
        "技能点：" + skillSet.remainingSP + "/21";
    }
  });

  elements[i].addEventListener("mouseenter", (event) => {
    const row = parseInt((event.target as HTMLElement).dataset.row);
    const col = parseInt((event.target as HTMLElement).dataset.col);
    const jsonObj = resolveST();
    document.getElementById("dT").innerHTML = jsonObj[row][col].detail;
  });
  
}

document.getElementById("resetBTN").addEventListener("click", reset);

document.getElementById("shipType").addEventListener("change", shipType);

document.getElementById("upBTN").addEventListener("click", () => {
  const UVid = ipcRenderer.sendSync("uploadView"); // Call the main process to open upload view and get its id
  const shipt = (document.getElementById("shipType") as HTMLSelectElement).selectedOptions[0].value;
  ipcRenderer.sendTo(UVid, "buildData", skillSet.saveAsJSON(), shipt);
});
