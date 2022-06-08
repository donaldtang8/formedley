import { Component, ViewChild } from '@angular/core';

import { Store } from '@ngrx/store';

import { FormInputBuilderComponent } from '../form-builder-input/form-input-builder.component';
import { PlaceholderDirective } from '../../../shared/placeholder/placeholder.directive';
import * as fromApp from '../../../store/app.reducer';
import * as FormActions from '../../../store/forms/forms.actions';

@Component({
    selector: 'app-form-builder',
    templateUrl: './form-builder.component.html'
})
export class FormBuilderComponent {
    @ViewChild(PlaceholderDirective) formBuilderHost: PlaceholderDirective;

    constructor(
        private store: Store<fromApp.AppState>,
    ) {}

    addQuestion() {
        const viewContainerRef = this.formBuilderHost.viewContainerRef;
        const componentRef = viewContainerRef.createComponent(FormInputBuilderComponent);
    }

    checkValid(): boolean {
        const formInputBuilderComponents = document.getElementsByClassName('form-input-builder');
        console.log(formInputBuilderComponents);
        return true;
    }

    onCreateForm() {
       this.checkValid();
    }
}