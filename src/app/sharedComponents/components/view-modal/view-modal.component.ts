import { Component, Input } from '@angular/core';
import { LegendFieldsetLabelValue } from '../../../model/legend-fieldset-value.model';
import { ExtractValuePipe } from '../../pipes/extract-value.pipe';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-view-modal',
  standalone: true,
  imports: [CommonModule, ExtractValuePipe],
  templateUrl: './view-modal.component.html',
  styleUrl: './view-modal.component.scss'
})
export class ViewModalComponent {

  [key: string]: any;

  @Input('receivedData') public receivedData!: { // coming from parent component where this component is rendered
    whichArrayToLoop: string; // used to hold the variable name present in this this component, which is to used to loop in html of this component.
    dataRowObj: object; // to hold the object (entity) or (single <tr>) of the table which contains the data to display in (key: value) pair
  }

  Resource: Array<LegendFieldsetLabelValue> = [
    {
      legend: 'Resource Details',
      isActive: 1,
      fieldSetLoops: [
        { lblDsply: 'Resource ID', valKey: 'resourceId', dataType: 'number' },
        { lblDsply: 'Parent Resource Id', valKey: 'parentResourceId', dataType: 'number' },
        { lblDsply: 'Resource Name', valKey: 'name', dataType: 'string' },
        { lblDsply: 'Resource Description', valKey: 'description', dataType: 'string' },
        { lblDsply: 'Has Submenu', valKey: 'hasSubMenu', dataType: 'boolean' },
        { lblDsply: 'Level', valKey: 'level', dataType: 'number' },
        { lblDsply: 'Order', valKey: 'orderIn', dataType: 'number' },
        { lblDsply: 'Path', valKey: 'path', dataType: 'string' },
        { lblDsply: 'Mapped', valKey: 'mapped', dataType: 'boolean' },
        { lblDsply: 'Icon', valKey: 'icon', dataType: 'string' },
        { lblDsply: 'ResponseDTOs', valKey: 'responseDTOs', dataType: 'string' },
        { lblDsply: 'Status', valKey: 'statusId', dataType: 'number' },
        { lblDsply: 'Created By', valKey: 'createdBy', dataType: 'string' },
        { lblDsply: 'Created On', valKey: 'createdOn', dataType: 'date' },
        { lblDsply: 'Updated By', valKey: 'updatedBy', dataType: 'string' },
        { lblDsply: 'Updated On', valKey: 'updatedOn', dataType: 'date' },
      ]
    }
  ]
}
