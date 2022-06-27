import { Component, OnInit, Input } from '@angular/core';
import { Store } from '@ngrx/store';

import * as fromApp from '../../../../store/app.reducer';
import * as ResponsesActions from '../../../../store/responses/responses.actions';
import { FormResponse } from 'src/app/core/models/form-response.model';

@Component({
    selector: 'app-my-responses',
    templateUrl: './my-responses.component.html'
})
export class MyResponsesComponent implements OnInit {
    @Input() type:string;
    responses: FormResponse[]

    constructor(
        private store: Store<fromApp.AppState>,
    ) {}

    ngOnInit() {
        this.store.dispatch(new ResponsesActions.FetchMyResponses());
        this.store.select('responses').subscribe(responsesState => {
            this.responses = responsesState.responses;
        });
    }
}