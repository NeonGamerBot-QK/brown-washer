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
// get washer #11
// const url = `https://mycscgo.com/api/v3/machine/info/664d5c7a-c5b6-43f3-9039-de9f5a61a7da`
// get list of open washer/driers (??)
// https://app.launchdarkly.com/sdk/goals/5f51bf29f114d60b01813e8a
// orr https://mycscgo.com/api/v3/machine/info/6a7e5190-7d77-4b55-ae97-af3bd820d5e2
// https://mycscgo.com/api/v3/machine/info/6a7e5190-7d77-4b55-ae97-af3bd820d5e2 is the winner
const url = `https://mycscgo.com/api/v3/machine/info/6a7e5190-7d77-4b55-ae97-af3bd820d5e2`
fetch(url).then(d=>d.json()).then((d:ApiResponse)=> {
    for(const dd of d.machines) {
        if(dd.available) {
            console.log(`Machine ${dd.stickerNumber} is available!`);
        } else {
            console.log(`Machine ${dd.stickerNumber} is not available: ${dd.notAvailableReason || 'Unknown reason'}`);
        }
    }
})

const sendToGroupMe= (message:string) => {
    fetch('https://api.groupme.com/v3/bots/post', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded'
  },
  body: JSON.stringify({"text" : message, "bot_id":process.env.BOT_ID})
});
}