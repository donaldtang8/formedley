export class FormInput {
    constructor(
        public inputType: string,
        public inputText: string,
        public inputAnswer: string,
        public selectOptions: string[],
        public selectedOptions: string[],
        public multiselect: boolean,
        public required: boolean) {
            this.inputType = inputType;
            this.inputText = inputText;
            this.inputAnswer = inputAnswer;
            this.selectOptions = selectOptions;
            this.selectedOptions = selectedOptions;
            this.multiselect = multiselect;
            this.required = required;
        }
}