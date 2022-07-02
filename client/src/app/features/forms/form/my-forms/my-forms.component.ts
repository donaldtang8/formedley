import { Component, OnInit, Input } from '@angular/core';
import { Store } from '@ngrx/store';

import * as fromApp from '../../../../store/app.reducer';
import * as FormsActions from '../../../../store/forms/forms.actions';
import { Form } from 'src/app/core/models/form.model';

@Component({
    selector: 'app-my-forms',
    templateUrl: './my-forms.component.html'
})
export class MyFormsComponent implements OnInit {
    @Input() type:string;
    forms: Form[];

    constructor(
        private store: Store<fromApp.AppState>,
    ) {}

    ngOnInit() {
        this.store.dispatch(new FormsActions.FetchMyForms());
        this.store.select('forms').subscribe(formsState => {
            this.forms = formsState.forms;
        });
    }
}