import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { map, switchMap } from 'rxjs/operators';
import { Store } from '@ngrx/store';

import { FormResponse } from 'src/app/core/models/form-response.model';

import * as fromApp from '../../../../store/app.reducer';
import * as ResponsesActions from '../../../../store/responses/responses.actions';

@Component({
    selector: 'app-response-view',
    templateUrl: './response-view.component.html'
})
export class ResponseViewComponent implements OnInit {
    @Input() pResponse: FormResponse;
    @Input() hasPResponse: boolean;
    response: FormResponse;

    constructor(
        private route: ActivatedRoute,
        private store: Store<fromApp.AppState>,
    ) {
    }

    ngOnInit() {
        if (!this.hasPResponse) {
            this.route.params
            .pipe(
                map(params => {
                    return params;
                }),
                switchMap(params => {
                    this.store.dispatch(new ResponsesActions.FetchResponseById({
                        formId: params.id,
                        responseId: params.responseId
                    }));
                    return this.store.select('responses');
                }),
                map(responsesState => {
                    return responsesState.response;
                })
            ).subscribe(response => {
                this.response = response;
            });
        } else {
            this.response = this.pResponse;
        }
        // console.log(this.response);
    }
}