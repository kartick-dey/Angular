import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { CustomValidators } from '@myapp-shared/custom-validator/custom.validators';
import { Subscription, merge } from 'rxjs';
import { RegistrationService, IUserModel } from './registration.service';
import { ActivatedRoute } from '@angular/router';
import { AuthenticationService } from 'app/auth/auth.service';

@Component({
  selector: 'app-registration-form',
  templateUrl: './registration-form.component.html',
  styleUrls: ['./registration-form.component.css']
})
export class RegistrationFormComponent implements OnInit, OnDestroy {
  public registrationForm: FormGroup;
  public successMessage: string;
  public authMessage: string;
  public authMessageSub: Subscription;
  public failMessage: string;
  public userRegistrationData: IUserModel = {
    fullName: '',
    password: '',
    otpPreferenece: '',
    address: {
      street: '',
      city: '',
      state: '',
      country: '',
      postalCode: '',
    }
  };
  public passwordFieldTextType = false;
  public confirmPasswordFieldTextType = false;
  public otpPreferenceValue: string;
  public submitButtonStatus = false;
  public regSub = new Subscription();
  // private valueChangeSub: Subscription;
  public validationMessages = {
    fullName: {
      required: 'Full name required.',
      minlength: 'Full Name must be greater than 2 characters.',
      maxlength: 'Full Name must be less than 20 characters.'
    },
    password: {
      required: 'Password required.',
      minlength: 'Password will contain atleast 6 characters.',
      maxlength: 'Password should not be greater than 15 characters.',
      passwordValidationSyError: 'Can\'t contain this symbol, only[ ! @ # _ - ]',
      passwordValidationError: 'Password should be contain 1 capital, 1 small, 1 numeric and 1 symbol character.'
    },
    confirmPassword: {
      matchPasswordError: 'Confirm Password doesn\'t match'
    },
    otpPreference: {
      required: 'OTP Preference is required.'
    },
    otpPreferenceField: {
      required: 'email is required.'
    },
    email: {
      required: 'Email is required.',
      patternError: 'Enter a valid email id.',
      emailDomainError: 'Your email domain should be "kd.com".'
    },
    phone: {
      required: 'Phone is required.',
      validPhoneNumberError: 'Enter a Valid Phone Number.',
      minlength: 'Phone number should be 10 digits.',
      maxlength: 'Phone number should be 10 digits.'
    },
    street: {
      required: 'Street is required.'
    },
    city: {
      required: 'City is required.'
    },
    state: {
      required: 'State is required.'
    },
    country: {
      required: 'Country is required.'
    },
    postalCode: {
      required: 'Postal Code required.',
      numericValueValidationError: 'Please enter a valid Pin Code.',
      minlength: 'Postal Code must be 6 characters.',
      maxlength: 'Postal Code must be 6 characters.'
    }
  };

  public formErrors = {
    fullName: '',
    password: '',
    confirmPassword: '',
    passwordGroup: '',
    otpPreference: '',
    otpPreferenceField: '',
    email: '',
    phone: '',
    street: '',
    city: '',
    state: '',
    country: '',
    postalCode: ''
  };
  public isLoading = false;

  constructor(private fb: FormBuilder,
              private registrationService: RegistrationService,
              private route: ActivatedRoute,
              private authService: AuthenticationService) { }

  ngOnInit(): void {
    this.registrationFormCreation();
    this.authMessage = this.authService.authMessage.value;
    this.authService.authMessage.next(null);
    // This observable will triggered each an every value insertion in form field
    // and it will call the logValidation() method and dynamically form creation method.
    this.regSub.add(merge(
      this.registrationForm.valueChanges,
      this.registrationForm.get('otpPreference').valueChanges
    ).subscribe(
      value => {
        this.logValidationErrors(this.registrationForm);
        if (value === 'phone' || value === 'email') {
          this.addOTPPreferenceField(value);
        }
      }
    ));
    // This subscription will watch both value in pwd or cnfmPwd and triggered the validation.
    this.regSub.add(this.registrationForm.controls.password.valueChanges.subscribe(
      value => this.registrationForm.controls.confirmPassword.updateValueAndValidity()
    ));
  }

