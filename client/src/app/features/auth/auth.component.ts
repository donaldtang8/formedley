import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Store } from '@ngrx/store';
import { BehaviorSubject, Subscription } from 'rxjs';
import { AlertDirective } from '../../shared/alert/alert.directive';
import { AlertComponent } from '../../shared/alert/alert.component';

import * as fromApp from '../../store/app.reducer';
import * as AuthActions from '../../store/auth/auth.actions';
import { Router } from '@angular/router';

@Component({
    selector: 'app-auth',
    templateUrl: './auth.component.html'
})
export class AuthComponent implements OnInit, OnDestroy {
    @ViewChild(AlertDirective, { static: true }) appAlert: AlertDirective;
    isLoginMode = true;
    isLoading = false;
    error: BehaviorSubject<string> = new BehaviorSubject<string>(null);

    private storeSub: Subscription;

    constructor(
        private store: Store<fromApp.AppState>,
        private router: Router
    ) {}

    ngOnInit() {
        this.storeSub = this.store.select('auth').subscribe(authState => {
            this.isLoading = authState.loading;
            if (authState.user) {
                this.router.navigate(['/']);
            }
            if (authState.error) {
                this.error.next(authState.error);
            }
            
        })
        this.error.subscribe(error => {
            if (error) {
                this.setupAlert(error);
                this.store.dispatch(new AuthActions.ClearError());
            }
            setTimeout(() => {
                const viewContainerRef = this.appAlert.viewContainerRef;
                viewContainerRef.clear();
            }, 3000);
        })
    }

    onSwitchMode() {
        this.isLoginMode = !this.isLoginMode;
    }

    onSubmit(form: NgForm) {
        if (!form.valid) {
            if (this.isLoginMode) {
                this.error.next('Incorrect username or password');
            } else {
                this.error.next('Invalid fields')
            }
            return;
        }

        const email = form.value.email;
        const password = form.value.password;
        const remember = !form.value.remember ? false : true;
        if (this.isLoginMode) {
            // request to login
             this.store.dispatch(new AuthActions.Login({
                user: {
                    email: email,
                    password: password
                },
                remember: remember 
            }))
        } else {
            const firstName = form.value.firstName;
            const lastName = form.value.lastName;
            const passwordConfirm = form.value.passwordConfirm;
            if (password !== passwordConfirm) {
                this.error.next('Passwords must match');
            }
            else {
                this.store.dispatch(new AuthActions.Signup({
                    user: {
                        firstName: firstName,
                        lastName: lastName,
                        email: email,
                        password: password,
                        passwordConfirm: passwordConfirm
                    },
                    remember: remember
                }))
            }
        }
    }

    setupAlert(error: string) {
        if (this.appAlert) {
            const viewContainerRef = this.appAlert.viewContainerRef;
            viewContainerRef.clear();
            const componentRef = viewContainerRef.createComponent(AlertComponent);
            componentRef.instance.type = 'danger';
            componentRef.instance.alertMessage = error;
            componentRef.instance.delete.subscribe(() => {
                viewContainerRef.clear();
            })
        }
    }

    ngOnDestroy() {
        if (this.storeSub) {
            this.storeSub.unsubscribe();
        }
    }
}