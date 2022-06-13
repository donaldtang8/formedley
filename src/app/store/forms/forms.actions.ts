import { Form } from '../../core/models/form.model';
import { Action } from "@ngrx/store";

export const FETCH_FORMS = '[Form] Fetch Forms';
export const FETCH_FORM_BY_ID = '[Form] Fetch Form by ID';
export const ADD_FORM = '[Forms] Add Form';
export const SET_FORMS = '[Forms] Set Forms';
export const SET_FORM = '[Forms] Set Form';
export const DELETE_FORM = '[Forms] Delete Form';

export class FetchForms implements Action {
    readonly type = FETCH_FORMS;
}

export class FetchFormById implements Action {
    readonly type = FETCH_FORM_BY_ID;

    constructor(public payload: string) {}
}

export class AddForm implements Action {
    readonly type = ADD_FORM;

    constructor(public payload: Form) {}
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

export type FormsActions = 
    | FetchForms
    | FetchFormById
    | AddForm
    | SetForms
    | SetForm
    | DeleteForm;