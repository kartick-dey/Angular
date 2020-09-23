import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CustomValidators } from '@myapp-shared/custom-validator/custom.validators';

@Component({
  selector: 'app-forget-password',
  templateUrl: './forget-password.component.html',
  styleUrls: ['./forget-password.component.css']
})
export class ForgetPasswordComponent implements OnInit {
  public forgetPasswordForm: FormGroup;
  public resetConfirmationStatus = false;
  public inputEmailAddress: string;
  public emailValidation: boolean;

  constructor(private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    // This will create forget password form group
    this.forgetPwdFormCreation();
    // This will call logValidation() in every form value input.
    this.forgetPasswordForm.valueChanges.subscribe(value => this.logValidation(this.forgetPasswordForm))
  }

  // Forget Password form creation.
  public forgetPwdFormCreation(): void {
    this.forgetPasswordForm = this.formBuilder.group({
      email: ["", [Validators.required, CustomValidators.pattern]]
    })
  }

  // This method is implemented for logging the email field error.
  public logValidation(group: FormGroup = this.forgetPasswordForm): void {
    Object.keys(group.controls).forEach((key: string) => {
      const abstractControl = group.get(key);
      if (abstractControl && abstractControl.errors &&
        (abstractControl.touched || abstractControl.dirty)) {
          this.emailValidation = true;        
      } else {
        this.emailValidation = false;
      }
    })
    
  }

  // This will submit the form.
  public onSubmit(event: Event): void {
    event.preventDefault();
    this.resetConfirmationStatus = true;
    this.inputEmailAddress = this.forgetPasswordForm.get('email').value;
    this.forgetPasswordForm.reset();
  }

}
