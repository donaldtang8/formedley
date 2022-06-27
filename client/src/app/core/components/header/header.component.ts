import { Component, OnInit, OnDestroy, ViewChild, ElementRef, Renderer2 } from '@angular/core';
import { Store } from '@ngrx/store';
import { map, Subscription } from 'rxjs';

import * as fromApp from '../../../store/app.reducer';
import * as AuthActions from '../../../store/auth/auth.actions';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html'
})

export class HeaderComponent implements OnInit, OnDestroy {
    @ViewChild('mobileNav') mNav: ElementRef;
    isAuthenticated = false;
    private userSubscription: Subscription;

    constructor(
        private store: Store<fromApp.AppState>,
        private renderer: Renderer2
    ) {}

    ngOnInit() {
        this.userSubscription = this.store
            .select('auth')
            .pipe(
                map(authState => authState.user)
            )
            .subscribe(user => {
                this.isAuthenticated = !!user;
            });
    }

    onLogout() {
        this.store.dispatch(new AuthActions.Logout());
    }

    showMenu() {
        this.renderer.removeClass(this.mNav.nativeElement, 'invisible');
        // this.renderer.setStyle(this.mNav.nativeElement, 'display', 'block');
    }

    hideMenu() {
        this.renderer.addClass(this.mNav.nativeElement, 'invisible');
        // this.renderer.setStyle(this.mNav.nativeElement, 'display', 'none');
    }

    ngOnDestroy() {
        this.userSubscription.unsubscribe();
    }
}