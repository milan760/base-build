import { Injectable } from '@angular/core';
import { HttpClientService } from '../../../services/httpClient/http-client.service';
import { AppConstants } from '../../../app.constant';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UacService {

  public UAC_URL: any;
  public MDM_URL: any;

  constructor(
    private httpClient: HttpClientService
  ) {
    this.UAC_URL = AppConstants.BASE_API_URL + "uac/";
    this.MDM_URL = AppConstants.BASE_API_URL + "mdm/";
  }

  // UAC Role
  public createOrUpdateRole(data: any) {
    return this.httpClient.post(this.UAC_URL + "addOrUpdateRole", data);
  }
  public getRoleList(data: any): Observable<any> {
    return this.httpClient.post(this.UAC_URL + "getAllRoles", data);
  }

  // UAC User
  public createOrUpdateUser(data: any): Observable<any> {
    return this.httpClient.postFD(this.UAC_URL + "createOrUpdateUser", data);
  }
  public getUsersList(data: any) {
    return this.httpClient.post(this.UAC_URL + "getAllUsers", data);
  }

  // UAC Resource
  public createOrUpdateResource(data: any) {
    return this.httpClient.post(this.UAC_URL + "addResource", data);
  }
  public getAllResource(data: { flatOrNested: String, roleId: Number, mappedAndAll: Boolean }): Observable<any> {
    return this.httpClient.post(this.UAC_URL + "getAllResource", data);
  }

  // UAC Role Resource Mapping
  public addRoleResource(data: any) {
    return this.httpClient.post(this.UAC_URL + "addRoleResource", data);
  }

  public getAllIcons(pagObj: any) {
    return this.httpClient.post(this.MDM_URL + "getAllIcons", pagObj);
  }

}
