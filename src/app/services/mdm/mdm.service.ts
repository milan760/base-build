import { Injectable } from '@angular/core';
import { HttpClientService } from '../httpClient/http-client.service';
import { AppConstants } from '../../app.constant';

@Injectable({
  providedIn: 'root'
})
export class MdmService {

  public MDM_URL: any = '';
  public PROFILE_URL: any = '';
  public RESOURCE_REGISTER_URL: any = '';
  public DYN_URL: any = '';

  constructor(
    private httpClient: HttpClientService
  ) {
    this.MDM_URL = AppConstants.BASE_API_URL + "mdm/";
    this.PROFILE_URL = AppConstants.BASE_API_URL + "profiles/"
    this.RESOURCE_REGISTER_URL = AppConstants.BASE_API_URL + "resourceregister/"
    this.DYN_URL = AppConstants.BASE_API_URL + "dyn/"
  }

  public getAllExamConductingAgency() {
    return this.httpClient.getNoAuth(this.MDM_URL + "getAllExamConductingAgency");
  }

  // profile api
  public profileDetails() {
    return this.httpClient.get(this.PROFILE_URL + "userProfileDetails");
  }
  public updateProfile(data: any) {
    return this.httpClient.post(this.PROFILE_URL + "updateProfileDetails", data);
  }
  public createPassword(data: any) {
    return this.httpClient.post(this.PROFILE_URL + "changePassword", data);
  }

  // Resource api
  public getAllResourceByAuthenticatingRole() {
    return this.httpClient.get(AppConstants.BASE_API_URL + "uac/getAllResourceByAuthenticatingRole");
  }
  public getResourceDetailsByRoleName() {
    return this.httpClient.get(this.RESOURCE_REGISTER_URL + "getResourceDetailsByRoleName");
  }

  // =========================================================================================
  //                                          Dynamic Form API
  // =========================================================================================

  public saveDynamicFormDetails(data: any) {
    return this.httpClient.post(this.DYN_URL + "saveOrUpdateDynamicFormDetails", data);
  }
  public getAllDynamicFormDetails(data: any) {
    return this.httpClient.post(this.DYN_URL + "getAllDynamicFormDetails", data);
  }

  public getSingleFormById(formId: any) {
    return this.httpClient.get(this.DYN_URL + "getSingleFormById/" + formId)
  }

  public deleteFormById(formId: any) {
    return this.httpClient.get(this.DYN_URL + "deleteFromById/" + formId)
  }
}
