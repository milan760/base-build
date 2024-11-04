import { Component, HostListener } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { ToastrClientService } from '../../services/toastr/toastr-client.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ActivatedRoute, Router } from '@angular/router';
import { DynamicFormService } from './service/dynamic-form.service';
import { CommonModule } from '@angular/common';
import { slideInOutAnimation } from '../../services/animation/slide-in-out.animation';

@Component({
  selector: 'app-dynamic-form',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './dynamic-form.component.html',
  styleUrl: './dynamic-form.component.scss',
  animations: [slideInOutAnimation]
})
export class DynamicFormComponent {

  public slideState = '';
  public myform!: FormGroup;
  public isWizardVisible = false
  public showSideItem = false
  public selectedIndex = -1;
  public counter = 0
  public isToggled: boolean = false;
  public formId: any;
  public isEdit = 0;
  public formStructureSubject: BehaviorSubject<any> = new BehaviorSubject(null);

  constructor(
    private fb: FormBuilder,
    private toastr: ToastrClientService,
    private dynamicService: DynamicFormService,
    private spinner: NgxSpinnerService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.createFormInstance();
    this.addNewControl();
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe((params: any) => {
      this.formId = params.id
    })

    if (this.formId != undefined) {
      this.isEdit = 1;
      this.getSingleFormById();
    }
  }

  private createFormInstance() {
    this.myform = this.fb.group({
      formName: ['Untitled Form'],
      controls: this.fb.array([]),
      id: [''],
      // button:['Submit']
    })

    this.myform.valueChanges.subscribe(formData => {
      this.formStructureSubject.next(formData);
    });

  }


  public addNewControl() {
    const add = this.myform.get('controls') as FormArray;
    this.counter++
    add.push(
      this.fb.group({
        control_id: [''],
        id: [''],
        labelName: [`Untitled Label ${this.counter}`],
        formControlname: [`UntitledLabel${this.counter}`],
        inputType: ['text'],
        placeholder: [''],
        required: [false],
        min: ['0'],
        max: ['0'],
        checkBoxOptions: this.fb.array([]),
        radioOptions: this.fb.array([]),
        dropDownOptions: this.fb.array([])
      })
    )

  }

  public addNewDropdownOptions(id: any) {
    const formArray = this.myform.get('controls') as FormArray;
    const dropdownOptionsArray = formArray.at(id).get('dropDownOptions') as FormArray;

    dropdownOptionsArray.push(
      this.fb.group({
        optionDesc: [''],
        id: [],
      })
    )
  }


  public addNewCheckboxOptions(id: any) {
    const formArray = this.myform.get('controls') as FormArray;
    const checkBoxOptionsArray = formArray.at(id).get('checkBoxOptions') as FormArray;

    checkBoxOptionsArray.push(
      this.fb.group({
        id: [],
        optionDesc: ['']
      })
    );
  }
  public addNewRadioOptions(id: any) {
    const formArray = this.myform.get('controls') as FormArray;
    const radioOptionsArray = formArray.at(id).get('radioOptions') as FormArray;

    radioOptionsArray.push(
      this.fb.group({
        id: [],
        optionDesc: ['']
      })
    );
  }

  public removeOptions(outerIndex: any, innerIndex: any, name: any) {
    const formArray = this.myform.get('controls') as FormArray;
    const checkBoxOptionsArray = formArray.at(outerIndex).get(name) as FormArray;
    checkBoxOptionsArray.removeAt(innerIndex);
  }

  // public removeDropdownOptions(outerIndex,innerIndex) {
  //   const formArray = this.myform.get('controls') as FormArray;
  //   const checkBoxOptionsArray = formArray.at(outerIndex).get('dropDownOptions') as FormArray;
  //   checkBoxOptionsArray.removeAt(innerIndex);
  // }

  // public removeCheckboxOptions(outerIndex,innerIndex) {
  //   const formArray = this.myform.get('controls') as FormArray;
  //   const checkBoxOptionsArray = formArray.at(outerIndex).get('checkBoxOptions') as FormArray;
  //   checkBoxOptionsArray.removeAt(innerIndex);
  // }

  public reset(index: any, controlName: any) {
    const formArray = this.myform.get('controls') as FormArray;
    const checkBoxOptionsArray = formArray.at(index).get(controlName) as FormArray;
    checkBoxOptionsArray.clear();
  }

  get control(): FormArray {
    return this.myform.get('controls') as FormArray;
  }

  public removeControl(index: any) {
    const add = this.myform.get('controls') as FormArray;
    if (add.length == 1) {
      this.toastr.infoToastr('You can\'t remove it. ');
      return;
    }
    add.removeAt(index);
  }

  public focusFormName(event: MouseEvent) {
    event.stopPropagation();
    this.isWizardVisible = !this.isWizardVisible;
  }

  public select(event: MouseEvent, currentIndex: any) {
    this.selectedIndex = currentIndex
    event.stopPropagation();
    // this.showSideItem = true;
  }

  @HostListener('document:click', ['$event'])
  public handleClick(event: MouseEvent) {
    if (!this.isClickInside(event)) {
      // this.showSideItem = false;
      this.selectedIndex = -1;
      this.isWizardVisible = false;
    }
  }

