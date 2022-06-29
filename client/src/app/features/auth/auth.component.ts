import { Component, ComponentFactoryResolver, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';

import * as fromApp from '../../store/app.reducer';
import * as AuthActions from '../../store/auth/auth.actions';

@Component({
    selector: 'app-auth',
    templateUrl: './auth.component.html'
})
export class AuthComponent implements OnInit, OnDestroy {
    isLoginMode = true;
    isLoading = false;
    error!: string;

    private storeSub: Subscription;

    constructor(
        private store: Store<fromApp.AppState>
    ) {}

    ngOnInit() {
        console.log("Loaded auth component");
        this.storeSub = this.store.select('auth').subscribe(authState => {
            this.isLoading = authState.loading;
            this.error = authState.authError;
        })
    }

    onSwitchMode() {
        this.isLoginMode = !this.isLoginMode;
    }

    onSubmit(form: NgForm) {
        console.log("Submitting form");
        if (!form.valid) {
            return;
        }
        const email = form.value.email;
        const password = form.value.password;

        if (this.isLoginMode) {
            // request to login
             this.store.dispatch(new AuthActions.Login({
                email: email,
                password: password
             }))
        } else {
            const firstName = form.value.firstName;
            const lastName = form.value.lastName;
            const passwordConfirm = form.value.passwordConfirm;
            if (password !== passwordConfirm) {
                console.log("Error");
                this.error = 'Passwords must match';
            }
            else {
                console.log("Sending action");
                this.store.dispatch(new AuthActions.Signup({
                    firstName: firstName,
                    lastName: lastName,
                    email: email,
                    password: password,
                    passwordConfirm: passwordConfirm
                }))
            }
        }
        // form.reset();
    }

    onHandleError() {
        // handle error
    }

    ngOnDestroy() {
        if (this.storeSub) {
            this.storeSub.unsubscribe();
        }
    }
}