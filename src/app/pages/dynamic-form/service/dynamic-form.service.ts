import { Injectable } from '@angular/core';
import { AppConstants } from '../../../app.constant';
import { HttpClientService } from '../../../services/httpClient/http-client.service';

@Injectable({
  providedIn: 'root'
})
export class DynamicFormService {

  public DYN_URL: any;

  constructor(
    private httpClient: HttpClientService,
  ) {
    this.DYN_URL = AppConstants.BASE_API_URL + "dyn/"
  }

  public saveDynamicFormDetails(data: any) {
    return this.httpClient.post(this.DYN_URL + "saveOrUpdateDynamicFormDetails", data);
  }
  public getAllDynamicFormDetails(data: any) {
    return this.httpClient.post(this.DYN_URL + "getAllDynamicFormDetails", data);
  }

  public getSingleFormById(formId: any) {
    return this.httpClient.get(this.DYN_URL + "getSingleFormById/" + formId);
  }

  public deleteFormById(formId: any) {
    return this.httpClient.get(this.DYN_URL + "deleteFromById/" + formId);
  }
}
