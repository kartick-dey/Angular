import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { AuthComponent } from './auth.component';
import { SharedModule } from '@myapp-shared/shared.module';
import { CommonModule } from '@angular/common';

@NgModule({
    declarations: [
        AuthComponent,
    ],
    imports: [
        SharedModule,
        RouterModule.forChild([
            { path: '', component: AuthComponent },
        ])
    ]
})
export class AuthModule {}