  // This method will add the form control dynamically using Dynamically add validator
  public addOTPPreferenceField(selectedValue: string): void {
    this.otpPreferenceValue = selectedValue;
    const phoneControl = this.registrationForm.get('phone') as FormControl;
    const emailControl = this.registrationForm.get('email') as FormControl;
    if (selectedValue === 'phone') {
      phoneControl.setValidators([Validators.required,
      CustomValidators.validPhoneNumber,
      Validators.minLength(10),
      Validators.maxLength(10)]);
      emailControl.clearValidators();
    } else {
      emailControl.setValidators([Validators.required,
      CustomValidators.pattern,
      CustomValidators.emailDomain('kd.com')]);
      phoneControl.clearValidators();
    }
    phoneControl.updateValueAndValidity();
    emailControl.updateValueAndValidity();
  }

  // This is form control creation method
  public registrationFormCreation(): void {
    this.registrationForm = this.fb.group({
      fullName: ['', [Validators.required,
      Validators.minLength(2),
      Validators.maxLength(20)]],
      password: ['', [Validators.required,
        Validators.minLength(6),
        CustomValidators.passwordValidation,
        Validators.maxLength(15)]],
      confirmPassword: ['', CustomValidators.matchPassword],
      address: this.fb.group({
        street: ['', Validators.required],
        city: ['', Validators.required],
        state: ['', Validators.required],
        country: ['', Validators.required],
        postalCode: ['', [Validators.required,
          Validators.minLength(6),
          Validators.maxLength(6),
          CustomValidators.numericValueValidation]]
      }),
      otpPreference: ['', Validators.required],
      // Used for Dinamically add validator to implement dynamic field add into HTML page
      phone: [''],
      email: [''],
      // Used for Disabled Enabled property to implement dynamic field add into HTML page
      // phone: new FormControl({ value: '', disabled: true }, [Validators.required,
      //                                                       CustomValidators.validPhoneNumber,
      //                                                       Validators.minLength(10),
      //                                                       Validators.maxLength(10)]),
      // email: new FormControl({ value: '', disabled: true }, [Validators.required,
      //                                                       CustomValidators.validPhoneNumber,
      //                                                       Validators.minLength(10),
      //                                                       Validators.maxLength(10)])
    });
  }

  // ----------Dynamically add field into HTML page-------------------
  // 1. Dynamically Add a Control using { addControl(), removeControl(), updateValueAndValidity()}
  // 2. Dynamically Add Validators using { setValidators(), clearValidators(), updateValueAndValidity()}
  // 3. Disable the Control using { enable(), disable()}
  // but you need to declear the formcontrol as disable initially
  // rawValue()


  // public addControlUsingDynamicAddControl(value: string): void {
  // this.otpPreferenceValue = value;
  //   if (value === "Phone") {
  //     this.registrationForm.addControl("phone",
  //       new FormControl('', [Validators.required,
  //       CustomValidators.validPhoneNumber,
  //       Validators.minLength(10),
  //       Validators.maxLength(10)])
  //     );
  //     this.registrationForm.removeControl('email');
  //   } else {
  //     this.registrationForm.addControl("email",
  //       new FormControl('', [Validators.required,
  //                            CustomValidators.pattern])
  //     );
  //     this.registrationForm.removeControl('Phone');
  //   }
  //   this.registrationForm.updateValueAndValidity();
  // }

  // public addControlsUsingDisabledProperty(value: string): void {
  //   this.otpPreferenceValue = value;
  //   const phoneControl = this.registrationForm.get('phone') as FormControl;
  //   const emailControl = this.registrationForm.get('email') as FormControl;
  //   if (value === 'phone') {
  //     phoneControl.enabled();
  //     emailControl.disabled();
  //   } else {
  //     emailControl.enabled();
  //     phoneControl.disabled();
  //   }
  // }

  // This method is implemented for logging the error of every form elemenet
  public logValidationErrors(group: FormGroup = this.registrationForm): void {
    Object.keys(group.controls).forEach((key: string) => {
      const abstractControl = group.get(key);
      this.formErrors[key] = '';
      if (abstractControl && abstractControl.errors &&
        (abstractControl.touched || abstractControl.dirty)) {
        const messages = this.validationMessages[key];
        for (const errorKey in abstractControl.errors) {
          if (errorKey) {
            this.formErrors[key] = messages[errorKey];
          }
        }
      }
      if (abstractControl instanceof FormGroup) {
        this.logValidationErrors(abstractControl);
      }
    });
  }

  public togglePasswordFieldTextType(): void {
    this.passwordFieldTextType = !this.passwordFieldTextType;
  }

