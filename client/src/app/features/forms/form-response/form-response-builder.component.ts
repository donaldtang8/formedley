import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';

import * as fromApp from '../../../store/app.reducer';
import * as FormsActions from '../../../store/forms/forms.actions';
import * as ResponsesActions from '../../../store/responses/responses.actions';
import { FormInputResponseComponent } from './form-response-builder/form-input-response/form-input-response.component';
import { map, switchMap } from 'rxjs/operators';
import { Form } from 'src/app/core/models/form.model';
import { FormResponse } from 'src/app/core/models/form-response.model';
import { FormControl, FormGroup } from '@angular/forms';
import { PlaceholderDirective } from '../../../shared/placeholder/placeholder.directive';
import { BehaviorSubject, take } from 'rxjs';
import { FormInputResponse } from 'src/app/core/models/form-input-response.model';

@Component({
    selector: 'app-form-response-builder',
    templateUrl: './form-response-builder.component.html'
})
export class FormResponseBuilderComponent implements OnInit {
    @ViewChild(PlaceholderDirective, { static: true }) formBuilderHost: PlaceholderDirective;
    id: string;
    @Input() form: Form;
    // form: Form;
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
        private route: ActivatedRoute,
        private store: Store<fromApp.AppState>,
    ) {}

    ngOnInit() {
        this.route.params
        .pipe(
            map(params => {
                return params['id'];
            }),
            map(id => {
                return id;
            })
        ).subscribe(id => {
            this.id = id;
        })
        this.setupForm();
        this.formResponseBuilder.valueChanges.subscribe(() => {
            this.formValid = this.checkValid();
        })
    }

    setupForm() {
        if (this.formBuilderHost) {
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
                    this.formValid = this.checkValid();
                })
                this.counter++;
            }
        }
    }
    
    checkValid():boolean {
        const status = this.formResponseBuilder.valid && !this.childCompSubjects.some(sub => sub.value.valid === false);
        return status;
    }

    getFormValues():void {
        console.log(this.formResponseBuilder);
    }

    getChildSubjectValues():void {
        console.log(this.childCompSubjects);
    }

    onSubmit() {
        let userId;
        let responseArr = [];
        for (const control in this.formResponseBuilder.controls) {
            responseArr.push(this.formResponseBuilder.get(control).value);
        }
        if (this.formValid) {
            this.store.select('auth')
                .pipe(
                    take(1)
                )
                .subscribe(userState => {
                   userId = userState.user._id;
                }
            )
        }
        this.store.dispatch(new ResponsesActions.AddResponse({
            form: this.id,
            user: userId,
            responses: responseArr
        }))
    }
}