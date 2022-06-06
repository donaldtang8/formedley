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
        case FormsActions.ADD_FORM:
            return {
                ...state,
                forms: [
                    ...state.forms,
                    action.payload
                ]
            };
        case FormsActions.DELETE_FORM:
            return {
                ...state,
                forms: state.forms.filter((form, index) => {
                    return index !== action.payload
                })
            }
        default:
            return state;
    }
}