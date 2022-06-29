import { FormInputResponse } from "../form-input-response.model";
import { Form } from '../form.model';

export class FormResponsePop {
    viewed?: boolean;
    createdAt?: Date;

    constructor(
        public id: string,
        public responses: FormInputResponse[],
        public form: Form,
        public user: string
    ) {
            this.id = id;
            this.responses = responses;
            this.form = form;
            this.user = user;
    }
}