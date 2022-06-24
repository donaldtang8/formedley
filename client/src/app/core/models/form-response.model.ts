import { FormInputResponse } from "./form-input-response.model";

export class FormResponse {
    viewed?: boolean;
    createdAt?: Date;

    constructor(
        public id: string,
        public responses: FormInputResponse[],
        public form: string,
        public user: string
    ) {
            this.id = id;
            this.responses = responses;
            this.form = form;
            this.user = user;
    }
}