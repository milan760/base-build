import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'extractValue',
  standalone: true
})
export class ExtractValuePipe implements PipeTransform {

  transform(interpolatedValue: unknown, trItem: any, tdObj: any): unknown {
    let key = tdObj.TDkey ? tdObj.TDkey : tdObj.valKey; // tdObj.TDkey is for table and tdObj.valKey is for modal
    let array = key.split('.');
    let returnValue = trItem;
    if (array.length > 1) { // if multiple keys
      // console.log('its object, key is: ', key, trItem);
      for (const ky of array) {
        if (returnValue) {
          returnValue = returnValue[ky];
        }
      }
      return returnValue;
    } else {
      // console.log('not object, key is: ', key, trItem);
      switch ((tdObj.TDdataType ? tdObj.TDdataType : tdObj.dataType)) { // tdObj.TDdataType is for table and tdObj.dataType is for modal
        case 'string':
          {
            returnValue = trItem[key];
          }
          break;
        case 'number':
          {
            returnValue = trItem[key];
          }
          break;
        case 'boolean':
          {
            returnValue = trItem[key];
          }
          break;
        case 'date':
          {
            returnValue = trItem[key];
          }
          break;
        case 'image':
          {
            returnValue = trItem[key];
          }
          break;
        default:
          break;
      }
      return returnValue;
    }
    // src='data:image/jpeg;base64,{{trItem[obj.TDkey]}}'
  }

}
