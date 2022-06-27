import { Component, Input, OnInit } from '@angular/core';

import { FormResponse } from 'src/app/core/models/form-response.model';

@Component({
    selector: 'app-response-item',
    templateUrl: './response-item.component.html'
})
export class ResponseItemComponent {
    @Input() response: FormResponse;

    constructor(
    ) {}
}