  private isClickInside(event: MouseEvent): boolean {
    const element = event.target as HTMLElement;
    return element.closest('.group') !== null || element.closest('.side-items') !== null;
  }

  // ----------------*************--------------
  toggle(index: any) {
    // this.isToggled = !this.isToggled;
    let ind = this.control.at(index).get('required');
    let val: any
    if (ind) {
      val = ind.value;
      ind.setValue(val);
    }
    val = !val;
  }

  public submit(formValue: any) {
    if (this.isEdit) {
      const controlsArray = this.myform.get('controls') as FormArray;
      controlsArray.controls.forEach((control: AbstractControl) => {
        const controlGroup = control as FormGroup;  // Typecast to FormGroup
        controlGroup.get('control_id')?.disable();
        controlGroup.get('id')?.disable();
      });
    }

    this.spinner.show();
    this.dynamicService.saveDynamicFormDetails(this.myform.value).subscribe(
      res => {
        if (res) {
          if (res.status == 1) {
            this.spinner.hide();
            this.toastr.successToastr(res.statusDesc);

          }
          if (!this.isEdit) {
            this.counter = 0;
            this.createFormInstance();
            this.addNewControl();
          } else {
            this.router.navigateByUrl('/pages/sysadmin/dashboard');
          }
        }
      },
      err => {
        this.spinner.hide();
        this.toastr.dangerToastr("Oops!,Something went wrong. Please try again.");
      },
      () => {


      }
    )
  }

  public onSelectInputType(event: any, i: any) {
    const formArray = this.myform.get('controls') as FormArray;
    if (event.target.value == 'checkbox') {
      const checkBoxOptionsArray = formArray.at(i).get('checkBoxOptions') as FormArray;
      checkBoxOptionsArray.clear();
      this.addNewCheckboxOptions(i);
    }
    if (event.target.value == 'radio') {
      const checkBoxOptionsArray = formArray.at(i).get('radioOptions') as FormArray;
      checkBoxOptionsArray.clear();
      this.addNewRadioOptions(i);
    }
    if (event.target.value == 'dropdown') {
      const checkBoxOptionsArray = formArray.at(i).get('dropDownOptions') as FormArray;
      checkBoxOptionsArray.clear();
      this.addNewDropdownOptions(i);
    }
  }

  public onChangeLabelName(event: any, i: any) {
    let val = event.target.value.replace(/\s/g, "");
    let formControlname = this.control.at(i).get('formControlname');
    if (formControlname) {
      formControlname.setValue(val + i);
    }
  }

  public toggleSlide() {
    this.slideState = this.slideState == 'in' ? 'out' : 'in';
  }

  onDragStarted(index: number) {
  }

  onDragEnded(index: number) {

  }

  drop(event: any) { }

  // drop(event: CdkDragDrop<string[]>) {
  //   const controls = this.myform.get('controls') as FormArray;
  //   moveItemInArray(controls.controls, event.previousIndex, event.currentIndex);
  //   controls.controls.forEach((control, index) => {
  //     control.setValue(controls.at(index).value);
  //   });
  // }

  // selectAllText(inputElement: HTMLInputElement) {
  //   // Select all text in the input field
  //   inputElement.select();
  // }

  selectAllText(target: EventTarget | null): void {
    const inputElement = target as HTMLInputElement;  // Typecast to HTMLInputElement
    if (inputElement) {
      inputElement.select();  // Select all text in the input
    }
  }

  public getSingleFormById() {
    this.spinner.show();
    this.dynamicService.getSingleFormById(this.formId).subscribe(
      res => {
        if (res.status == 1) {
          this.setFormValue(res.data);
          this.spinner.hide();
        }
      },
      err => {
      },
      () => {

      }
    )
  }

  public setFormValue(data: any) {
    const controls = this.myform.get('controls') as FormArray;
    controls.clear();
    let formName = this.myform.get('formName');
    if (formName) {
      formName.setValue(data.formName);
    }
    let id = this.myform.get('id');
    if (id) {
      id.setValue(data.id);
    }
    data.controls.forEach((item: any) => {
      controls.push(this.fb.group({
        control_id: [item.control_id],
        id: [item.id],
        labelName: [item.labelName],
        formControlname: [item.formControlname],
        inputType: [item.inputType],
        placeholder: [item.placeholder],
        required: [item.required],
        min: [item.min],
        max: [item.max],
        checkBoxOptions: this.setOptions(item.checkBoxOptions),
        radioOptions: this.setOptions(item.radioOptions),
        dropDownOptions: this.setOptions(item.dropDownOptions)
      }))
    })

  }

  setOptions(event: any) { }

  // setOptions(options: any[]): FormArray {
  //   const optionsArray = this.fb.array([]);
  //   if (options && options.length > 0) {
  //     options.forEach(option => {
  //       optionsArray.push(this.fb.group({
  //         id: [option.id],
  //         optionDesc: [option.optionDesc]
  //       }));
  //     });
  //   }
  //   return optionsArray;
  // }

  get formArrayControls(): FormArray {
    return this.myform.get('controls') as FormArray;
  }

  asFormGroup(control: AbstractControl): FormGroup {
    return control as FormGroup;
  }

  makeAsFormGroup(control: AbstractControl) {
    return control as FormGroup;
  }

  makeAsFormArray(control: AbstractControl) {
    return control as FormArray;
  }
}
