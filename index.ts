import "dotenv/config"
import { QuickDB} from "quick.db"
// console.log(Database)
const db = new QuickDB()
import cron from 'node-cron';
// specific to brown quad A
const url = `https://mycscgo.com/api/v3/machine/info/6a7e5190-7d77-4b55-ae97-af3bd820d5e2`

export interface ApiResponse {
  location: Location;
  room: Room;
  availabilitySummary: AvailabilitySummary;
  licensePlate: string;
  machines: Machine[];
  balance: number;
}

export interface Machine {
  opaqueId: string;
  controllerType: string;
  type: string;
  locationId: string;
  roomId: string;
  stickerNumber: number;
  licensePlate: string;
  nfcId: string;
  qrCodeId: string;
  doorClosed: boolean;
  available: boolean;
  notAvailableReason?: string;
  inService?: any;
  freePlay: boolean;
  mode: string;
  display?: any;
  timeRemaining: number;
  settings: Settings;
  capability: Capability;
  groupId?: any;
  stackItems?: any;
}

export interface Capability {
  showSettings: boolean;
  addTime: boolean;
  showAddTimeNotice: boolean;
}

export interface Settings {
  soil: string;
  cycle: string;
  washerTemp?: string;
  dryerTemp?: string;
}

export interface AvailabilitySummary {
  washers: Washers;
  dryers: Washers;
}

export interface Washers {
  available: number;
  inUse: number;
  temporarilyUnavailable: number;
  soonest: number;
}

export interface Room {
  locationId: string;
  roomId: string;
  address: Address;
  pockets?: any;
  freePlay: boolean;
  aiHubId: string;
  machineCount: number;
  washerCount: number;
  dryerCount: number;
  label: string;
  description: string;
  hoursOfOperations: any[];
  lifeCycleState: string;
  installerComments?: any;
  expectedWasherInstallationCount: number;
  expectedDryerInstallationCount: number;
  washerIsCountAccurate: boolean;
  dryerIsCountAccurate: boolean;
  washerCountLastChangedTime: string;
  dryerCountLastChangedTime: string;
}


export interface Location {
  locationId: string;
  as400Number: string;
  timezone: string;
  label: string;
  description: string;
  branchId: string;
  lifeCycleState: string;
  installationNotes: string;
  hoursOfOperations: any[];
  address: Address;
  propertyClass?: any;
  applyTransactionFee: boolean;
  washerPricingProfile: WasherPricingProfile;
  dryerPricingProfile: DryerPricingProfile;
  isTestLocation: boolean;
  notes?: any;
  machineCount: number;
  washerCount: number;
  dryerCount: number;
  roomCount: number;
  school: School;
  schoolServiceProvider: SchoolServiceProvider;
  washerIsCountAccurate: boolean;
  dryerIsCountAccurate: boolean;
  washerCountLastChangedTime: string;
  dryerCountLastChangedTime: string;
  washerPricingProfiles: WasherPricingProfile2[];
  dryerPricingProfiles: DryerPricingProfile2[];
}

export interface DryerPricingProfile2 {
  applyTransactionFee: boolean;
  vend: Vend;
  label?: any;
  component?: any;
  profileId: string;
  mainCycleDuration: number;
  additionalTimeDuration: number;
  additionalTimePrice: Vend;
  cycle: Cycle2;
  isDefault: boolean;
  isCustom: boolean;
  customName: string;
}

export interface WasherPricingProfile2 {
  applyTransactionFee: boolean;
  vend: Vend;
  label?: any;
  component?: any;
  profileId: string;
  soil: Soil;
  cycle: Cycle;
  water: Water;
  isDefault: boolean;
  isCustom: boolean;
  customName: string;
}

export interface SchoolServiceProvider {
  env: string;
  ssoEnabled: boolean;
  ssoUrl: string;
  name: string;
  atrium: Atrium;
  clientId: string;
  clientSecret: ClientSecret;
}

export interface ClientSecret {
  algorithm: string;
  iv: string;
  cipherText: string;
}

export interface Atrium {
  apiEnv: string;
  clientId: string;
}

export interface School {
  name: string;
  cardName: string;
  accountName: string;
  accountDescription: string;
  logoFileName: string;
  allowGuestCreditCard: boolean;
  allowGuestStudentCard: boolean;
  allowWallet: boolean;
  allowAuthenticatedStudentCard: boolean;
}

export interface DryerPricingProfile {
  applyTransactionFee: boolean;
  vend: Vend;
  label?: any;
  component?: any;
  profileId: string;
  mainCycleDuration: number;
  additionalTimeDuration: number;
  additionalTimePrice: Vend;
  cycle: Cycle2;
  isDefault: boolean;
  isCustom: boolean;
  customName?: any;
}

export interface Cycle2 {
  'low-temp': Vend;
  'medium-temp': Vend;
  'high-temp': Vend;
  delicates: Vend;
  'no-temp': Vend;
}

export interface WasherPricingProfile {
  applyTransactionFee: boolean;
  vend: Vend;
  label?: any;
  component?: any;
  profileId: string;
  soil: Soil;
  cycle: Cycle;
  water: Water;
  isDefault: boolean;
  isCustom: boolean;
  customName?: any;
}

export interface Water {
  cold: Vend;
  warm: Vend;
  hot: Vend;
}

export interface Cycle {
  delicates: Vend;
  permPress: Vend;
  normal: Vend;
}

export interface Soil {
  light: Vend;
  medium: Vend;
  heavy: Vend;
}

export interface Vend {
  default: number;
  appless?: any;
  app?: any;
  coin?: any;
  webApp?: any;
  creditCard?: any;
}

export interface Address {
  address1: string;
  address2: string;
  city: string;
  state: string;
  zipcode: string;
  location?: any;
}

const sendToGroupMe= (message:string) => {
    return fetch('https://api.groupme.com/v3/bots/post', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded'
  },
  body: JSON.stringify({"text" : message, "bot_id":process.env.BOT_ID})
});
}
function createStringWithNextDryers(machines: Machine[])  {
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
const getData = (): Promise<ApiResponse> => {
return  fetch(url, {
    headers: {
        "User-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3"
    }
}).then(d=>d.json())
}
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
            await sendToGroupMe(`Available dryers:\n${createStringWithNextDryers(data.machines.filter(m => m.type === "dryer" && m.notAvailableReason !== "offline"))}`)
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
        }
    }
}
}
const sendFreeMessage = async () => {
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
cron.schedule(`* * * * *`, main)
cron.schedule(`0 6-22 * * *`, () => {
  sendFreeMessage() 
})
function emojiBatch(machine: Machine) {
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
  str += " "
  return str;
}
// setInterval(main, 60 * 1000)
if(process.env.NODE_ENV !== "production") {
main()
sendFreeMessage()
}
