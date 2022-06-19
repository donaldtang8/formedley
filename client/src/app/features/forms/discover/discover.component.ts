import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';

import * as fromApp from '../../../store/app.reducer';
import * as FormActions from '../../../store/forms/forms.actions';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { Form } from 'src/app/core/models/form.model';

@Component({
    selector: 'app-discover',
    templateUrl: './discover.component.html'
})
export class DiscoverComponent implements OnInit {
    forms: Form[] = [];

    constructor(
        private store: Store<fromApp.AppState>,
        private router: Router
    ) {}

    ngOnInit() {
        this.store.dispatch(new FormActions.FetchForms());
        this.store.select('forms')
        .pipe(
            map(formsState => formsState.forms)
        )
        .subscribe((forms: Form[]) => {
            this.forms = forms;
        })
    }

}