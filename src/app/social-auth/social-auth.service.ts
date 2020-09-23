import { Injectable } from '@angular/core';
import { AuthService, FacebookLoginProvider, SocialUser, GoogleLoginProvider } from 'angularx-social-login';
import { Observable } from 'rxjs';

@Injectable()
export class SocialAuthenticationService {
    constructor(private authService: AuthService) {}

    public facebookLogin(): Promise<SocialUser> {
        return this.authService.signIn(FacebookLoginProvider.PROVIDER_ID)
    }
    public googleLogin(): Promise<SocialUser> {
        return this.authService.signIn(GoogleLoginProvider.PROVIDER_ID)
    }
}