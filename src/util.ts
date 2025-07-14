import { getData, Machine, sendToGroupMe } from "./api";

export function createStringWithNextDryers(machines: Machine[])  {
let res:{
  time_until_done: number;
  done: boolean;
  str: string;
}[] = []
for(const machine of machines) {
res.push({
  done: machine.available,
  time_until_done: machine.available ? 0 : machine.timeRemaining,
  str: `${emojiBatch(machine)}${machine.type[0].toUpperCase() + machine.type.slice(1)} #${machine.stickerNumber} ${machine.available ? "is available" : `will be done in ${Math.floor(machine.timeRemaining)} minutes`} ${machine.doorClosed && machine.available ? " (contains peoples clothes)" : ""}`
})
}
return res.sort((a,b) => {
return a.time_until_done - b.time_until_done
}).map(m => m.str).join('\n')
}

export function emojiBatch(machine: Machine) {
  let str = ``;
  if(machine.available) {
    str += `✅`;
  } else {
    str += `🚫`;
  }
  if(machine.mode === "idle") {
    str += `🕐`;
  }
  if(machine.mode === "running") {
    str += `⏳`;
  }
  if(machine.mode === "paused") {
    str += `⏸️`;
  }
  if(machine.mode == "pressStart") {
    str += `▶️`;
  }
  // if()
  str += " "
  return str;
}
export const sendFreeMessage = async () => {
const data = await getData()
const res:any[] = []
for(const machine of data.machines.filter(d=>d.notAvailableReason !== "offline")) {
  res.push({ 
    type: machine.type,
  time_until_done: machine.available ? 0 : machine.timeRemaining,
    done: machine.available,
    str: `${emojiBatch(machine)}${machine.type[0].toUpperCase() + machine.type.slice(1)} #${machine.stickerNumber} ${machine.available ? "is available" : `will be done in ${Math.floor(machine.timeRemaining)} minutes`} ${machine.doorClosed && machine.available ? " (contains peoples clothes)" : ""}`
  })
}
return sendToGroupMe(`Available machines:\nWashers:\n\t${res.filter(d=>d.type == "washer").sort((a,b) => a.time_until_done - b.time_until_done).map(d=>d.str).join('\n\t')}\n\nDryers:\n\t${res.filter(d=>d.type == "dryer").sort((a,b) => a.time_until_done - b.time_until_done).map(d=>d.str).join('\n\t')}`.replace(/ +/g, ' ').replace(/\n+/g, '\n').trim())
}