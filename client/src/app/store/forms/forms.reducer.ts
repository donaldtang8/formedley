import { Form } from '../../core/models/form.model';
import * as FormsActions from './forms.actions';

export interface State {
    forms: Form[];
    form: Form,
    isLoading: boolean;
}

const initialState: State = {
    forms: [],
    form: null,
    isLoading: false,
}

export function formsReducer(state = initialState, action: FormsActions.FormsActions) {
    switch(action.type) {
        case FormsActions.FETCH_FORMS:
        case FormsActions.FETCH_FORM_BY_ID:
            return {
                ...state,
                isLoading: true
            }
        case FormsActions.FETCH_FORMS_SUCCESS:
            return {
                ...state,
                forms: action.payload,
                isLoading: false
            }
        case FormsActions.FETCH_FORM_SUCCESS:
            return {
                ...state,
                form: action.payload,
                isLoading: false
            }
        case FormsActions.ADD_FORM_SUCCESS:
            return {
                ...state,
                form: action.payload.form,
                forms: [ ...state.forms, action.payload.form ],
                isLoading: false
            };
        case FormsActions.SET_FORMS:
            return {
                ...state,
                forms: action.payload
            }
        case FormsActions.DELETE_FORM:
            return {
                ...state,
                forms: state.forms.filter((form, index) => {
                    return index !== action.payload
                })
            }
        case FormsActions.RESET_FORM_STATE:
            return {
                ...state,
                forms: [],
                form: null,
                isLoading: false
            }
        default:
            return state;
    }
}