import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, ofType, Effect } from '@ngrx/effects';
import { mergeMap, of } from 'rxjs';
import { switchMap, catchError, map, tap } from 'rxjs/operators';
import { AuthService } from '../../features/auth/auth.service';
import { User } from '../../core/models/user.model';

import * as AuthActions from './auth.actions';
import * as FormsActions from '../forms/forms.actions';
import * as ResponsesActions from '../responses/responses.actions';

export interface AuthResponseData {
    status: string,
    data: {
        user: User,
        token: string,
        expiresIn: Date
    }
}

const handleAuthentication = (
    user: User,
    remember: boolean
) => {
    if (remember) {
        localStorage.setItem('userData', JSON.stringify(user));
    }
    return new AuthActions.AuthenticateSuccess({
        user: user,
        redirect: true
    });
}

const handleError = (errorResponse: any) => {
    console.log(errorResponse);
    let errorMessage = 'An unknown error occurred!';
    if (!errorResponse.error) {
        return of(new AuthActions.AuthenticateFail(errorMessage));
    }
    return of(new AuthActions.AuthenticateFail(errorResponse.error.message));
}

@Injectable()
export class AuthEffects {
    @Effect()
    authSignup = this.actions$.pipe(
        ofType(AuthActions.SIGNUP),
        switchMap((signupData: AuthActions.Signup) => {
            return this.http.post<AuthResponseData>(
                'http://localhost:5000/api/user/signup',
                signupData.payload.user
            ).pipe(
                map(resData => {
                    const { id, firstName, lastName, email, role } = resData.data.user;
                    const newUser = new User( id, email, firstName, lastName, role, resData.data.token, resData.data.expiresIn);
                    return handleAuthentication(newUser, signupData.payload.remember);
                }),
                catchError(errorResponse => {
                    // we need to ensure that this observable doesn't end if there is an error or else our login
                    // process would be abruptly interrupted, so we need to return a non-error observable to continue the login process
                   return handleError(errorResponse);
                }),
            )
        })
    );


    @Effect()
    authLogin = this.actions$.pipe(
        ofType(AuthActions.LOGIN),
        switchMap((loginData: AuthActions.Login) => {
            return this.http.post<AuthResponseData>(
                'http://localhost:5000/api/user/login',
                loginData.payload.user
            ).pipe(
                map(resData => {
                    const { id, firstName, lastName, email, role } = resData.data.user;
                    const newUser = new User( id, email, firstName, lastName, role, resData.data.token, resData.data.expiresIn);
                    return handleAuthentication(newUser, loginData.payload.remember);
                }),
                catchError(errorResponse => {
                    // we need to ensure that this observable doesn't end if there is an error or else our login
                    // process would be abruptly interrupted, so we need to return a non-error observable to continue the login process
                    return handleError(errorResponse);
                }),
            )
        }),
    )

    @Effect({
        dispatch: false
    })
    authRedirect = this.actions$.pipe(
        ofType(AuthActions.AUTHENTICATE_SUCCESS),
        tap((authSuccessAction: AuthActions.AuthenticateSuccess) => {
            if (authSuccessAction.payload.redirect) {
                this.router.navigate(['/forms/create']);
            }
        })
    )

    @Effect()
    autoLogin = this.actions$.pipe(
        ofType(AuthActions.AUTO_LOGIN),
        map(() => {
            const userData: {
                id: string,
                email: string,
                firstName: string,
                lastName: string,
                role: string,
                token: string;
                tokenExpirationDate: string;
            } = JSON.parse(localStorage.getItem('userData') || '{}');
            if (!userData) {
                return { type: 'DUMMY' };
            }
            const loadedUser = new User(
                userData.id,
                userData.email,
                userData.firstName,
                userData.lastName,
                userData.role,
                userData.token,
                new Date(userData.tokenExpirationDate)
            );
            if (loadedUser.getToken) {
                const expirationDate = new Date(userData.tokenExpirationDate).getTime();
                const dateNow = new Date().getTime();
                if (expirationDate > dateNow) {
                    const expirationDuration = new Date(userData.tokenExpirationDate).getTime() - new Date().getTime();
                    this.authService.setLogoutTimer(expirationDuration);
                    return new AuthActions.AuthenticateSuccess({
                        user: loadedUser,
                        redirect: false
                    });
                }
            }
            // we only return an action if there is a valid token
            // however, every effect needs to return an action so we need to return a dummy one if there
            // is no valid token
            return { type: 'DUMMY' };
        })
    )

    @Effect()
    authLogout = this.actions$.pipe(
        ofType(AuthActions.LOGOUT),
        tap(() => {
            this.authService.clearLogoutTimer();
            localStorage.removeItem('userData');
            this.router.navigate(['/auth']);
        }),
        mergeMap(() => {
            return [
                new FormsActions.ResetFormState(),
                new ResponsesActions.ResetResponsesState(),
                new AuthActions.ResetAuthState()
            ]
        })
    )

    constructor(
        private actions$: Actions,
        private http: HttpClient,
        private router: Router,
        private authService: AuthService
    ) {}
}