import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormResponse } from 'src/app/core/models/form-response.model';

import { FormResponsePop } from 'src/app/core/models/populated/form-response-pop.model';

@Component({
    selector: 'app-response-item',
    templateUrl: './response-item.component.html'
})
export class ResponseItemComponent implements OnInit {
    @Input() type: string;
    @Input() responsePop?: FormResponsePop;
    @Input() response?: FormResponse;
    @Input() index: any;

    constructor(
        private router: Router,
    ) {
    }

    ngOnInit() {
        console.log(this.response);
    }

    navigateToResponse() {
        if (this.type === 'object') {
            this.router.navigate([`/forms/form/${this.responsePop.form.id}/response/${this.response.id}`]);
        } else {
            this.router.navigate([`/forms/form/${this.response.form}/response/${this.response.id}`]);
        }
       
    }
}