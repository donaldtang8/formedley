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
                'https://formedley-21c58-default-rtdb.firebaseio.com/forms.json',
                formsState.form
            )
        })
    )

    @Effect()
    fetchForms = this.actions$.pipe(
        ofType(FormsActions.FETCH_FORMS),
        switchMap(() => {
            return this.http.get<any>(
                'https://formedley-21c58-default-rtdb.firebaseio.com/forms.json',
            )
        }),
        map((responseObj) => {
            let forms = [];
            for (let obj in responseObj) {
                const formObj = responseObj[obj];
                const newForm = new Form(formObj.title, formObj.userId, formObj.inputs);
                newForm.id = obj;
                forms.push(newForm);
            }
            return forms;
        }),
        map(forms => {
            console.log(forms);
            return new FormsActions.SetForms(forms);
        })
    )

    constructor(
        private actions$: Actions<FormsActions.FormsActions>,
        private http: HttpClient,
        private store: Store<fromApp.AppState>
    ) {}
}