import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, ofType, Effect } from '@ngrx/effects';
import { of } from 'rxjs';
import { switchMap, catchError, map, tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { AuthService } from '../../features/auth/auth.service';
import { User } from '../../core/models/user.model';

import * as AuthActions from './auth.actions';

export interface AuthResponseData {
    kind: string;
    idToken: string;
    email: string;
    refreshToken: string;
    expiresIn: string;
    localId: string;
    registered?: boolean;
}

const handleAuthentication = (
    expiresIn: number,
    email: string,
    userId: string,
    token: string
) => {
    const expirationDate = new Date(new Date().getTime() + +expiresIn * 1000);
    const user = new User(email, userId, token, expirationDate);
    localStorage.setItem('userData', JSON.stringify(user));
    return new AuthActions.AuthenticateSuccess({
        email: email,
        userId: userId,
        token: token,
        expirationDate: expirationDate,
        redirect: true
    });
}

const handleError = (errorResponse: any) => {
    let errorMessage = 'An unknown error occurred!';
    if (!errorResponse.error || !errorResponse.error.error) {
        return of(new AuthActions.AuthenticateFail(errorMessage));
    }
    switch(errorResponse.error.error.message) {
        case 'EMAIL_EXISTS':
            errorMessage = 'This email exists already';
            break;
        case 'EMAIL_NOT_FOUND':
            errorMessage = 'This email does not exist';
            break;
        case 'INVALID_PASSWORD':
            errorMessage = 'This password is not valid';
            break;

    }
    return of(new AuthActions.AuthenticateFail(errorMessage));
}

@Injectable()
export class AuthEffects {
    @Effect()
    authSignup = this.actions$.pipe(
        ofType(AuthActions.SIGNUP),
        switchMap((signupAction: AuthActions.Signup) => {
            return this.http.post<AuthResponseData>(
                'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=' + environment.firebaseAPIKey,
                {
                    email: signupAction.payload.email,
                    password: signupAction.payload.password,
                    returnSecureToken: true
                }
            ).pipe(
                tap(resData => {
                    this.authService.setLogoutTimer(+resData.expiresIn * 1000)
                }),
                map(resData => {
                    return handleAuthentication(
                        +resData.expiresIn,
                        resData.email,
                        resData.localId,
                        resData.idToken
                    );
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
        switchMap((authData: AuthActions.Login) => {
            return this.http.post<AuthResponseData>(
                'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=' + environment.firebaseAPIKey,
                {
                    email: authData.payload.email,
                    password: authData.payload.password,
                    returnSecureToken: true
                }
            ).pipe(
                tap(resData => {
                    console.log(resData);
                    this.authService.setLogoutTimer(+resData.expiresIn * 1000)
                }),
                map(resData => {
                    return handleAuthentication(
                        +resData.expiresIn,
                        resData.email,
                        resData.localId,
                        resData.idToken
                    );
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
                email: string;
                id: string;
                _token: string;
                _tokenExpirationDate: string;
            } = JSON.parse(localStorage.getItem('userData') || '{}');
    
            if (!userData) {
                return { type: 'DUMMY' };
            }
            const loadedUser = new User(
                userData.email,
                userData.id,
                userData._token,
                new Date(userData._tokenExpirationDate)
            );
            
            if (loadedUser.token) {
                // this.user.next(loadedUser);
                const expirationDuration = new Date(userData._tokenExpirationDate).getTime() - new Date().getTime();
                this.authService.setLogoutTimer(expirationDuration);
                return new AuthActions.AuthenticateSuccess({
                    email: loadedUser.email,
                    userId: loadedUser.id,
                    token: loadedUser.token,
                    expirationDate: new Date(userData._tokenExpirationDate),
                    redirect: false
                });
            }
            // we only return an action if there is a valid token
            // however, every effect needs to return an action so we need to return a dummy one if there
            // is no valid token
            return { type: 'DUMMY' };
        })
    )

    @Effect({
        dispatch: false
    })
    authLogout = this.actions$.pipe(
        ofType(AuthActions.LOGOUT),
        tap(() => {
            this.authService.clearLogoutTimer();
            localStorage.removeItem('userData');
            this.router.navigate(['/auth']);
        })
    )

    constructor(
        private actions$: Actions,
        private http: HttpClient,
        private router: Router,
        private authService: AuthService
    ) {}
}