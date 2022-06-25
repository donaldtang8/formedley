import { Action } from '@ngrx/store';
import { User } from 'src/app/core/models/user.model';

export const LOGIN = '[Auth] Login'
export const AUTHENTICATE_SUCCESS = '[Auth] Login Success';
export const AUTHENTICATE_FAIL = '[Auth] Login Fail';
export const SIGNUP = '[Auth] Signup';
export const CLEAR_ERROR = '[Auth] Clear Error';
export const AUTO_LOGIN = '[Auth] Auto Login';
export const LOGOUT = '[Auth] Logout';
export const RESET_AUTH_STATE = '[Auth] Reset auth state';

export class AuthenticateSuccess implements Action {
    readonly type = AUTHENTICATE_SUCCESS;

    constructor(
        public payload: { 
            user: User
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

    constructor(public payload: { firstName: string, lastName: string, username: string, email: string; password: string, passwordConfirm: string }) {}
}

export class ClearError implements Action {
    readonly type = CLEAR_ERROR;
}

export class AutoLogin implements Action {
    readonly type = AUTO_LOGIN;
}

export class ResetAuthState implements Action {
    readonly type = RESET_AUTH_STATE;
}

export type AuthActions = 
    | AuthenticateSuccess
    | Logout
    | Login
    | AuthenticateFail
    | Signup
    | ClearError
    | AutoLogin
    | ResetAuthState;