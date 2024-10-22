import { Injectable } from '@angular/core';
import { EncryptionService } from '../encryption/encryption.service';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  private AppStorage: any = {};

  constructor(
    private encryptService: EncryptionService
  ) { }

  setSessionAttribute(attrName: any, data: any) {
    this.getSessionStorageDetails();
    const DATA: any = {}; DATA[attrName] = this.encryptService.encodeKeyValue(JSON.stringify(data), this.getSessionId());
    Object.assign(this.AppStorage, DATA);
    this.updateSessionStorage(data);
  }

  private getSessionStorageDetails() {
    this.checkIsAlreadyAvailable();
    this.AppStorage = JSON.parse(this.encryptService.decodeTotalSession(sessionStorage.getItem('ANGULARSESSIONID')));
  }

  private checkIsAlreadyAvailable() {
    if (sessionStorage.getItem('ANGULARSESSIONID')) {
      this.updateSessionStorage(JSON.parse(this.encryptService.decodeTotalSession(sessionStorage.getItem('ANGULARSESSIONID'))));
    } else {
      this.createNewSessionDetails();
    }
  }

  private updateSessionStorage(data: any) {
    sessionStorage.removeItem('ANGULARSESSIONID');
    this.setSessionStorage(data);
  }

  private setSessionStorage(data: any) {
    sessionStorage.setItem('ANGULARSESSIONID', this.encryptService.encodeTotalSession(JSON.stringify(data)));
  }

  private getSessionId() {
    this.getSessionStorageDetails();
    return String(this.AppStorage['id']);
  }

  private createNewSessionDetails() {
    const DATA = {
      'id': this.encryptService.generateSalt(20),
      'name': 'Storing Details Locally'
    };
    this.setSessionStorage(DATA);
  }

  setLocalStorageByAttribute(attrName: string, value: any) {
    this.removeIfExistsLocalStorageByAttribute(attrName);
    localStorage.setItem(attrName, JSON.stringify(value));
  }

  removeIfExistsLocalStorageByAttribute(attrName: string) {
    if (localStorage.getItem(attrName)) {
      localStorage.removeItem(attrName);
    }
  }

  getAccessDetailsFromLocalStorage(parameter?: string) {
    const accessTokenDetailsString = localStorage.getItem('accessTokenDetails');
    const ACCESS_TOKEN_DETAILS = accessTokenDetailsString ? JSON.parse(accessTokenDetailsString) : null;
    if (ACCESS_TOKEN_DETAILS && parameter && ACCESS_TOKEN_DETAILS[parameter]) {
      return ACCESS_TOKEN_DETAILS[parameter];
    } else {
      return ACCESS_TOKEN_DETAILS;
    }
  }

  clearAllLocalStorage() {
    localStorage.clear();
  }

  getLocalStorageByAttribute(attrName: string) {
    const item = localStorage.getItem(attrName);
    return item ? JSON.parse(item) : null;
  }

  getRoleFromLocalStorage(): string | null {
    return this.getAccessDetailsFromLocalStorage('roleCode');
  }
}
