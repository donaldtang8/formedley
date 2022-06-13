import { FormInput } from './form-input.model';

export class Form {
    id?: string;

    constructor(public title: string, public userId: string, public inputs: FormInput[]) {
        this.title = title;
        this.userId = userId;
        this.inputs = inputs;
    }
}