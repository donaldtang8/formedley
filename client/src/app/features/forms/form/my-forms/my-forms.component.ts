import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';

import * as fromApp from '../../../../store/app.reducer';
import * as FormsActions from '../../../../store/forms/forms.actions';
import { map, switchMap } from 'rxjs/operators';
import { Form } from 'src/app/core/models/form.model';

@Component({
    selector: 'app-my-forms',
    templateUrl: './my-forms.component.html'
})
export class MyFormsComponent implements OnInit {
    @Input() type:string;
    forms: Form[]

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private store: Store<fromApp.AppState>,
    ) {}

    ngOnInit() {
        this.store.select('auth')
        .pipe(
            map(authState => {
                return authState.user;
            }),
            switchMap(user => {
                this.store.dispatch(new FormsActions.FetchFormsByUser(user.id));
                return this.store.select('forms');
            }),
            map(formsState => {
                return formsState.forms;
            })
        ).subscribe(forms => {
            this.forms = forms;
        })
    }
}