import { Action } from '@ngrx/store';

export const LOGIN = '[Auth] Login'
export const AUTHENTICATE_SUCCESS = '[Auth] Login Success';
export const AUTHENTICATE_FAIL = '[Auth] Login Fail';
export const SIGNUP = '[Auth] Signup';
export const CLEAR_ERROR = '[Auth] Clear Error';
export const AUTO_LOGIN = '[Auth] Auto Login';
export const LOGOUT = '[Auth] Logout';

export class AuthenticateSuccess implements Action {
    readonly type = AUTHENTICATE_SUCCESS;

    constructor(
        public payload: { 
            email: string,
            userId: string,
            token: string,
            expirationDate: Date,
            redirect: boolean
        }
    ) {}
}

export class Logout implements Action {
    readonly type = LOGOUT;
}

export class Login implements Action {
    readonly type = LOGIN;

    constructor(public payload: { email: string; password: string }) {}
}

export class AuthenticateFail implements Action {
    readonly type = AUTHENTICATE_FAIL;

    constructor(public payload: string) {}
}

export class Signup implements Action {
    readonly type = SIGNUP;

    constructor(public payload: { email: string; password: string }) {}
}

export class ClearError implements Action {
    readonly type = CLEAR_ERROR;
}

export class AutoLogin implements Action {
    readonly type = AUTO_LOGIN;
}

export type AuthActions = 
    | AuthenticateSuccess
    | Logout
    | Login
    | AuthenticateFail
    | Signup
    | ClearError
    | AutoLogin;