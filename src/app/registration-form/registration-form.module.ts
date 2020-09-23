import { NgModule } from '@angular/core';

import { RegistrationFormComponent } from './registration-form.component';
import { RouterModule } from '@angular/router';
import { AuthCanActivateGuard } from 'app/auth/auth.guard';
import { RegistrationCanDeactivateGuard } from './registration.guard';
import { SharedModule } from '@myapp-shared/shared.module';

@NgModule({
    declarations: [
        RegistrationFormComponent,
    ],
    imports: [
        RouterModule.forChild([{
            path: '', component: RegistrationFormComponent,
            canActivate: [AuthCanActivateGuard],
            canDeactivate: [RegistrationCanDeactivateGuard]
        }]),
        SharedModule,
    ]
})
export class RegistrationFormModule {}