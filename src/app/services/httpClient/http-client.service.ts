import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { catchError } from 'rxjs/operators';
import { ErrorHandlerService } from '../errorHandler/error-handler.service';
import { AppConstants } from '../../app.constant';

@Injectable({
  providedIn: 'root'
})
export class HttpClientService {

  constructor(
    private http: HttpClient,
    private clientErrorHandler: ErrorHandlerService
  ) { }

  getCaptchaWithCaptchaKeyHeader(url: string): Observable<any> {
    const options = {
      headers: new HttpHeaders({ 'Content-Type': 'applicant/json' }),
      observe: 'response' as 'response',
      responseType: 'blob' as 'json',
    };
    return this.http.get(url, options);
  }

  getNoAuth(url: string, opt?: object): Observable<any> {
    const HEADERS = new HttpHeaders()
      .set('Content-Type', 'application/json')
    const options = opt ? opt : {
      headers: HEADERS,
      params: {}
    };
    return this.http.get(url, options).pipe(catchError(this.clientErrorHandler.handleError));
  }

  postAuth(url: string, data: object, captchaKey: any): Observable<any> {
    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'captchaKey': captchaKey
      }),
    };
    console.log('dafdssssssssdfggggggggggggggggggggggggggggggggggggggggggs')
    return this.http.post(url, data, options).pipe(catchError(this.clientErrorHandler.handleError));
  }

  post(url: string, data: object, opt?: object): Observable<any> {
    const accessToken = AppConstants.AUTHORIZATION_HEADER;
    const HEADERS = new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set('Authorization', accessToken);
    const options = opt ? opt : {
      headers: HEADERS,
      params: {}
    };
    return this.http.post(url, data, options).pipe(catchError(this.clientErrorHandler.handleError));
  }

  postFD(url: string, data: FormData, opt?: object): Observable<any> {
    const accessToken = AppConstants.AUTHORIZATION_HEADER;
    const headers = new HttpHeaders()
      .set('Authorization', accessToken);
    const options = opt ? opt : {
      headers,
      params: {}
    };
    console.log('data..................>>>>', data);
    return this.http.post(url, data, options).pipe(catchError(this.clientErrorHandler.handleError));
  }

  get(url: string, opt?: object): Observable<any> {
    // console.log('rGId', this.getRgId().toString());
    const accessToken = AppConstants.AUTHORIZATION_HEADER ? AppConstants.AUTHORIZATION_HEADER : '';
    // console.log(accessToken);
    const HEADERS = new HttpHeaders()
        .set('Content-Type', 'application/json')
        // .set('x-auth', accessToken)
        .set('Authorization', accessToken);
    // .set('rGId', this.getRgId().toString());
    const options = opt ? opt : {
        headers: HEADERS,
        params: {}
    };
    // console.log(options);
    return this.http.get(url, options).pipe(catchError(this.clientErrorHandler.handleError));
}

put(url: string, data: object, opt?: object): Observable<any> {
  const accessToken = AppConstants.AUTHORIZATION_HEADER;
  const headers = new HttpHeaders()
      .set('Content-Type', 'application/json; charset=utf-8')
      .set('Authorization', accessToken)
  const options = opt ? opt : {
      headers,
  };
  return this.http.put(url, data, options);
}
}
