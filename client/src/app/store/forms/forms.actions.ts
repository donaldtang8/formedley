import { Form } from '../../core/models/form.model';
import { Action } from "@ngrx/store";

export const FETCH_FORMS = '[Form] Fetch forms';
export const FETCH_FORM_BY_ID = '[Form] Fetch form by id';
export const FETCH_MY_FORMS = '[Form] Fetch my forms';
export const FETCH_FORMS_SUCCESS = '[Form] Fetch forms success';
export const FETCH_FORM_SUCCESS = '[Form] Fetch form success';
export const ADD_FORM = '[Forms] Add form';
export const ADD_FORM_SUCCESS = '[Forms] Add form success'
export const SET_FORMS = '[Forms] Set forms';
export const SET_FORM = '[Forms] Set form';
export const DELETE_FORM = '[Forms] Delete form';
export const RESET_FORM_STATE = '[Forms] Reset form state';

export class FetchForms implements Action {
    readonly type = FETCH_FORMS;
}

export class FetchFormById implements Action {
    readonly type = FETCH_FORM_BY_ID;

    constructor(public payload: string) {}
}

export class FetchMyForms implements Action {
    readonly type = FETCH_MY_FORMS;
}

export class FetchFormsSuccess implements Action {
    readonly type = FETCH_FORMS_SUCCESS;

    constructor(public payload: Form[] ) {}
}

export class FetchFormSuccess implements Action {
    readonly type = FETCH_FORM_SUCCESS;

    constructor(public payload: Form ) {}
}

export class AddForm implements Action {
    readonly type = ADD_FORM;

    constructor(public payload: Form) {}
}

export class AddFormSuccess implements Action {
    readonly type = ADD_FORM_SUCCESS;

    constructor(public payload: { 
        form: Form, 
        redirect: boolean 
    }) {}
}

export class SetForms implements Action {
    readonly type = SET_FORMS;

    constructor(public payload: Form[]) {}
}

export class SetForm implements Action {
    readonly type = SET_FORM;

    constructor(public payload: Form) {}
}

export class DeleteForm implements Action {
    readonly type = DELETE_FORM;

    constructor(public payload: number) {}
}

export class ResetFormState implements Action {
    readonly type = RESET_FORM_STATE;
}

export type FormsActions = 
    | FetchForms
    | FetchFormById
    | FetchMyForms
    | FetchFormsSuccess
    | FetchFormSuccess
    | AddForm
    | AddFormSuccess
    | SetForms
    | SetForm
    | DeleteForm
    | ResetFormState;