import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from "@angular/router";
import { Injectable } from "@angular/core";
import { map, take } from "rxjs/operators";
import { Observable } from "rxjs";
import { Store } from "@ngrx/store";
import * as fromApp from "../store/app.reducer";

@Injectable({ providedIn: "root" })
export class NotAuthGuard implements CanActivate {
    constructor( private router: Router, private store: Store<fromApp.AppState>) {}
    
    canActivate(
        route: ActivatedRouteSnapshot,
        router: RouterStateSnapshot): 
            | boolean
            | UrlTree
            | Promise<boolean | UrlTree> 
            | Observable<boolean | UrlTree> {
        return this.store.select('auth')
        .pipe(
            take(1),
            map(authState => {
                return authState.user;
            }),
            map(user => {
                const isAuth = !!user;
                if (isAuth) {
                    return false;
                    console.log('Already authenticated');
                }
                return true;
            })
        );
    }
}