import { FormInput } from './form-input.model';

export class Form {
    constructor(public title: string, public inputs: FormInput[]) {
        this.title = title;
        this.inputs = inputs;
    }
}