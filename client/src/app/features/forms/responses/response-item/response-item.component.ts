import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { Store } from '@ngrx/store';

import * as fromApp from '../../../../store/app.reducer';
import * as ResponsesActions from '../../../../store/responses/responses.actions';
import { map, switchMap } from 'rxjs/operators';
import { FormResponse } from 'src/app/core/models/form-response.model';

@Component({
    selector: 'app-response-item',
    templateUrl: './response-item.component.html'
})
export class ResponseItemComponent implements OnInit {
    formId: string;
    responseId: string;
    response: FormResponse;

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private store: Store<fromApp.AppState>,
    ) {}

    ngOnInit() {
        this.route.params
        .pipe(
            map(params => {
                return {
                    form: params['id'],
                    response: params['responseId']
                };
            }),
            switchMap(ids => {
                this.formId = ids.form;
                this.responseId = ids.response;
                this.store.dispatch(new ResponsesActions.FetchResponseById({ 
                    formId: this.formId,
                    responseId: this.responseId
                }));
                return this.store.select('responses');
            }),
            map(responsesState => {
                return responsesState.response;
            })
        ).subscribe(response => {
            console.log(response);
            this.response = response;
        });
        this.setViewed();
    }

    setViewed(): void {
        this.store.dispatch(new ResponsesActions.SetResponseViewed({
            formId: this.formId,
            responseId: this.responseId
        }))
    }
}