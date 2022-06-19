import { FormInputResponse } from "./form-input-response.model";

export class FormResponse {
    form?: string;
    user?: string;
    createdAt?: Date;

    constructor(
        public responses: FormInputResponse[]) {
            this.responses = responses;
        }
}