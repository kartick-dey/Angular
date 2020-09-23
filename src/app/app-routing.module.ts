import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { CutomPreloadStrategyService } from './cutom-preload-strategy.service';
import { BootstrapTutorialComponent } from './bootstrap-tutorial/bootstrap-tutorial.component';
import { LoginComponent } from './login/login.component';
import { ForgetPasswordComponent } from './forget-password/forget-password.component';


const appRoutes: Routes = [
  { path: '', redirectTo: '/auth', pathMatch: 'full' },
  {
    path: 'registration',
    loadChildren: () => import('./registration-form/registration-form.module')
      .then(m => m.RegistrationFormModule)
  },
  {
    path: 'employee-details',
    data: { preload: true },
    loadChildren: () => import('./pipes-example/pipe.module').then(m => m.PipeModule)
  },
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule)
  },
  { path: 'bootstrap', component: BootstrapTutorialComponent},
  { path: 'login', component: LoginComponent},
  { path: 'forget-password', component: ForgetPasswordComponent },
  { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  imports: [
    RouterModule.forRoot(appRoutes, { preloadingStrategy: CutomPreloadStrategyService})
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }

// """"forRoot()"""" - Registers the specified routes and create a Router service instance and 
// register it with the angular dependency injector.
// """"forChild()"""" - Registers the specified routes and tells angular to reuse the Router
// service instance that forRoot() has created.