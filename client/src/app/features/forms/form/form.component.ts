import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject, forkJoin } from 'rxjs';
import { Store } from '@ngrx/store';

import * as fromApp from '../../../store/app.reducer';
import * as FormActions from '../../../store/forms/forms.actions';
import { map, switchMap } from 'rxjs/operators';
import { Form } from 'src/app/core/models/form.model';
import { User } from 'src/app/core/models/user.model';

@Component({
    selector: 'app-form',
    templateUrl: './form.component.html'
})
export class FormComponent implements OnInit {
    id: string;
    isResponseMode: boolean;
    form: Form;
    user: User;
    userSubject: BehaviorSubject<User> = new BehaviorSubject<User>(null);
    formSubject: BehaviorSubject<Form> = new BehaviorSubject<Form>(null);
    isLoading: boolean = true;

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private store: Store<fromApp.AppState>,
    ) {}

    ngOnInit() {
        this.store.select('forms').subscribe(formsState => {
            this.isLoading = formsState.isLoading;
        })
        this.getForm();

        this.formSubject.subscribe(form => {
            this.getUser();
        })

        this.userSubject.subscribe(user => {
            if (this.form) {
                this.isResponseMode = (this.form.userId === user.id) ? false : true;
                this.isLoading = false;
            }
        })
    }

    getForm(): void {
        this.route.params
        .pipe(
            map(params => {
                return params['id'];
            }),
            switchMap(id => {
                this.id = id;
                this.store.dispatch(new FormActions.FetchFormById(this.id));
                return this.store.select('forms');
            }),
            map(formsState => {
                return formsState.form;
            })
        ).subscribe(form => {
            this.form = form;
            this.formSubject.next(form);
        })
    }

    getUser(): void {
        this.store.select('auth')
        .pipe(
            map(authState => {
                return authState.user
            })
        ).subscribe(user => {
            this.user = user;
            this.userSubject.next(user);
        })
    }

    viewResponses():void {
        this.router.navigate([`/forms/form/${this.id}/responses`]);
    }
}