import { Component, ElementRef, EventEmitter, Input, OnInit, Output, Renderer2, ViewChild } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { FormInput } from 'src/app/core/models/form-input.model';

@Component({
  selector: 'app-form-input-builder',
  templateUrl: './form-input-builder.component.html'
})
export class FormInputBuilderComponent implements OnInit {
  @ViewChild('selectDropdown') selectDropdown: ElementRef;
  questionTypes: string[] = ['Short answer', 'Paragraph', 'Multiple choice']
  type:string = 'Short answer';
  formInputBuilder: FormGroup;
  selectOptions = new FormArray([]);
  @Input() name: string;
  @Input() index: number;
  @Input() childSubject: BehaviorSubject<{
    name: string,
    data: FormInput,
    valid: boolean
  }>;
  @Output() removeQuestion = new EventEmitter<{
    name: string,
    index:number,
    childSubject: BehaviorSubject<{
      name: string,
      data: FormInput,
      valid: boolean
    }>}>(null);
  formValid = false;
  showDropdown = false;


  constructor(
    private renderer: Renderer2
  ) { 
  }

  get optionsControls() {
    return (this.formInputBuilder.get('selectOptions') as FormArray).controls;
  }

  ngOnInit() {
    // check if params includes an edit and form id parameter - if so, load form control
    this.initSelectForm();
    this.selectOptions.push(new FormGroup({
      option: new FormControl(null, Validators.required)
    }));
    this.selectOptions.push(new FormGroup({
      option: new FormControl(null, Validators.required)
    }));
    this.formInputBuilder.valueChanges.subscribe(() => {
      if (this.formInputBuilder.status === "INVALID") {
        this.formValid = false;
      } else {
        this.formValid = true;
      }
      this.handleValueChanges();
    })
  }

  initSelectForm() {
    this.formInputBuilder = new FormGroup({
      'inputType': new FormControl('Short answer'),
      'inputText': new FormControl(null, Validators.required),
      'selectedOptions': new FormArray([]),
      'multiselect': new FormControl(false),
      'required': new FormControl(false)
    });
  }

  onChangeType(val) {
    this.formInputBuilder.patchValue({
      inputType: val
    })

    if (val === 'Multiple choice') {
      this.formInputBuilder.addControl('selectOptions', this.selectOptions);
    } else {
      this.formInputBuilder.removeControl('selectOptions');
    }

    this.type = val;
    this.toggleDropdown();
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

  onRemoveOption(index) {
    (<FormArray>this.formInputBuilder.get('selectOptions')).removeAt(index);
  }

  handleValueChanges() {
    let formInputOptions = [];
    if (this.formInputBuilder.get('inputType').value === 'Multiple choice') {
      formInputOptions = this.formInputBuilder.get('selectOptions').value.map((value) => {
        return value.option;
      });
    }
    let formInput = new FormInput(
      this.formInputBuilder.get('inputType').value,
      this.formInputBuilder.get('inputText').value,
      formInputOptions,
      this.formInputBuilder.get('multiselect').value,
      this.formInputBuilder.get('required').value
    )
    this.childSubject.next({
      name: this.childSubject.value.name,
      data: formInput,
      valid: this.formValid
    })
  }
  
  toggleDropdown() {
    if (!this.showDropdown) {
      this.renderer.removeClass(this.selectDropdown.nativeElement, 'invisible');
    } else {
      this.renderer.addClass(this.selectDropdown.nativeElement, 'invisible');
    }
    this.showDropdown = !this.showDropdown;
  }

  onRemoveQuestion() {
    this.removeQuestion.emit({
      name: this.name, 
      index: this.index,
      childSubject: this.childSubject
    });
  }
}
