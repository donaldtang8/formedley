import { Actions, Effect, ofType } from '@ngrx/effects';
import { map, tap, switchMap, withLatestFrom } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';

import * as fromApp from '../../store/app.reducer';
import * as FormsActions from '../forms/forms.actions';
import { Form } from 'src/app/core/models/form.model';
import { Router } from '@angular/router';

@Injectable()
export class FormsEffects {
    @Effect()
    addForm = this.actions$.pipe(
        ofType(FormsActions.ADD_FORM),
        switchMap((addFormAction: FormsActions.AddForm) => {
            return this.http
            .post<any>(
                'http://localhost:5000/api/forms/',
                addFormAction.payload
            )
        }),
        map((resData => {
            return new FormsActions.AddFormSuccess({
                form: resData.data.doc,
                redirect: true
            })
        }))
    )

    @Effect({
        dispatch: false
    })
    addFormSuccess = this.actions$.pipe(
        ofType(FormsActions.ADD_FORM_SUCCESS),
        tap((formAddSuccessAction: FormsActions.AddFormSuccess) => {
            if (formAddSuccessAction.payload.redirect) {
                const { id } = formAddSuccessAction.payload.form;
                this.router.navigate([`/forms/form/${id}`]);
            }
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
    fetchMyForms = this.actions$.pipe(
        ofType(FormsActions.FETCH_MY_FORMS),
        switchMap((fetchMyForms: FormsActions.FetchMyForms) => {
            return this.http.get<any>(
                `http://localhost:5000/api/forms/user/me`
            )
        }),
        map((resData) => {
            return new FormsActions.FetchFormsSuccess(resData.data.doc)
        })
    )

    constructor(
        private actions$: Actions<FormsActions.FormsActions>,
        private http: HttpClient,
        private router: Router,
        private store: Store<fromApp.AppState>
    ) {}
}