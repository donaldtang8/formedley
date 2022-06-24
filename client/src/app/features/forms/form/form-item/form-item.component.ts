import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';

import * as fromApp from '../../../../store/app.reducer';
import * as FormActions from '../../../../store/forms/forms.actions';
import { map, switchMap } from 'rxjs/operators';
import { Form } from 'src/app/core/models/form.model';

@Component({
    selector: 'app-form-item',
    templateUrl: './form-item.component.html'
})
export class FormItemComponent {
    @Input() form: Form;

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private store: Store<fromApp.AppState>,
    ) {}

    navigateToForm():void {
        this.router.navigate([`/forms/form/${this.form.id}`]);
    }
}