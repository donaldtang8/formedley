import { FormInput } from './form-input.model';

export class Form {
    id?: string;
    likes?: string[];
    likeCount?: number;
    views?: number;
    createdAt: Date;

    constructor(public title: string, public userId: string, public inputs: FormInput[]) {
        this.title = title;
        this.userId = userId;
        this.inputs = inputs;
    }
}