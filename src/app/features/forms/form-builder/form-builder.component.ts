import { Component, Input, OnInit, Output, ViewChild } from '@angular/core';

import { Store } from '@ngrx/store';

import { FormInputBuilderComponent } from '../form-builder-input/form-input-builder.component';
import { PlaceholderDirective } from '../../../shared/placeholder/placeholder.directive';
import * as fromApp from '../../../store/app.reducer';
import * as FormActions from '../../../store/forms/forms.actions';
import { Form } from 'src/app/core/models/form.model';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject, Subject } from 'rxjs';
import { FormInput } from 'src/app/core/models/form-input.model';

@Component({
    selector: 'app-form-builder',
    templateUrl: './form-builder.component.html'
})
export class FormBuilderComponent implements OnInit {
    @ViewChild(PlaceholderDirective) formBuilderHost: PlaceholderDirective;
    form: Form;
    formBuilder = new FormGroup({
        'title': new FormControl('', Validators.required)
    });
    counter = 0;
    childCompSubjects: BehaviorSubject<{
        name: string,
        data: FormInput,
        valid: boolean
    }>[] = [];
    childFormValid: boolean = false;
    formValid:boolean = false;

    constructor(
        private store: Store<fromApp.AppState>,
    ) {}

    ngOnInit() {
        // this will catch the outer form and inner form (submissions only) changes
        this.formBuilder.valueChanges.subscribe(() => {
            this.formValid = this.checkValid();
        })
    } 

    addQuestion() {
        const viewContainerRef = this.formBuilderHost.viewContainerRef;
        const componentRef = viewContainerRef.createComponent(FormInputBuilderComponent);
        const qName = `question#${this.counter}`;
        const qSubject = new BehaviorSubject<{
            name: string,
            data: FormInput,
            valid: boolean
        }>({
            name: qName,
            data: null,
            valid: false
        });
        componentRef.instance.childSubject = qSubject;
        this.childCompSubjects.push(qSubject);
        qSubject.subscribe(val => {
            if (val.data) {
                 // check if there is a formcontrol for the current child question
                if (this.formBuilder.get(val.name)) {
                    this.formBuilder.get(val.name).patchValue(val.name, val.data);
                } else {
                    this.formBuilder.addControl(val.name, new FormControl(val.data));
                }
            } else {
                // if no data is submitted but a false valid value was passed we can catch that here and update the validity value
                this.formValid = this.checkValid();
            }
            // when we submit a new question from the child component, line 43 runs first, and the check valid function is run before we have
            // a chance to update the child valid boolean
            // possible solution - use one subject that will take both the validity of the child form as well as the form data
        })
        this.counter++;
    }

    checkValid(): boolean {
        console.log("Checking status");
        const status = this.formBuilder.valid && this.childCompSubjects.length > 0 && !this.childCompSubjects.some(sub => sub.value.valid === false);
        return status;
    }

    testSubjectValues() {
        console.log(this.childCompSubjects);
    }

    onSubmit() {
        if (this.checkValid()) {
            console.log("Form is valid");
            console.log(this.formBuilder.value);
        }
        else {
            console.log("Form is invalid");
        }
    }
}