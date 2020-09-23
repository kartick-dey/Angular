import { NgModule } from '@angular/core';
import { PipesExampleComponent } from './pipes-example.component';
import { RouterModule } from '@angular/router';
import { AuthCanActivateGuard } from 'app/auth/auth.guard';
import { UserResolverGuard } from './user-rsolver.guard';
import { SharedModule } from '@myapp-shared/shared.module';

@NgModule({
    declarations: [
        PipesExampleComponent,
    ],
    imports: [
        SharedModule,
        RouterModule.forChild([{
            path: '', component: PipesExampleComponent,
            canActivate: [AuthCanActivateGuard],
            resolve: { usersList: UserResolverGuard }
        },])
    ]
})
export class PipeModule {}