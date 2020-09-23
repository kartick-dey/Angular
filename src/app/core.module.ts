import { NgModule } from '@angular/core';
import { HTTP_INTERCEPTORS } from '@angular/common/http';

import { EmployeePipeService } from './pipes-example/employee-pipe.service';
import { AuthInterceptorService } from './auth/auth-interceptor.service';
import { RegistrationService } from './registration-form/registration.service';
import { AuthenticationService } from './auth/auth.service';
import { AuthCanActivateGuard } from './auth/auth.guard';
import { UserResolverGuard } from './pipes-example/user-rsolver.guard';
import { RegistrationCanDeactivateGuard } from './registration-form/registration.guard';
import { AuthService, AuthServiceConfig } from 'angularx-social-login';
import { provideSocialAuthConfig } from './auth/socialAuth.config';

@NgModule({
    providers: [
        {
            provide: AuthServiceConfig,
            useFactory: provideSocialAuthConfig
        },
        EmployeePipeService,
        RegistrationService,
        AuthenticationService,
        AuthCanActivateGuard,
        UserResolverGuard,
        RegistrationCanDeactivateGuard,
        AuthService
    ]
})
export class CoreModule {}