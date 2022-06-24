import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { FormInputResponseComponent } from '../../form-response/form-response-builder/form-input-response/form-input-response.component';
import { Form } from 'src/app/core/models/form.model';
import { FormControl, FormGroup } from '@angular/forms';
import { PlaceholderDirective } from '../../../../shared/placeholder/placeholder.directive';
import { BehaviorSubject } from 'rxjs';
import { FormInputResponse } from 'src/app/core/models/form-input-response.model';

@Component({
    selector: 'app-form-view',
    templateUrl: './form-view.component.html'
})
export class FormViewComponent implements OnInit {
    @ViewChild(PlaceholderDirective, { static: true }) formBuilderHost: PlaceholderDirective;
    id: string;
    @Input() form: Form;
    formResponseBuilder = new FormGroup({
    });
    counter:number = 0;
    childCompSubjects: BehaviorSubject<{
        name: string,
        data: FormInputResponse,
        valid: boolean
    }>[] = [];
    formValid:boolean = false;
    submitted = false;

    constructor(
        private route: ActivatedRoute) {}

    ngOnInit() {
        this.setupForm();
    }

    setupForm() {
        if (this.formBuilderHost && this.form) {
            const viewContainerRef = this.formBuilderHost.viewContainerRef;
            for (let input of this.form.inputs) {
                const componentRef = viewContainerRef.createComponent(FormInputResponseComponent);
                const qName = `question#${this.counter}`;
                const qSubject = new BehaviorSubject<{
                    name: string,
                    data: FormInputResponse,
                    valid: boolean
                }>({
                    name: qName,
                    data: null,
                    valid: input.required ? false: true
                });
                componentRef.instance.childSubject = qSubject;
                componentRef.instance.inputQuestion = input;
                componentRef.instance.inputQuestionName = qName;
                this.childCompSubjects.push(qSubject);
                qSubject.subscribe(val => {
                    if (this.formResponseBuilder.get(val.name)) {
                        this.formResponseBuilder.get(val.name).patchValue(val.data);
                    } 
                    else {
                        this.formResponseBuilder.addControl(val.name, new FormControl(val.data));
                    }
                })
                this.counter++;
            }
        }
    }
}