import { Component, Input, OnInit } from '@angular/core';
import { Form } from 'src/app/core/models/form.model';

@Component({
    selector: 'app-discover-form-display',
    templateUrl: './discover-form-display.component.html'
})
export class DiscoverFormDisplayComponent implements OnInit {
    @Input() form: Form;
    
    constructor() {}

    ngOnInit() {

    }
}