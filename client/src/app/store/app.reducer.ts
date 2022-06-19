import { ActionReducerMap } from '@ngrx/store';

import * as fromAuth from './auth/auth.reducer';
import * as fromForms from './forms/forms.reducer';

export interface AppState {
    auth: fromAuth.State;
    forms: fromForms.State;
}

export const appReducer: ActionReducerMap<AppState> = {
    auth: fromAuth.authReducer,
    forms: fromForms.formsReducer
}