import { Injectable } from '@angular/core';
import { HttpClientService } from '../../../services/httpClient/http-client.service';
import { AppConstants } from '../../../app.constant';

@Injectable({
  providedIn: 'root'
})
export class MdmService {

  public MDM_URL: any;

  constructor(
    private httpClient: HttpClientService
  ) {
    this.MDM_URL = AppConstants.BASE_API_URL + "mdm/";
  }

  public getAllState() {
    return this.httpClient.get(this.MDM_URL + "getStateDetails");
  }

  public getAllDistrict() {
    return this.httpClient.get(this.MDM_URL + "getDistrictDetails");
  }

  public getAllIcons(pagObj: any) {
    return this.httpClient.post(this.MDM_URL + "getAllIcons", pagObj);
  }

  public createOrUpdateIcon(data: any) {
    return this.httpClient.post(this.MDM_URL + "createIcon", data);
  }
}