  public toggleConfirmPasswordFieldTextType(): void {
    this.confirmPasswordFieldTextType = !this.confirmPasswordFieldTextType;
  }

  // This is method will help to submit the form after clicking the submit button.
  public onSubmit(event: Event): void {
    event.preventDefault(); //
    if (this.registrationForm.valid) {
      this.submitButtonStatus = true;
      this.isLoading = true;
      this.userRegistrationData = this.mapFormValueToUserModel();
      // console.log("UserData", this.userRegistrationData);
      this.successMessage = '';
      this.failMessage = '';
      if (this.userRegistrationData) {
        this.regSub.add(this.registrationService.addUser(this.userRegistrationData).subscribe(
          resData => {
            this.successMessage = 'Successfully Registered';
            this.isLoading = false;
            this.registrationForm.reset();
            this.authMessage = '';
            // console.log(this.registrationForm);
          },
          resError => {
            this.failMessage = 'Fail to Registered';
            this.isLoading = false;
            this.submitButtonStatus = false;
            this.authMessage = '';
          }
        ));
      }
    }

  }
  // This method will map form value to class property
  public mapFormValueToUserModel(): IUserModel {
    const userRegistrationData = Object.assign({}, this.registrationForm.value);
    console.log('this.userRegistrationData : ', userRegistrationData);
    if (this.registrationForm.value.otpPreference === 'phone') {
      delete userRegistrationData.email;
      delete userRegistrationData.otpPreference;
      delete userRegistrationData.confirmPassword;
      Object.defineProperty(userRegistrationData, 'otpPreference',
        Object.getOwnPropertyDescriptor(userRegistrationData, 'phone'));
      delete userRegistrationData['phone'];
    } else {
      delete userRegistrationData.phone;
      delete userRegistrationData.otpPreference;
      delete userRegistrationData.confirmPassword;
      Object.defineProperty(userRegistrationData, 'otpPreference',
        Object.getOwnPropertyDescriptor(userRegistrationData, 'email'));
      delete userRegistrationData['email'];
    }
    console.log('UserRegistrationData : ', userRegistrationData);

    return userRegistrationData;

  }
  ngOnDestroy() {
    this.regSub.unsubscribe();
  }

}


  // private slidePageList = [];
  // private stepList = [];

  // @ViewChild('content') content;
  // @ViewChild('platformSelection') platformSelection;
  // @ViewChild('createInstanceBtn') createInstanceBtn;
  // @ViewChild('createClusterBtn') createClusterBtn;
  // @ViewChild('nextBtn1') nextBtn1;
  // @ViewChild('nextBtn2') nextBtn2;
  // @ViewChild('nextBtn3') nextBtn3;
  // @ViewChild('nextBtn4') nextBtn4;
  // @ViewChild('nextBtn5') nextBtn5;
  // @ViewChild('prevBtn1') prevBtn1;
  // @ViewChild('prevBtn2') prevBtn2;
  // @ViewChild('prevBtn3') prevBtn3;
  // @ViewChild('prevBtn4') prevBtn4;
  // @ViewChild('step1') step1;
  // @ViewChild('step2') step2;
  // @ViewChild('step3') step3;
  // @ViewChild('step4') step4;
  // @ViewChild('step5') step5;
  // @ViewChild('step6') step6;
  // @ViewChild('slidePage1') slidePage1: ElementRef;
  // @ViewChild('slidePage2') slidePage2: ElementRef;
  // @ViewChild('slidePage3') slidePage3: ElementRef;
  // @ViewChild('slidePage4') slidePage4: ElementRef;
  // @ViewChild('slidePage5') slidePage5: ElementRef;
  // @ViewChild('slidePage6') slidePage6: ElementRef;


  // Cancel Button function and it help to go platform selection page.
  // public onCancel(): void {
  //   this.show = !this.show;
  //   this.header = 'Select a Cloud Platform to create cluster.';
  //   this.renderer.setStyle(this.platformSelection.nativeElement, 'display', 'block');
  //   this.renderer.setStyle(this.content.nativeElement, 'border-radius', '10px 10px 10px 10px');
  //   this.slidePageList.splice(0);
  //   this.stepList.splice(0);
  // }

  // Edit Cluster Details funtion.

  // public onEdit(stepNo: number, header: string): void {
  //   this.header = 'Step ' + stepNo.toString() + ': ' + header;
  //   const slidePage = this.slidePageList[stepNo - 1];
  //   const step = this.stepList[stepNo - 1];
  //   // This will remove all active and completed class from step bar after this step.
  //   // tslint:disable-next-line: align
  //   for (let i = stepNo - 1; i < this.stepList.length; i ++){
  //     this.renderer.removeClass(this.stepList[i], 'completed');
  //     this.renderer.removeClass(this.stepList[i], 'active');
  //   }
  //   this.renderer.setStyle(this.platformSelection.nativeElement, 'display', 'none');
  //   this.renderer.removeClass(this.step6.nativeElement, 'active');
  //   this.renderer.setStyle(this.content.nativeElement, 'border-radius', '10px 10px 35px 35px');
  //   this.renderer.setStyle(slidePage, 'display', 'block');
  //   this.renderer.removeClass(step, 'completed');
  //   this.renderer.addClass(step, 'active');
  //   this.stepList.splice(stepNo - 1);
  // }

  // // Dom Handling Function. It helps to go between different form step.
  // public domHandling(): void {
  //   // Create Cluster Btn Evenethandling.
  //   this.renderer.listen(this.createInstanceBtn.nativeElement, 'click',
  //     () => {
  //       this.show = !this.show;
  //       this.renderer.setStyle(this.platformSelection.nativeElement, 'display', 'none');
  //       this.renderer.setStyle(this.slidePage1.nativeElement, 'display', 'block');
  //       this.renderer.setStyle(this.content.nativeElement, 'border-radius', '10px 10px 35px 35px');
  //       this.header = 'Step 1: Basic';
  //       this.slidePageList.push(this.slidePage1.nativeElement);
  //       // console.log(this.clusterCreationForm.get('platformSelection').value);
  //     });
  //   // Next Button Click EventHandling.
  //   this.renderer.listen(this.nextBtn1.nativeElement, 'click',
  //     () => {
  //       this.renderer.setStyle(this.slidePage1.nativeElement, 'display', 'none');
  //       this.renderer.setStyle(this.slidePage2.nativeElement, 'display', 'block');
  //       this.renderer.setStyle(this.content.nativeElement, 'border-radius', '10px 10px 35px 35px');
  //       this.renderer.removeClass(this.step1.nativeElement, 'active');
  //       this.renderer.addClass(this.step1.nativeElement, 'completed');
  //       this.renderer.addClass(this.step2.nativeElement, 'active');
  //       this.header = 'Step 2: Hardware & Storage';
  //       this.slidePageList.push(this.slidePage2.nativeElement);
  //       this.stepList.push(this.step1.nativeElement);
  //       // console.log(this.clusterCreationForm.get('basicDetails').value);
  //     });
  //   this.renderer.listen(this.nextBtn2.nativeElement, 'click',
  //     () => {
  //       this.renderer.setStyle(this.slidePage2.nativeElement, 'display', 'none');
  //       this.renderer.setStyle(this.slidePage3.nativeElement, 'display', 'block');
  //       this.renderer.setStyle(this.content.nativeElement, 'border-radius', '10px 10px 35px 35px');
  //       this.renderer.removeClass(this.step2.nativeElement, 'active');
  //       this.renderer.addClass(this.step2.nativeElement, 'completed');
  //       this.renderer.addClass(this.step3.nativeElement, 'active');
  //       this.header = 'Step 3: Network & Availablity';
  //       this.slidePageList.push(this.slidePage3.nativeElement);
  //       this.stepList.push(this.step2.nativeElement);
  //       // console.log(this.clusterCreationForm.get('hardwareAndStorage').value);
  //     });
  //   this.renderer.listen(this.nextBtn3.nativeElement, 'click',
  //     () => {
  //       this.renderer.setStyle(this.slidePage3.nativeElement, 'display', 'none');
  //       this.renderer.setStyle(this.slidePage4.nativeElement, 'display', 'block');
  //       this.renderer.setStyle(this.content.nativeElement, 'border-radius', '10px 10px 35px 35px');
  //       this.renderer.removeClass(this.step3.nativeElement, 'active');
  //       this.renderer.addClass(this.step3.nativeElement, 'completed');
  //       this.renderer.addClass(this.step4.nativeElement, 'active');
  //       this.header = 'Step 4: Configure Security';
  //       this.slidePageList.push(this.slidePage4.nativeElement);
  //       this.stepList.push(this.step3.nativeElement);
  //       // console.log(this.clusterCreationForm.get('networkAndAvailability').value);
  //     });
  //   this.renderer.listen(this.nextBtn4.nativeElement, 'click',
  //     () => {
  //       this.renderer.setStyle(this.slidePage4.nativeElement, 'display', 'none');
  //       this.renderer.setStyle(this.slidePage5.nativeElement, 'display', 'block');
  //       this.renderer.setStyle(this.content.nativeElement, 'border-radius', '10px 10px 35px 35px');
  //       this.renderer.removeClass(this.step4.nativeElement, 'active');
  //       this.renderer.addClass(this.step4.nativeElement, 'completed');
  //       this.renderer.addClass(this.step5.nativeElement, 'active');
  //       this.header = 'Step 5: Configure Software';
  //       this.slidePageList.push(this.slidePage5.nativeElement);
  //       this.stepList.push(this.step4.nativeElement);
  //       // console.log(this.clusterCreationForm.get('configureSoftware').value);
  //     });
  //   this.renderer.listen(this.nextBtn5.nativeElement, 'click',
  //     () => {
  //       this.renderer.setStyle(this.slidePage5.nativeElement, 'display', 'none');
  //       this.renderer.setStyle(this.slidePage6.nativeElement, 'display', 'block');
  //       this.renderer.setStyle(this.content.nativeElement, 'border-radius', '10px 10px 10px 10px');
  //       this.renderer.setStyle(this.slidePage6.nativeElement, 'padding', '0px');
  //       this.renderer.removeClass(this.step5.nativeElement, 'active');
  //       this.renderer.addClass(this.step5.nativeElement, 'completed');
  //       this.renderer.addClass(this.step6.nativeElement, 'active');
  //       this.header = 'Review Cluster Details';
  //       this.stepList.push(this.step5.nativeElement);
  //       // console.log(this.clusterCreationForm.get('configureSecurity').value);
  //     });

  //   // Previous Button Click EventHandling.

  //   this.renderer.listen(this.prevBtn1.nativeElement, 'click',
  //     () => {
  //       this.renderer.setStyle(this.slidePage2.nativeElement, 'display', 'none');
  //       this.renderer.setStyle(this.slidePage1.nativeElement, 'display', 'block');
  //       this.renderer.removeClass(this.step2.nativeElement, 'active');
  //       this.renderer.removeClass(this.step1.nativeElement, 'completed');
  //       this.renderer.addClass(this.step1.nativeElement, 'active');
  //       this.header = 'Step 2: Basic';
  //       this.slidePageList.pop();
  //       this.stepList.pop();
  //     });
  //   this.renderer.listen(this.prevBtn2.nativeElement, 'click',
  //     () => {
  //       this.renderer.setStyle(this.slidePage3.nativeElement, 'display', 'none');
  //       this.renderer.setStyle(this.slidePage2.nativeElement, 'display', 'block');
  //       this.renderer.removeClass(this.step3.nativeElement, 'active');
  //       this.renderer.removeClass(this.step2.nativeElement, 'completed');
  //       this.renderer.addClass(this.step2.nativeElement, 'active');
  //       this.header = 'Step 2: Hardware & Storage';
  //       this.slidePageList.pop();
  //       this.stepList.pop();
  //     });

  //   this.renderer.listen(this.prevBtn3.nativeElement, 'click',
  //     () => {
  //       this.renderer.setStyle(this.slidePage4.nativeElement, 'display', 'none');
  //       this.renderer.setStyle(this.slidePage3.nativeElement, 'display', 'block');
  //       this.renderer.removeClass(this.step4.nativeElement, 'active');
  //       this.renderer.removeClass(this.step3.nativeElement, 'completed');
  //       this.renderer.addClass(this.step3.nativeElement, 'active');
  //       this.header = 'Step 3: Network & Availability';
  //       this.slidePageList.pop();
  //       this.stepList.pop();
  //     });
  //   this.renderer.listen(this.prevBtn4.nativeElement, 'click',
  //     () => {
  //       this.renderer.setStyle(this.slidePage5.nativeElement, 'display', 'none');
  //       this.renderer.setStyle(this.slidePage4.nativeElement, 'display', 'block');
  //       this.renderer.removeClass(this.step5.nativeElement, 'active');
  //       this.renderer.removeClass(this.step4.nativeElement, 'completed');
  //       this.renderer.addClass(this.step4.nativeElement, 'active');
  //       this.header = 'Step 4: Configure Security';
  //       this.slidePageList.pop();
  //       this.stepList.pop();
  //     });

  // }
