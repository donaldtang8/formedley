import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';

import { Form } from 'src/app/core/models/form.model';

@Component({
    selector: 'app-form-item',
    templateUrl: './form-item.component.html'
})
export class FormItemComponent {
    @Input() form: Form;

    constructor(
        private router: Router,
    ) {}

    navigateToForm():void {
        this.router.navigate([`/forms/form/${this.form.id}`]);
    }
}