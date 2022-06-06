export class FormInput {
    constructor(
        public label: string,
        public inputType: string,
        public inputText: string,
        public selectOptions: string[],
        public innerText: string,
        public selectedOptions: string[]) {
            this.label = label;
            this.inputType = inputType;
            this.inputText = inputText;
            this.selectOptions = selectOptions;
            this.innerText = innerText;
            this.selectedOptions = selectedOptions;
            
            if (this.inputType === 'text') {
                this.selectOptions = null;
                this.selectedOptions = null;
            }
            else {
                this.inputText = null;
                this.innerText = null;
            }
        }
}