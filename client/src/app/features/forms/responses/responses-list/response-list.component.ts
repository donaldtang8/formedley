import { Component, OnInit, Input, } from '@angular/core';

import { FormResponse } from 'src/app/core/models/form-response.model';

@Component({
    selector: 'app-response-list',
    templateUrl: './response-list.component.html'
})
export class ResponseListComponent implements OnInit {
    @Input() responses: FormResponse[];
    @Input() type: string;

    constructor(
    ) {}

    ngOnInit() {
    }
}