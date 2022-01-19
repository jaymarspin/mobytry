import { Injectable } from '@angular/core';
import { Capacitor } from '@capacitor/core';
import {
  Vault,
  Device,
  DeviceSecurityType,
  VaultType,
  BrowserVault,
  IdentityVaultConfig,
} from '@ionic-enterprise/identity-vault';
import { IonicNativeAuthPlugin } from '@ionic-enterprise/identity-vault/dist/esm/definitions';
import { Platform } from "@ionic/angular"; 

const config: IdentityVaultConfig = {
  key: 'com.simedarbymotors.sg.moby.sales.dev',
  type: VaultType.SecureStorage,
  deviceSecurityType: DeviceSecurityType.None,
  lockAfterBackgrounded: 2000,
  shouldClearVaultAfterTooManyFailedAttempts: true,
  customPasscodeInvalidUnlockAttempts: 2,
  unlockVaultOnLoad: false,
};
const key = 'sessionData';

export interface VaultServiceState {
  session: string;
}
                   
@Injectable({ providedIn: 'root' })
export class VaultService {
  public state: VaultServiceState = {
    session: '',
  };

  vault: Vault | BrowserVault;

  constructor(private platform: Platform) {
    this.init();
  }

  async init() {

    await this.platform.ready(); // This is required only for Cordova
    const biometric = await Device.isBiometricsEnabled()
    let vaultType = VaultType.DeviceSecurity
    if(biometric === false){
      vaultType = VaultType.SecureStorage
    }
    this.vault = new Vault({
      key: 'com.simedarbymotors.sg.moby.sales.dev',
      type: vaultType,
      deviceSecurityType: DeviceSecurityType.Both,
      lockAfterBackgrounded: 2000,
      customPasscodeInvalidUnlockAttempts: 2,
      shouldClearVaultAfterTooManyFailedAttempts: false,
      unlockVaultOnLoad: false,
      
   });
   
  }
 
  async setSession(value: string): Promise<void> {
    this.state.session = value;
    await this.vault.setValue(key, value);
  }

  

  async restoreSession() {
    const value = await this.vault.getValue(key);
    this.state.session = value;
  }


  async lockVault() {
    await this.vault.lock();
  }
  
  async unlockVault() {
    await this.vault.unlock();
  }

  
}