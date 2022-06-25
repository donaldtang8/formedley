import { User } from '../../core/models/user.model';
import * as AuthActions from './auth.actions';

export interface State {
    user: User;
    authError: string;
    loading: boolean;
}

const initialState: State = {
    user: null,
    authError: null,
    loading: false
}

export function authReducer(state = initialState, action: AuthActions.AuthActions) {
    switch(action.type) {
        case AuthActions.AUTHENTICATE_SUCCESS:
            return {
                ...state,
                authError: null,
                user: action.payload.user,
                loading: false
            };
        case AuthActions.LOGOUT:
            return {
                ...state,
                user: null,
                authError: null
            };
        case AuthActions.LOGIN:
        case AuthActions.SIGNUP:
            return {
                ...state,
                authError: null,
                loading: true
            };
        case AuthActions.AUTHENTICATE_FAIL:
            return {
                ...state,
                user: null,
                authError: action.payload,
                loading: false
            };
        case AuthActions.CLEAR_ERROR:
            return {
                ...state,
                authError: null
            };
        case AuthActions.RESET_AUTH_STATE:
            return {
                ...state,
                user: null,
                authError: null,
                loading: false
            }
        default:
            return state;
    }
}