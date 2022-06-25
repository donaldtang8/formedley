import { FormResponse } from '../../core/models/form-response.model';
import * as ResponsesActions from './responses.actions';

export interface State {
    responses: FormResponse[];
    response: FormResponse,
    isLoading: boolean;
}

const initialState: State = {
    responses: [],
    response: null,
    isLoading: false,
}

export function responsesReducer(state = initialState, action: ResponsesActions.ResponsesActions) {
    switch(action.type) {
        case ResponsesActions.ADD_RESPONSE_SUCCESS:
            return {
                ...state,
                response: action.payload.response,
                isLoading: false
            }
        case ResponsesActions.FETCH_FORM_RESPONSES_BY_ID:
        case ResponsesActions.FETCH_RESPONSE_BY_ID:
            return {
                ...state,
                isLoading: true
            }
        case ResponsesActions.FETCH_RESPONSES_SUCCESS:
            return {
                ...state,
                responses: action.payload,
                isLoading: false
            }
        case ResponsesActions.FETCH_RESPONSE_SUCCESS:
            return {
                ...state,
                response: action.payload,
                isLoading: false
            }
        case ResponsesActions.RESET_RESPONSE_STATE:
            return {
                ...state,
                responses: [],
                response: null,
                isLoading: false
            }
        default:
            return state;
    }
}