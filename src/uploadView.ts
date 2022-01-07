import { ipcRenderer, clipboard } from "electron";

let buildString: string;
let ShipType: string;
let uid: number;

// Recieve the build data
ipcRenderer.once("buildData", (event, buildData, shipt) => {
  buildString = buildData;
  ShipType = shipt;
  (document.getElementById("ShipType") as HTMLInputElement).value = shipt;
});

document.getElementById("confirmBTN").addEventListener("click", () => {
  const remark = (document.getElementById("Remark") as HTMLTextAreaElement)
    .value;
  const requestBody = `{"BuildName": "${remark}","ShipType": "${ShipType}","buildData": "${buildString}"}`;
  uid = ipcRenderer.sendSync("upload", requestBody);
  document.getElementById("msg").innerHTML = "成功✅ 链接地址："
  document.getElementById("link").innerHTML = `http://23.22.117.127/?uid=${uid}`;
  const clipboardBTN = document.createElement("button");
  clipboardBTN.innerHTML = "复制链接到剪贴板";
  clipboardBTN.addEventListener("click", () => {
    clipboard.writeText(`http://23.22.117.127/?uid=${uid}`);
    clipboardBTN.disabled = true;
  });
  document.getElementById("msgBox").appendChild(clipboardBTN);
  document.getElementById("myform").remove();
});
