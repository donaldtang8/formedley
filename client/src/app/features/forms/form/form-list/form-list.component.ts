import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';

import * as fromApp from '../../../../store/app.reducer';
import * as FormsActions from '../../../../store/forms/forms.actions';
import { map, switchMap } from 'rxjs/operators';
import { Form } from 'src/app/core/models/form.model';

@Component({
    selector: 'app-form-list',
    templateUrl: './form-list.component.html'
})
export class FormListComponent implements OnInit {
    @Input() type:string;
    @Input() forms: Form[];

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private store: Store<fromApp.AppState>,
    ) {}

    ngOnInit() {
    }
}