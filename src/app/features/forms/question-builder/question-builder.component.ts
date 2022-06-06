import { Component, Input, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-question-builder',
  templateUrl: './question-builder.component.html'
})
export class QuestionBuilderComponent implements OnInit {
  questionTypes: string[] = ['Short answer', 'Paragraph', 'Multiple choice']
  type: string = 'Short answer';
  editMode = false;
  questionBuilderForm = new FormGroup({
    'questionText': new FormControl(''),
    'options': new FormArray([
      new FormControl('hello')
    ])
  });

  constructor() { 
  }

  get optionsControls() {
    return (this.questionBuilderForm.get('options') as FormArray).controls;
  }

  ngOnInit() {
  }

  onChange(event) {
      console.log(event.target.value);
      this.type = event.target.value;
  }

  onAddOption() {
    (<FormArray>this.questionBuilderForm.get('options')).push(
      new FormControl(null, Validators.required)
    )
  }

  onSubmit() {
    console.log(this.questionBuilderForm.value);
  }
}
