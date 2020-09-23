import { ActivatedRouteSnapshot, RouterStateSnapshot, Router, UrlTree, CanActivate } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthenticationService } from './auth.service';
import { Injectable } from '@angular/core';

@Injectable()
export class AuthCanActivateGuard implements CanActivate {
    constructor(private authService: AuthenticationService,
                private router: Router) {}
    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot):
        boolean | UrlTree | Promise<boolean | UrlTree> | Observable<boolean | UrlTree> {
        if (this.authService.loggedIn()) {
            return true;
        } else {
            alert("You are not autherized user to visit this page. Please login");
            this.authService.logout();
            return this.router.createUrlTree(["/auth"])
        }            
    }
}
