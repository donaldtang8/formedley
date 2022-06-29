import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { FormInputResponseComponent } from '../../form-response/form-response-builder/form-input-response/form-input-response.component';
import { Form } from 'src/app/core/models/form.model';
import { FormControl, FormGroup } from '@angular/forms';
import { PlaceholderDirective } from '../../../../shared/placeholder/placeholder.directive';
import { BehaviorSubject } from 'rxjs';
import { FormInputResponse } from 'src/app/core/models/form-input-response.model';

@Component({
    selector: 'app-form-view',
    templateUrl: './form-view.component.html'
})
export class FormViewComponent implements OnInit {
    id: string;
    @Input() form: Form;
    counter:number = 0;

    constructor(
        private route: ActivatedRoute) {}

    ngOnInit() {
    }
}