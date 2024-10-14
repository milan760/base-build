import { Injectable } from "@angular/core";
import { environment } from "../environments/environment";

@Injectable({
    providedIn: 'root'
})

export class AppConstants {

    public static get BASE_API_URL(): string {
        if (environment.production) {
            // PRODUCTION SERVER PATH
            const SERVER_LOC = (window.location.href).split('#')[0].split('/')[2];

            return 'http://' + SERVER_LOC + '/ec-management/api/v1/';
        } else {
            // DEVELOPMENT SERVER PATH
            // return 'http://localhost:8084/nta/api/v1/';
            return 'http://192.168.0.131:8084/ssepd/api/v1/';
        }
    }
    public static ACCESS_DETAILS: any = {};
    public static get AUTHORIZATION_HEADER(): any {
        let accessTokenDetails = localStorage.getItem('accessTokenDetails');
        if (accessTokenDetails) {
            return 'Bearer ' + JSON.parse(accessTokenDetails)['token'];
        }
        else {
            return null;
        }
    }
    // PASSWORD ENCODING TIME
    public static PASSWORD_ENCODING_TIMES = 2;
    public static PASSWORD_ENCODING_TIMES_WITH_SALT = 1;

    // NORMAL ENCODING TIME
    public static ITEM_ENCODE_ITERATOR = 1;
    public static DECODE_ITERATOR = 1;
    public static DECODE_KEY = '0eef9a9d9ccb8ea0fbb21e03ad2c6609e1b98de53c0bcd084c23c0ca8376f6c7'; // 'MY SESSION STORAGE ENCODING TEST';


}