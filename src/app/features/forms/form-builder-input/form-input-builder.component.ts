import { Component, Input, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { FormInput } from 'src/app/core/models/form-input.model';

@Component({
  selector: 'app-form-input-builder',
  templateUrl: './form-input-builder.component.html'
})
export class FormInputBuilderComponent implements OnInit {
  questionTypes: string[] = ['Short answer', 'Paragraph', 'Multiple choice']
  editMode = false;
  type:string = 'Short answer';
  formInputBuilder: FormGroup;
  selectOptions = new FormArray([]);
  
  constructor() { 
  }

  get optionsControls() {
    return (this.formInputBuilder.get('selectOptions') as FormArray).controls;
  }

  ngOnInit() {
    this.initSelectForm();
    this.selectOptions.push(new FormGroup({
      option: new FormControl(null, Validators.required)
    }));
    this.selectOptions.push(new FormGroup({
      option: new FormControl(null, Validators.required)
    }));
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
      console.log(formInputOptions);
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
    // let formInput = new FormInput(this.formInputBuilder.value);
  }

  onChangeTest() {
    console.log(this.formInputBuilder.get('selectOptions') as FormArray);
  }
}
