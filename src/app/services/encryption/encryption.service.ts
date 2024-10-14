import { Injectable } from '@angular/core';
import { AppConstants } from '../../app.constant';
import * as CryptoJS from 'crypto-js';

@Injectable({
  providedIn: 'root'
})
export class EncryptionService {

  constructor() { }

  public encryptPasswordWithSalt(password: string, salt: string) {
    const PASSWORD = this.encodePassword(password, AppConstants.PASSWORD_ENCODING_TIMES);
    const ENC_PASS = this.encodePassword(PASSWORD + '#' + salt, AppConstants.PASSWORD_ENCODING_TIMES_WITH_SALT);
    return ENC_PASS;
  }

  public encodePassword(data: string, noOfTimes: number) {
    let password: any = data;
    while (noOfTimes > 0) {
      password = this.sha512Hash(password);
      noOfTimes--;
    }
    return password;
  }

  private sha512Hash(data: any): string {
    try {
      return CryptoJS.SHA512(data).toString();
    } catch (error) {
      console.log(error);
      return '';
    }
  }

  public encodeTotalSession(data: string) {
    let itemValue: any = data; let counter = AppConstants.DECODE_ITERATOR;
    while (counter > 0) {
      itemValue = this.encryptData(data, AppConstants.DECODE_KEY);
      counter--;
    }
    return itemValue;
  }

  private encryptData(data: string, key: any) {
    try {
      return CryptoJS.AES.encrypt(JSON.stringify(data), key).toString();
    } catch (error) {
      console.log(error);
      return '';
    }
  }

  public encodeKeyValue(data: string, keyValue: string) {
    let itemValue = data; let counter = AppConstants.ITEM_ENCODE_ITERATOR;
    while (counter > 0) {
      itemValue = this.encryptData(data, keyValue);
      counter--;
    }
    return itemValue;
  }

  public decodeTotalSession(data: any) {
    let itemValue = data; let counter = AppConstants.DECODE_ITERATOR;
    while (counter > 0) {
      itemValue = this.decryptData(data, AppConstants.DECODE_KEY);
      counter--;
    }
    return itemValue;
  }

  private decryptData(data: any, key: any) {
    try {
      const bytes = CryptoJS.AES.decrypt(data, key);
      if (bytes.toString()) {
        return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
      }
      return bytes;
    } catch (error) {
      console.log(error);
    }
  }

  public generateSalt(saltLength: number) {
    try {
      return CryptoJS.lib.WordArray.random(Math.ceil(saltLength / 2)).toString(CryptoJS.enc.Hex).slice(0, saltLength);
    } catch (error) {
      console.log(error);
      return '';
    }
  }
}
