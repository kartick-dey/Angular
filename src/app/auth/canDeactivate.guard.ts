import { CanDeactivate } from '@angular/router';
import { AuthenticationService } from './auth.service';
import { AuthComponent } from './auth.component';

export class AuthCanDeactiveGuard implements CanDeactivate<AuthComponent> {
    constructor(private authService: AuthenticationService) {}
    canDeactivate(): boolean {
        if (this.authService.loggedIn()) {
            return false;
        } else {
            return true;
        }

    }
}