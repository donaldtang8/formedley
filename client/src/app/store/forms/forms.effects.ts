import { Actions, Effect, ofType } from '@ngrx/effects';
import { map, switchMap, withLatestFrom } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';

import * as fromApp from '../../store/app.reducer';
import * as FormsActions from '../forms/forms.actions';
import { Form } from 'src/app/core/models/form.model';

@Injectable()
export class FormsEffects {
    @Effect({
        dispatch: false
    })
    addForm = this.actions$.pipe(
        ofType(FormsActions.ADD_FORM),
        withLatestFrom(this.store.select('forms')),
        switchMap(([actionData, formsState]) => {
            return this.http
            .post(
                'http://localhost:5000/api/forms/',
                formsState.form
            )
        })
    )

    @Effect()
    fetchForm = this.actions$.pipe(
        ofType(FormsActions.FETCH_FORM_BY_ID),
        switchMap((fetchFormAction: FormsActions.FetchFormById) => {
            return this.http.get<any>(
                `http://localhost:5000/api/forms/id/${fetchFormAction.payload}`
            )
        }),
        map((resData) => {
            const { title, user, inputs } = resData.data.doc;
            return new FormsActions.FetchFormSuccess(new Form(title, user._id, inputs))
        })
    )

    @Effect()
    fetchFormsByUser = this.actions$.pipe(
        ofType(FormsActions.FETCH_FORMS_BY_USER),
        switchMap((fetchFormsUser: FormsActions.FetchFormsByUser) => {
            return this.http.get<any>(
                `http://localhost:5000/api/forms/user/${fetchFormsUser.payload}`
            )
        }),
        map((resData) => {
            return new FormsActions.FetchFormsSuccess(resData.data.doc)
        })
    )

    constructor(
        private actions$: Actions<FormsActions.FormsActions>,
        private http: HttpClient,
        private store: Store<fromApp.AppState>
    ) {}
}