import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { FormInputResponse } from 'src/app/core/models/form-input-response.model';
import { FormInput } from 'src/app/core/models/form-input.model';

@Component({
    selector: 'app-form-input-response',
    templateUrl: './form-input-response.component.html'
})
export class FormInputResponseComponent implements OnInit {
    @Input() inputQuestion: FormInput;
    @Input() inputQuestionName: string;
    @Input() childSubject: BehaviorSubject<{
        name: string,
        data: FormInputResponse,
        valid: boolean
    }>
    formInputResponseBuilder: FormGroup;
    formValid:boolean;

    constructor() {}

    ngOnInit() {
        console.log(this.inputQuestion);
        this.initFormGroup();
        this.formValid = this.inputQuestion.required ? false : true;
        this.formInputResponseBuilder.valueChanges.subscribe(() => {
            // check if form is still valid after values have been changed
            if (this.inputQuestion.required) {
                if (this.inputQuestion.inputType === 'Short answer' || this.inputQuestion.inputType === 'Paragraph') {
                    this.formValid = this.formInputResponseBuilder.get('inputAnswer').value.length > 0 ? true : false;
                    this.handleValueChanges();
                }
                if (this.inputQuestion.inputType === 'Multiple choice' && !this.inputQuestion.multiselect) {
                    this.formValid = this.formInputResponseBuilder.get(this.inputQuestionName).value.length > 0 ? true : false;
                    this.handleValueChanges();
                }
            } else {
                // we only need to update values in nonrequired inputs if a value has been provided
                if (this.inputQuestion.inputType === 'Short answer' || this.inputQuestion.inputType === 'Paragraph') {
                    if (this.formInputResponseBuilder.get('inputAnswer').value.length > 0) {
                        this.handleValueChanges();
                    }
                }
                if (this.inputQuestion.inputType === 'Multiple choice' && !this.inputQuestion.multiselect) {
                    if (this.formInputResponseBuilder.get(this.inputQuestionName).value.length > 0) {
                        this.handleValueChanges();
                    }
                }
            }
        })
    }

    initFormGroup() {
        this.formInputResponseBuilder = new FormGroup({
            'inputText': new FormControl(this.inputQuestion.inputText),
            'inputAnswer': new FormControl(''),
            'selectedOptions': new FormControl([]),
            'checkboxValues': new FormControl([])
        });
        this.formInputResponseBuilder.addControl(this.inputQuestionName, new FormControl(''));
    }

    updateSelectValues(event) {
        const selectedValue = event.target.value;
        const index = this.formInputResponseBuilder.get('checkboxValues').value.indexOf(selectedValue);
        if (index > -1) {
            this.formInputResponseBuilder.get('checkboxValues').value.splice(index, 1);
        } else {
            this.formInputResponseBuilder.get('checkboxValues').value.push(selectedValue);
        }
        if (this.inputQuestion.required) {
            if (this.formInputResponseBuilder.get('checkboxValues').value.length > 0) this.formValid = true;
            else this.formValid = false;
        }
        this.handleValueChanges();
    }

    handleValueChanges() {
        let formInputResponse;
        if (this.inputQuestion.inputType === 'Short answer' || this.inputQuestion.inputType === 'Paragraph') {
            formInputResponse = new FormInputResponse(
                this.inputQuestion.inputText,
                this.formInputResponseBuilder.get('inputAnswer').value,
                []
            )
        } else {
            if (!this.inputQuestion.multiselect) {
                formInputResponse = new FormInputResponse(
                    this.inputQuestion.inputText,
                    '',
                    [this.formInputResponseBuilder.get(this.inputQuestionName).value]
        
                )
            } else {
                formInputResponse = new FormInputResponse(
                    this.inputQuestion.inputText,
                    '',
                    this.formInputResponseBuilder.get('checkboxValues').value
        
                )
            }
        }
        this.childSubject.next({
            name: this.inputQuestionName,
            data: formInputResponse,
            valid: this.formValid
        })
    }

    testValidity(): void {
        console.log(this.formInputResponseBuilder);
    }
}