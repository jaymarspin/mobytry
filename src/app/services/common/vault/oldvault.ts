import { Injectable, Inject } from '@angular/core';
 
import { Platform } from '@ionic/angular';
import { Session } from 'src/app/models/common/session.model';
import { from } from 'rxjs';
import {
    Device, DeviceSecurityType, Vault,
    BrowserVault, VaultType, AuthMode, 
  } from '@ionic-enterprise/identity-vault';
import { IonicNativeAuthPlugin } from '@ionic-enterprise/identity-vault/dist/esm/definitions';
 
export interface VaultServiceState {
    session: string;
  }
@Injectable({
  providedIn: 'root',
})
export class VaultService {

    key = 'sessionData';
    vault: Vault | BrowserVault;
  
    public state: VaultServiceState = {
      session: '',
    };
  
  constructor(public platform: Platform) {
    this.init()
  }

  async init() {
    this.vault = new Vault({
      key: 'com.simedarbymotors.sg.moby.sales.dev',
      type: VaultType.DeviceSecurity,
      deviceSecurityType: DeviceSecurityType.Both,
      lockAfterBackgrounded: 2000,
      customPasscodeInvalidUnlockAttempts: 2,
      shouldClearVaultAfterTooManyFailedAttempts: true,
      unlockVaultOnLoad: false, 
      
    });
  }
  async canUnlock(): Promise<boolean> {
    if (!(await this.vault.doesVaultExist())) {
      return false;
    }
    const vault = await this.vault
    if (!(await vault.isLocked())) {
      return false;
    }

    
    return true
  }

  

  async isLocked(): Promise<boolean> { 
    return this.vault.isLocked();
  }

  getPlugin(): IonicNativeAuthPlugin {
    if ((this.platform as Platform).is('hybrid')) {
      return this.getPlugin();
    }
  }
}
