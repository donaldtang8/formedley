import { FormInputResponse } from "./form-input-response.model";

export class FormResponse {
    id?: string;
    form?: string;
    user?: string;
    viewed?: boolean;
    createdAt?: Date;

    constructor(
        public responses: FormInputResponse[]) {
            this.responses = responses;
        }
}