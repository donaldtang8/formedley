import { Component, Input } from '@angular/core';

import { Store } from '@ngrx/store';

import * as fromApp from '../../../store/app.reducer';

@Component({
    selector: 'app-form-builder',
    templateUrl: './form-builder.component.html'
})
export class FormBuilderComponent {
    @Input() type: string;

    constructor(private store: Store<fromApp.AppState>) {}

    onCreateForm() {
        
    }
}