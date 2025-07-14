import "dotenv/config"
import { QuickDB} from "quick.db"
// console.log(Database)
const db = new QuickDB()
import cron from 'node-cron';
import { createStringWithNextDryers, emojiBatch, sendFreeMessage } from "./util";
import { ApiResponse, getData, sendToGroupMe } from "./api";
// specific to brown quad A


const main = async () => {
    console.log(`Checking!`)
const data: ApiResponse = await getData()
console.log(`Got data!`)
for(const machine of data.machines) {
    // if(machine.notAvailableReason && machine.notAvailableReason == "offline") continue;
    if(machine.available) {
        // check in quickdb if its already knownc
        const entry = await db.get(`machine-${machine.stickerNumber}`) 
        if(!entry) {
            console.log(`Machine ${machine.stickerNumber} is available!`);
            await db.set(`machine-${machine.stickerNumber}`, true);
            await db.set(`machine-${machine.stickerNumber}-up-count`, 1);
            // send to groupme
            await sendToGroupMe(`${emojiBatch(machine)}${machine.type[0].toUpperCase() + machine.type.slice(1)}  #${machine.stickerNumber} is available ${machine.doorClosed ? "(contains peoples clothes) " : ""}!`)
            if(machine.type == "washer") {
            await sendToGroupMe(`Available dryers:\n${createStringWithNextDryers(data.machines.filter(m => m.type === "dryer" && m.notAvailableReason !== "offline"))}`)
            }
        } else {
            const upCount = await db.get(`machine-${machine.stickerNumber}-up-count`) || 0;
            await db.set(`machine-${machine.stickerNumber}-up-count`, upCount + 1);
            console.log(`Machine ${machine.stickerNumber} is still available! (up count: ${upCount + 1})`);
            if( upCount >= 30 && !await db.get(`machine-${machine.stickerNumber}-notified`)) {
              sendToGroupMe(`${emojiBatch(machine)}${machine.type[0].toUpperCase() + machine.type.slice(1)} #${machine.stickerNumber} is still available ${machine.doorClosed ? "(contains peoples clothes) " : ""}!`); // send to groupme        
              await db.set(`machine-${machine.stickerNumber}-notified`, true);
            }
          }
    } else {
        const entry = await db.get(`machine-${machine.stickerNumber}`) 
        if(entry) {
            console.log(`Machine ${machine.stickerNumber} is not available: ${machine.notAvailableReason || 'Unknown reason'}`);
            await db.delete(`machine-${machine.stickerNumber}`);
            await db.delete(`machine-${machine.stickerNumber}-up-count`);
            await db.delete(`machine-${machine.stickerNumber}-notified`);
            // send to groupme
            sendToGroupMe(`${emojiBatch(machine)}${machine.type[0].toUpperCase() + machine.type.slice(1)} #${machine.stickerNumber} is now being used.`);
        } else {
          const machineLastRecordedTime = await db.get(`machine-${machine.stickerNumber}-last-recorded-time`) || machine.timeRemaining;
          if(machineLastRecordedTime !== machine.timeRemaining) {
            if(machine.timeRemaining - machineLastRecordedTime > 2) {
              sendToGroupMe(`${emojiBatch(machine)}${machine.type[0].toUpperCase() + machine.type.slice(1)} #${machine.stickerNumber} added ${Math.abs(machine.timeRemaining - machineLastRecordedTime)} minutes to the timer!`);
            }
          }
          await db.set(`machine-${machine.stickerNumber}-last-recorded-time`, machine.timeRemaining);
        }
    }
}
}

cron.schedule(`* * * * *`, main)
cron.schedule(`0 6-22 * * *`, () => {
  sendFreeMessage() 
})

// setInterval(main, 60 * 1000)
if(process.env.NODE_ENV !== "production") {
main()
sendFreeMessage()
}
