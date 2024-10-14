import { Injectable } from '@angular/core';
import { AppConstants } from '../../app.constant';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CommonService {

  private storedDetails: any; // (primary purpose) used for data storing on edit button clicked from a row of a table.
  activeIndex = new Subject<any>();
  private isMenuActive$ = new BehaviorSubject<boolean>(false);

  constructor() { }

  storeDetails(data: any) {
    this.storedDetails = data;
    console.log('Common service : SETTING storedDetails', this.storedDetails);
  }

  getStoredDetails() {
    if (this.storedDetails) {
      console.log('Common service : GETTING storedDetails', this.storedDetails);
      return this.storedDetails;
    }
  }

  getMediaById(profilePic: string): string {
    const accessTokenDetails = localStorage.getItem('accessTokenDetails');
    const accessToken = accessTokenDetails ? JSON.parse(accessTokenDetails)['access_token'] : null;
    return AppConstants.BASE_API_URL + 'base/getUserMediaDetails?fileName=' + profilePic + '&access_token=' + accessToken;
  }

  setActiveIndex(ind: any) {
    this.activeIndex.next(ind);
  }

  toggleMainContentSize(isMenuActive: boolean) {
    this.isMenuActive$.next(isMenuActive);
  }

  getMenuState() {
    return this.isMenuActive$.asObservable();
  }
}
