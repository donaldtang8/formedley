import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';

import * as fromApp from '../../../store/app.reducer';
import * as ResponsesActions from '../../../store/responses/responses.actions';
import { map, switchMap } from 'rxjs/operators';
import { FormResponse } from 'src/app/core/models/form-response.model';

@Component({
    selector: 'app-responses',
    templateUrl: './responses.component.html'
})
export class ResponsesComponent implements OnInit {
    id: string;
    responses: FormResponse[];

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private store: Store<fromApp.AppState>,
    ) {}

    ngOnInit() {
        this.route.params
        .pipe(
            map(params => {
                return params['id'];
            }),
            switchMap(id => {
                this.id = id;
                this.store.dispatch(new ResponsesActions.FetchFormResponsesById(this.id));
                return this.store.select('responses');
            }),
            map(responsesState => {
                return responsesState.responses;
            })
        ).subscribe(responses => {
            this.responses = responses;
        });
    }
}