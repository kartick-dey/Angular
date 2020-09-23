import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CustomValidators } from '@myapp-shared/custom-validator/custom.validators';
import { Subscription, timer } from 'rxjs';
import { retryWhen, scan, delayWhen } from 'rxjs/operators';
import { LoginServiceService } from './login-service.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {
  public passwordFieldTextType = false;
  public loginForm: FormGroup;
  public authMessage: string;
  public isLoading = false;
  public loginSubs = new Subscription();
  public validationMessages = {
    'email': {
      'required': 'Email is required!',
      'patternError': 'Enter a valid email!'
    },
    'password': {
      'required': 'Password required!',
      'minlength': 'Password should be atleast 6 Characters!'
    },
  };
  public fieldErrors = {
    'password': '',
    'email': '',
  };

  constructor(private formBuilder: FormBuilder,
    private loginService: LoginServiceService) { }

  ngOnInit(): void {
    // It will create login from control.
    this.loginFormCreation();

    // This observable will call logValidationError() in every value change into form.
    this.loginSubs.add(this.loginForm.valueChanges.subscribe(value =>
      this.logValidationErrors(this.loginForm)));

    // This obserable will call showPassword() in every value change in ShowPassword checkbox.
    this.loginSubs.add(this.loginForm.get('showPassword').valueChanges
      .subscribe(value => this.showPassword(value)))
  }

  // This will create a form control.
  public loginFormCreation(): void {
    this.loginForm = this.formBuilder.group({
      email: ["", [Validators.required, CustomValidators.pattern]],
      password: ["", [Validators.required, Validators.minLength(6)]],
      showPassword: [""]
    })
  }

  // This method is implemented for logging the error of every form elemenet.
  public logValidationErrors(group: FormGroup = this.loginForm): void {
    Object.keys(group.controls).forEach((key: string) => {
      const abstractControl = group.get(key);
      this.fieldErrors[key] = '';
      if (abstractControl && abstractControl.errors &&
        (abstractControl.touched || abstractControl.dirty)) {
        const messages = this.validationMessages[key];
        for (const errorKey in abstractControl.errors) {
          if (errorKey) {
            this.fieldErrors[key] = messages[errorKey];
          }
        }
      }
    })
  }

  // This function will help to toggle show and hide password into form password field 
  //by changing the value of passwordFieldTextType
  public showPassword(value: boolean): void {
    if (value) {
      this.passwordFieldTextType = true;
    } else {
      this.passwordFieldTextType = false;
    }
  }

  // This will submit the form data into backend through logIn() service call.
  public onSubmit(event: Event): void {
    event.preventDefault();
    if (this.loginForm.invalid) {
      return
    }
    this.isLoading = true;
    const email = this.loginForm.get("email").value;
    const password = this.loginForm.get("password").value;

    // This subcription will call 3 time if any error is occured.
    this.loginSubs.add(this.loginService.login(email, password)
      .pipe(
        retryWhen(error => {
          console.log("error : ", error);
          return error.pipe(scan(retryCount => {
            if (retryCount > 3) {
              throw error;
            } else {
              this.authMessage = "Retrying .....(" + retryCount + ")";
              retryCount++;
              return retryCount;
            }
          }, 1),
            delayWhen(() => timer(1000)))
        })
      )
      .subscribe(
        resData => {
          console.log("resData : ", resData);
          this.authMessage = resData['message'];
          console.log("authMessage : ", this.authMessage);
          this.isLoading = false;
          this.loginForm.reset()
        },
        resError => {
          
          console.log("resError : ", resError);
          this.authMessage = "Server is not responding, Please try later!";
          console.log("authMessage : ", this.authMessage);
          this.isLoading = false;
        }))
  }

  ngOnDestroy() {
    this.loginSubs.unsubscribe();
  }

}
