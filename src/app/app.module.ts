import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { NgIdleKeepaliveModule } from '@ng-idle/keepalive';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CoreModule } from './core.module';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { HeaderComponent } from './header/header.component';
import { SocialLoginModule } from 'angularx-social-login';
import { SharedModule } from '@myapp-shared/shared.module';
import { BootstrapTutorialComponent } from './bootstrap-tutorial/bootstrap-tutorial.component';
import { LoginComponent } from './login/login.component';
import { ForgetPasswordComponent } from './forget-password/forget-password.component';
import { RegisterAddressComponent } from './custom-value-accessor/register-address/register-address.component';
import { AddressComponent } from './custom-value-accessor/address/address.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    PageNotFoundComponent,
    BootstrapTutorialComponent,
    LoginComponent,
    ForgetPasswordComponent,
    RegisterAddressComponent,
    AddressComponent,
  ],
  imports: [
    BrowserModule,
    SocialLoginModule,
    HttpClientModule,
    NgIdleKeepaliveModule.forRoot(),
    SharedModule,
    CoreModule,
    AppRoutingModule,
    NgbModule,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }




// """Feature Module""" - 
// """Shared Module""" - Shared module contains all the commonly used directives, pipes and components 
// that we want to share with the other module that import this sharedModule
// """Core Module""" -  Core module will store all services.