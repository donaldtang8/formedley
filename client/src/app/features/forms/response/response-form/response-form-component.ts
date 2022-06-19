import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';

import * as fromApp from '../../../../store/app.reducer';
import * as FormsActions from '../../../../store/forms/forms.actions';

@Component({
  selector: 'app-response-form',
  templateUrl: './response-form.component.html'
})
export class ResponseFormComponent implements OnInit {

  constructor(
      private store: Store<fromApp.AppState>
    ) { 
  }

  ngOnInit() {
    this.store.dispatch(new FormsActions.FetchFormById('123'));
  }

  onSubmit() {
  }
}
