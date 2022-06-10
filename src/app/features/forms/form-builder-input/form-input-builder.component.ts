import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { FormInput } from 'src/app/core/models/form-input.model';

@Component({
  selector: 'app-form-input-builder',
  templateUrl: './form-input-builder.component.html'
})
export class FormInputBuilderComponent implements OnInit {
  questionTypes: string[] = ['Short answer', 'Paragraph', 'Multiple choice']
  type:string = 'Short answer';
  formInputBuilder: FormGroup;
  selectOptions = new FormArray([]);
  @Input() name: string;
  @Input() childSubject: BehaviorSubject<{
    name: string,
    data: FormInput,
    valid: boolean
  }>;
  @Output() createQuestionEvent: EventEmitter<{name: string, data: FormInput}> = new EventEmitter<{name:string, data: FormInput}>();
  editMode = false;
  formValid = false;
  submitted = false;

  // if form was submited and form is now invalid, we remove the formcontrol in the parent component
  constructor() { 
  }

  get optionsControls() {
    return (this.formInputBuilder.get('selectOptions') as FormArray).controls;
  }

  ngOnInit() {
    // check if params includes an edit and form id parameter - if so, load form control
    console.log(this.childSubject);
    this.initSelectForm();
    this.selectOptions.push(new FormGroup({
      option: new FormControl(null, Validators.required)
    }));
    this.selectOptions.push(new FormGroup({
      option: new FormControl(null, Validators.required)
    }));
    // listen to form changes
    this.formInputBuilder.valueChanges.subscribe(() => {
      // if (this.submitted && form is not valid anymore)
      if (this.formInputBuilder.status === "INVALID") {
        console.log("Inside form was changed, and is now invalid");
        if (this.submitted) {
          console.log("Was previously submitted so we need to mark it as invalid");
          this.childSubject.next({
            name: this.childSubject.value.name,
            data: null,
            valid: false
          })
        }
        this.formValid = false;
      } else {
        this.formValid = true;
      }
    })
  }

  initSelectForm() {
    this.formInputBuilder = new FormGroup({
      'inputType': new FormControl('Short answer'),
      'inputText': new FormControl(null, Validators.required),
      'inputAnswer': new FormControl(''),
      'selectedOptions': new FormArray([]),
      'multiselect': new FormControl(false),
      'required': new FormControl(false)
    });
  }

  onChangeType(event) {
    this.type = event.target.value;
    this.formInputBuilder.patchValue({
      inputType: event.target.value
    })

    if (event.target.value === 'Multiple choice') {
      this.formInputBuilder.addControl('selectOptions', this.selectOptions);
    } else {
      this.formInputBuilder.removeControl('selectOptions');
    }
  }

  toggleMultiSelect() {
    this.formInputBuilder.patchValue({
      multiselect: !this.formInputBuilder.get('multiselect').value
    })
  }

  toggleRequired() {
    this.formInputBuilder.patchValue({
      required: !this.formInputBuilder.get('required').value
    })
  }

  onAddOption() {
    (<FormArray>this.formInputBuilder.get('selectOptions')).push(
      new FormGroup({
        option: new FormControl(null, Validators.required)
      })
    )
  }

  onSubmit() {
    let formInputOptions = [];
    if (this.formInputBuilder.get('inputType').value === 'Multiple choice') {
      formInputOptions = this.formInputBuilder.get('selectOptions').value.map((value) => {
        return value.option;
      });
    }
    let formInput = new FormInput(
      this.formInputBuilder.get('inputType').value,
      this.formInputBuilder.get('inputText').value,
      '',
      formInputOptions,
      [],
      this.formInputBuilder.get('multiselect').value,
      this.formInputBuilder.get('required').value
    )
    if (this.editMode) {
      // update form
    } else {
      this.childSubject.next({
        name: this.childSubject.value.name,
        data: formInput,
        valid: true
      })
    }
    this.submitted = true;
    console.log("Form has been submitted");
  }

  onChangeTest() {
    console.log(this.formInputBuilder.get('selectOptions') as FormArray);
  }
}
