export class FormInput {
    constructor(
        public inputType: string,
        public inputText: string,
        public selectOptions: string[],
        public multiselect: boolean,
        public required: boolean) {
            this.inputType = inputType;
            this.inputText = inputText;
            this.selectOptions = selectOptions;
            this.multiselect = multiselect;
            this.required = required;
        }
}