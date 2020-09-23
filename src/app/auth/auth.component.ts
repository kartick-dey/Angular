import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CustomValidators } from '@myapp-shared/custom-validator/custom.validators';
import { AuthenticationService, AuthResponseData } from './auth.service';
import { Observable, Subscription, BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';
import { AuthService } from 'angularx-social-login';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit, OnDestroy {
  public authForm: FormGroup;
  public authMessage: string;
  public isLoginMode = true;
  public isLoading = false;
  public error: string = null;
  private authSub: Subscription;
  public passwordFieldTextType = false;
  public validationMessages = {
    'email': {
      'required': 'Email is required.',
      'pattern': 'Enter a valid email id.'
    },
    'password': {
      'required': 'Password required.'
    },
  };
  public formErrors = {
    'password': '',
    'email': '',
  };


  constructor(private fb: FormBuilder,
              private authService: AuthenticationService,
              private router: Router,
              private socialAuthService: AuthService) { }

  ngOnInit(): void {
    this.authFormCreation();
    this.authForm.valueChanges.subscribe(value => this.logValidationErrors())
     
  }

  

  // This is the form creation method 
  authFormCreation (): void {
    this.authForm = this.fb.group({
      email: ["", [Validators.required, CustomValidators.pattern]],
      password: ["", Validators.required]
    });
  }

  // This method will log the validation error message into class property
  public logValidationErrors(group: FormGroup = this.authForm): void {
    Object.keys(group.controls).forEach((key: string) => {
      const abstractControl = group.get(key);
      this.formErrors[key] = '';
      if (abstractControl && abstractControl.errors &&
        (abstractControl.touched || abstractControl.dirty)) {
        const messages = this.validationMessages[key];
        for (const errorKey in abstractControl.errors) {
          if (errorKey) {
            this.formErrors[key] += messages[errorKey] + " ";
          }
        }
      }
    })
  }

  public togglePasswordFieldTextType(): void {
    this.passwordFieldTextType = !this.passwordFieldTextType;
  }

  // This method will triggered by clicking the "LoginWithGoogle" button. 
  public loginWithGoogle(): void {
    this.authService.googleLogin();
  }

  // This method will triggered by clicking the "LoginWithFacbook" button.
  public loninWithFB() {
    this.authService.facebookLogin();
  }

  public onSwtichMode() : void {
    this.isLoginMode = !this.isLoginMode;
  }

  public onSubmit(): void {
    this.error = null;
    if (!this.authForm.valid) {
      return;
    }
    const email = this.authForm.get("email").value;
    const password = this.authForm.get("password").value;

    this.isLoading = true;
    let authObs: Observable<AuthResponseData>

    if (this.isLoginMode) {
      authObs = this.authService.logIn(email, password);
      this.authMessage = "Successfully Logged In!";
    } else {
      authObs = this.authService.singnUp(email, password);
      this.authMessage = "Successfully Signed Up!";
    }

    // This subscription will help to post the data into server or fetch the data from the server.
    this.authSub = authObs.subscribe(
      resData => {
        this.isLoading = false;
        this.authService.authMessage.next(this.authMessage);
        this.router.navigate(["/registration"]);
      },
      errRes => {
        console.log(errRes);
        this.error = errRes;
        this.isLoading = false;
      });

    this.authForm.reset();    
  }

  ngOnDestroy() {
    if (this.authSub) {
      this.authSub.unsubscribe();
    }
  }

}
