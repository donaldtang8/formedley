import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { FormResponsePop } from 'src/app/core/models/populated/form-response-pop.model';

@Component({
    selector: 'app-response-item',
    templateUrl: './response-item.component.html'
})
export class ResponseItemComponent implements OnInit {
    @Input() response: FormResponsePop;
    @Input() index: any;

    constructor(
        private router: Router,
    ) {
    }

    ngOnInit() {
    }

    navigateToResponse() {
        this.router.navigate([`/forms/form/${this.response.form.id}/response/${this.response.id}`]);
    }
}