import { Form } from '../../core/models/form.model';
import { Action } from "@ngrx/store";

export const ADD_FORM = '[Forms] Add Form';
export const DELETE_FORM = '[Forms] Delete Form';

export class AddForm implements Action {
    readonly type = ADD_FORM;

    constructor(public payload: Form) {}
}

export class DeleteForm implements Action {
    readonly type = DELETE_FORM;

    constructor(public payload: number) {}
}

export type FormsActions = 
    | AddForm
    | DeleteForm;