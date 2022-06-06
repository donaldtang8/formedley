import { FormInput } from './form-input.model';

export class Form {
    constructor(public inputs: FormInput[]) {
        this.inputs = inputs;
    }
}