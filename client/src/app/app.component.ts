import { Component } from '@angular/core';
import { Store } from '@ngrx/store';

import * as fromApp from './store/app.reducer';
import * as AuthActions from './store/auth/auth.actions';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'formedley';

  constructor(private store: Store<fromApp.AppState>) {}

  ngOnInit() {
    if (localStorage.getItem('userData')) {
      this.store.dispatch(new AuthActions.AutoLogin());
    }
  }

  logout() {
    this.store.dispatch(new AuthActions.Logout());
    console.log('Logging out');
  }
}
