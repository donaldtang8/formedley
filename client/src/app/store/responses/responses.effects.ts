import { Actions, Effect, ofType } from '@ngrx/effects';
import { map, tap, switchMap, withLatestFrom } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';

import * as fromApp from '../../store/app.reducer';
import * as ResponsesActions from '../responses/responses.actions';
import { FormResponse } from '../../core/models/form-response.model';
import { Router } from '@angular/router';

@Injectable()
export class ResponsesEffects {
    @Effect()
    formCreateResponse = this.actions$.pipe(
        ofType(ResponsesActions.ADD_RESPONSE),
        switchMap((formAddResponseAction: ResponsesActions.AddResponse) => {
            const {form, user, responses} = formAddResponseAction.payload;
            return this.http.post<any>(
                `http://localhost:5000/api/forms/${formAddResponseAction.payload.form}/responses`,
                {
                    form: form,
                    user: user,
                    responses: responses
                }
            )
        }),
        map((resData) => {
            return new ResponsesActions.AddResponseSuccess({
                response: resData.data.doc,
                redirect: true
            });
        })
    )

    @Effect({
        dispatch: false
    })
    addResponseRedirect = this.actions$.pipe(
        ofType(ResponsesActions.ADD_RESPONSE_SUCCESS),
        tap((responseSuccessAction: ResponsesActions.AddResponseSuccess) => {
            if (responseSuccessAction.payload.redirect) {
                const { id, form } = responseSuccessAction.payload.response;
                this.router.navigate([`/forms/form/${form}/response/${id}`]);
            }
        })
    )

    @Effect()
    fetchMyResponses = this.actions$.pipe(
        ofType(ResponsesActions.FETCH_MY_RESPONSES),
        switchMap((fetchMyResponses: ResponsesActions.FetchMyResponses) => {
            return this.http.get<any>(
                `http://localhost:5000/api/responses/user/me`
            )
        }),
        map((resData) => {
            return new ResponsesActions.FetchResponsesSuccess(resData.data.doc)
        })
    )

    @Effect()
    formFormResponses = this.actions$.pipe(
        ofType(ResponsesActions.FETCH_FORM_RESPONSES_BY_ID),
        switchMap((fetchFormResponses: ResponsesActions.FetchFormResponsesById) => {
            return this.http.get<any>(
                `http://localhost:5000/api/forms/${fetchFormResponses.payload}/responses`
            )
        }),
        map((resData) => {
            return new ResponsesActions.FetchResponsesSuccess(resData.data.doc)
        })
    )

    @Effect()
    formResponseById = this.actions$.pipe(
        ofType(ResponsesActions.FETCH_RESPONSE_BY_ID),
        switchMap((fetchResponse: ResponsesActions.FetchResponseById) => {
            return this.http.get<any>(
                `http://localhost:5000/api/forms/${fetchResponse.payload.formId}/responses/${fetchResponse.payload.responseId}`
            )
        }),
        map((resData) => {
            return new ResponsesActions.FetchResponseSuccess(resData.data.doc)
        })
    )
    
    @Effect()
    setResponseViewed = this.actions$.pipe(
        ofType(ResponsesActions.SET_RESPONSE_VIEWED),
        switchMap((setResponseViewed: ResponsesActions.SetResponseViewed) => {
            return this.http.patch<any>(
                `http://localhost:5000/api/forms/${setResponseViewed.payload.formId}/responses/${setResponseViewed.payload.responseId}/view`,
                {}
            )
        })
    )

    constructor(
        private actions$: Actions<ResponsesActions.ResponsesActions>,
        private http: HttpClient,
        private router: Router,
        private store: Store<fromApp.AppState>
    ) {}
}