import { Injectable } from '@angular/core';
import { HttpClientService } from '../httpClient/http-client.service';
import { AppConstants } from '../../app.constant';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private httpClient: HttpClientService
  ) { }

  public getCaptchaWithCaptchaKeyHeader() {
    return this.httpClient.getCaptchaWithCaptchaKeyHeader(AppConstants.BASE_API_URL + 'auth/getCaptcha');
  }

  public login(data: object, captchaKey: any) {
    return this.httpClient.postAuth(AppConstants.BASE_API_URL + 'auth/login', data, captchaKey);
  }

  public logout(data:any) {
    return this.httpClient.put(AppConstants.BASE_API_URL + "uac/logout", data);
  }
}
