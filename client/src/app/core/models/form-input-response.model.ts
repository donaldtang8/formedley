export class FormInputResponse {
    constructor(
        public inputText: string,
        public inputAnswer: string,
        public selectedOptions: string[]) {
            this.inputText = inputText;
            this.inputAnswer = inputAnswer;
            this.selectedOptions = selectedOptions;
        }
}