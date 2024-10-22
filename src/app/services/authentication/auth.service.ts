import { Injectable } from '@angular/core';
import { HttpClientService } from '../httpClient/http-client.service';
import { AppConstants } from '../../app.constant';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private httpClient: HttpClientService,
    // public jwtHelper: JwtHelperService
  ) { }

  getCaptchaWithCaptchaKeyHeader() {
    return this.httpClient.getCaptchaWithCaptchaKeyHeader(AppConstants.BASE_API_URL + 'auth/getCaptcha');
  }

  login(data: object, captchaKey: any) {
    return this.httpClient.postAuth(AppConstants.BASE_API_URL + 'auth/login', data, captchaKey);
  }

  logout(data: any) {
    return this.httpClient.put(AppConstants.BASE_API_URL + "uac/logout", data);
  }

  // isAuthenticated(): boolean {
  //   const tokenDetails: any = localStorage.getItem('accessTokenDetails');
  //   const token = tokenDetails['access_token'];
  //   return !this.jwtHelper.isTokenExpired(token);
  // }
}
