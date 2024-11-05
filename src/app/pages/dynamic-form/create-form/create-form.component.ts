import { Component, HostListener } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { NgxSpinnerService } from 'ngx-spinner';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { slideInOutAnimation } from '../../../services/animation/slide-in-out.animation';
import { ToastrClientService } from '../../../services/toastr/toastr-client.service';
import { DynamicFormService } from '../service/dynamic-form.service';
import { PreviewComponent } from '../preview/preview.component';

@Component({
  selector: 'app-create-form',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, PreviewComponent],
  templateUrl: './create-form.component.html',
  styleUrl: './create-form.component.scss',
  animations: [slideInOutAnimation]
})
export class CreateFormComponent {

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

  createFormInstance() {
    this.myform = this.fb.group({
      id: [''],
      formName: ['Untitled Form'],
      controls: this.fb.array([])
    })

    this.myform.valueChanges.subscribe(formData => {
      this.formStructureSubject.next(formData);
    });
  }

  addNewControl() {
    const add = this.myform.get('controls') as FormArray;
    this.counter++;
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

  ngOnInit(): void {
    this.route.queryParams.subscribe((params: any) => {
      this.formId = params.id
    })

    if (this.formId !== undefined) {
      this.isEdit = 1;
      this.getSingleFormById();
    }
  }

  getSingleFormById() {
    this.spinner.show();
    this.dynamicService.getSingleFormById(this.formId).subscribe({
      next: (res: any) => {
        if (res) {
          if (res.status == 1) {
            this.setFormValue(res.data);
          } else {
            this.toastr.infoToastr(res.statusDesc);
          }
        }
      },
      error: (err) => {
        console.error('Error fetching captcha:', err);
        this.spinner.hide();
      },
      complete: () => {
        this.spinner.hide();
      }
    })
  }

  setFormValue(data: any) {
    const controls = this.myform.get('controls') as FormArray;
    controls.clear();
    this.myform.get('formName')?.setValue(data.formName);
    this.myform.get('id')?.setValue(data.id);
    data.controls.forEach((item: { control_id: any; id: any; labelName: any; formControlname: any; inputType: any; placeholder: any; required: any; min: any; max: any; checkBoxOptions: any; radioOptions: any; dropDownOptions: any; }) => {
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

  setOptions(options: any[]): FormArray<FormGroup> {

    // Define optionsArray as a FormArray of FormGroups
    const optionsArray = this.fb.array<FormGroup>([]);

    if (options && options.length > 0) {
      options.forEach(option => {

        // Create a FormGroup for each option
        const optGrp = this.fb.group({
          id: new FormControl(option.id),
          optionDesc: new FormControl(option.optionDesc)
        });

        // Push the FormGroup to the FormArray
        optionsArray.push(optGrp);
      });
    }

    return optionsArray;
  }

  submit() {
    if (this.isEdit) {
      const controlsArray = this.myform.get('controls') as FormArray;
      controlsArray.controls.forEach((control: AbstractControl) => {
        const controlGroup = control as FormGroup;  // Typecast to FormGroup
        controlGroup.get('control_id')?.disable();
        controlGroup.get('id')?.disable();
      });
    }

    this.spinner.show();

    this.dynamicService.saveDynamicFormDetails(this.myform.value).subscribe({
      next: (res) => {
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
            this.router.navigateByUrl('/pages/dynamic-form/dashboard');
          }
        }
      },
      error: (err) => {
        this.spinner.hide();
        this.toastr.dangerToastr("Oops!, Something went wrong. Please try again.");
      },

    });
  }

  @HostListener('document:click', ['$event'])
  handleClick(event: MouseEvent) {
    if (!this.isClickInside(event)) {
      // this.showSideItem = false;
      this.selectedIndex = -1;
      this.isWizardVisible = false;
    }
  }

  isClickInside(event: MouseEvent): boolean {
    const element = event.target as HTMLElement;
    console.log('element', element);
    console.log(element.closest('.group'), element.closest('.side-items'));
    return element.closest('.group') !== null || element.closest('.side-items') !== null;
  }

  onSelectInputType(event: any, i: any) {
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

  addNewCheckboxOptions(id: any) {
    const formArray = this.myform.get('controls') as FormArray;
    const checkBoxOptionsArray = formArray.at(id).get('checkBoxOptions') as FormArray;

    checkBoxOptionsArray.push(
      this.fb.group({
        id: [],
        optionDesc: ['']
      })
    );
  }

  addNewRadioOptions(id: any) {
    const formArray = this.myform.get('controls') as FormArray;
    const radioOptionsArray = formArray.at(id).get('radioOptions') as FormArray;

    radioOptionsArray.push(
      this.fb.group({
        id: [],
        optionDesc: ['']
      })
    );
  }

  addNewDropdownOptions(id: any) {
    const formArray = this.myform.get('controls') as FormArray;
    const dropdownOptionsArray = formArray.at(id).get('dropDownOptions') as FormArray;

    dropdownOptionsArray.push(
      this.fb.group({
        optionDesc: [''],
        id: [],
      })
    )
  }

  removeOptions(outerIndex: any, innerIndex: any, name: any) {
    const formArray = this.myform.get('controls') as FormArray;
    const checkBoxOptionsArray = formArray.at(outerIndex).get(name) as FormArray;
    checkBoxOptionsArray.removeAt(innerIndex);
  }

  reset(index: any, controlName: any) {
    const formArray = this.myform.get('controls') as FormArray;
    const checkBoxOptionsArray = formArray.at(index).get(controlName) as FormArray;
    checkBoxOptionsArray.clear();
  }

  get formArrayControls(): FormArray {
    return this.myform.get('controls') as FormArray;
  }

  asFormGroup(control: AbstractControl): FormGroup {
    return control as FormGroup;
  }

  makeAsFormGroup(control: AbstractControl) {
    return control as FormGroup;
  }

  asFormArray(control: AbstractControl | null): FormArray {
    return control as FormArray || this.fb.array([]);
  }

  getCheckBoxOptionsControls(i: number): AbstractControl[] {
    const formArray = this.myform.get('controls') as FormArray;
    const checkBoxOptionsArray = formArray.at(i).get('checkBoxOptions') as FormArray;
    return checkBoxOptionsArray?.controls || [];
  }

  getRadioOptionsControls(i: number): AbstractControl[] {
    const formArray = this.myform.get('controls') as FormArray;
    const radioOptionsArray = formArray.at(i).get('radioOptions') as FormArray;
    return radioOptionsArray?.controls || [];
  }

  getdropDownOptionsControls(i: number): AbstractControl[] {
    const formArray = this.myform.get('controls') as FormArray;
    const dropDownOptionsArray = formArray.at(i).get('dropDownOptions') as FormArray;
    return dropDownOptionsArray?.controls || [];
  }

  // ***********************************************


  // removeDropdownOptions(outerIndex,innerIndex) {
  //   const formArray = this.myform.get('controls') as FormArray;
  //   const checkBoxOptionsArray = formArray.at(outerIndex).get('dropDownOptions') as FormArray;
  //   checkBoxOptionsArray.removeAt(innerIndex);
  // }

  // removeCheckboxOptions(outerIndex,innerIndex) {
  //   const formArray = this.myform.get('controls') as FormArray;
  //   const checkBoxOptionsArray = formArray.at(outerIndex).get('checkBoxOptions') as FormArray;
  //   checkBoxOptionsArray.removeAt(innerIndex);
  // }

  get control(): FormArray {
    return this.myform.get('controls') as FormArray;
  }

  removeControl(index: any) {
    const add = this.myform.get('controls') as FormArray;
    if (add.length == 1) {
      this.toastr.infoToastr('You can\'t remove it. ');
      return;
    }
    add.removeAt(index);
  }

  focusFormName(event: MouseEvent) {
    event.stopPropagation();
    this.isWizardVisible = !this.isWizardVisible;
  }

  select(event: MouseEvent, currentIndex: any) {
    this.selectedIndex = currentIndex
    event.stopPropagation();
    // this.showSideItem = true;
  }

  selectAllText(target: EventTarget | null): void {
    const inputElement = target as HTMLInputElement;  // Typecast to HTMLInputElement
    if (inputElement) {
      inputElement.select();  // Select all text in the input
    }
  }

  // ----------------*************--------------
  toggle(index: any) {
    let ind = this.control.at(index).get('required');
    let val: any
    if (ind) {
      val = ind.value;
      ind.setValue(val);
    }
    val = !val;
  }

  onChangeLabelName(event: any, i: any) {
    let val = event.target.value.replace(/\s/g, "");
    let formControlname = this.control.at(i).get('formControlname');
    if (formControlname) {
      formControlname.setValue(val + i);
    }
  }

  toggleSlide() {
    this.slideState = this.slideState == 'in' ? 'out' : 'in';
  }

  onDragStarted(index: number) { }

  onDragEnded(index: number) { }

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

}
