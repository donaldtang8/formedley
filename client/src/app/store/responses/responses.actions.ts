import { FormResponse } from '../../core/models/form-response.model';
import { Action } from "@ngrx/store";

export const ADD_RESPONSE = '[Response] Add response';
export const ADD_RESPONSE_SUCCESS = '[Response] Add response success';
export const FETCH_RESPONSE_BY_ID = '[Response] Fetch response by id';
export const FETCH_FORM_RESPONSES_BY_ID = '[Response] Fetch form responses by id';
export const FETCH_NEW_RESPONSES_BY_ID = '[Response] Fetch new responses by id';
export const FETCH_RESPONSES_SUCCESS = '[Response] Fetch responses success';
export const FETCH_RESPONSE_SUCCESS = '[Response] Fetch response success';
export const SET_RESPONSE_VIEWED = '[Response] Set response viewed';

export class AddResponse implements Action {
    readonly type = ADD_RESPONSE;

    constructor(public payload: { formId: string, response: FormResponse }) {}
}

export class AddResponseSuccess implements Action {
    readonly type = ADD_RESPONSE_SUCCESS;

    constructor(public payload: {
        response: FormResponse,
        redirect: boolean
    }) {}
}

export class FetchFormResponsesById implements Action {
    readonly type = FETCH_FORM_RESPONSES_BY_ID;

    constructor(public payload: string) {}
}

export class FetchResponseById implements Action {
    readonly type = FETCH_RESPONSE_BY_ID;

    constructor(public payload: { formId: string, responseId: string }) {}
}

export class FetchNewResponsesById implements Action {
    readonly type = FETCH_NEW_RESPONSES_BY_ID;

    constructor(public payload: string) {}
}

export class FetchResponsesSuccess implements Action {
    readonly type = FETCH_RESPONSES_SUCCESS; 

    constructor(public payload: FormResponse[] ) {}
}

export class FetchResponseSuccess implements Action {
    readonly type = FETCH_RESPONSE_SUCCESS;

    constructor(public payload: FormResponse ) {}
}

export class SetResponseViewed implements Action {
    readonly type = SET_RESPONSE_VIEWED;

    constructor(public payload: {formId: string, responseId: string}) {}
}

export type ResponsesActions = 
    | AddResponse
    | AddResponseSuccess
    | FetchFormResponsesById
    | FetchResponseById
    | FetchNewResponsesById
    | FetchResponsesSuccess
    | FetchResponseSuccess
    | SetResponseViewed;