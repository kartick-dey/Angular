import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { CustomValidators } from 'src/app/shared/custom-validator/custom.validators';
import { ActivatedRoute, Router } from '@angular/router';
import { EmployeeService } from '../shared/employee.service';
import { IEmployee } from '../shared/IEmployee';
import { ISkill } from '../shared/ISkill';

@Component({
  selector: 'app-create-employee',
  templateUrl: './create-employee.component.html',
  styleUrls: ['./create-employee.component.css']
})
export class CreateEmployeeComponent implements OnInit {
  public employeeForm: FormGroup;
  public employee;
  public pageTitle: string;
  public validationMessages = {
    'fullName': {
      'required': 'Full name required.',
      'minlength': 'Full Name must be greater than 2 characters.',
      'maxlength': 'Full Name must be less than 20 characters.'
    },
    'email': {
      'required': 'Email is required.',
      'emailDomain': 'Your email domain should be "kd.com" '
    },
    'confirmEmail': {
      'required': 'Email is required.'
    },
    'emailGroup': {
      'emailMismatch': "Confirm email doesn't match."
    },
    'phone': {
      'required': 'Phone is required.',
      'minlength': 'Phone number should be 10 digits.',
      'maxlength': 'Phone number should be 10 digits.'
    }
  };
  public formErrors = {
    'fullName': '',
    'email': '',
    'confirmEmail': '',
    'emailGroup': '',
    'phone': ''
  };
  constructor(private fb: FormBuilder,
    private route: ActivatedRoute,
    private emplpoyeeService: EmployeeService,
    private router: Router) { }

  ngOnInit() {
    this.formCreation();
    this.employeeForm.valueChanges.subscribe(data => {
      this.logValidationErrors(this.employeeForm);
    });
    this.employeeForm.get('contactPreference').valueChanges.subscribe((value: string) => {
      this.onContactPreferenceChange(value);
    });
    this.route.paramMap.subscribe(params => {
      const empId = +params.get('id');
      if (empId) {
        this.pageTitle = "Edit Employee"
        this.getEmployee(empId);
      } else {
        this.pageTitle = "Create Employee"
        this.employee = {
          id: null,
          fullName: '',
          contactPreference: '',
          email: '',
          phone: null,
          skills: []
        };
      }
    })
  }

  getEmployee(empId: number): void {
    this.emplpoyeeService.getEmployee(empId).subscribe(
      (employee: IEmployee) => {
        this.editEmployee(employee);
        this.employee = employee;
      },
      (error) => console.log(error)
    );
  }
  editEmployee(employee: IEmployee): void {
    this.employeeForm.patchValue({
      fullName: employee.fullName,
      contactPreference: employee.contactPreference,
      emailGroup: {
        email: employee.email,
        confirmEmail: employee.email
      },
      phone: employee.phone
    });

    this.employeeForm.setControl('skills', this.setExixtingSkills(employee.skills));
  }
  setExixtingSkills(skillSets): FormArray {
    const formArray = new FormArray([]);
    skillSets.forEach(skillSet => {
      formArray.push(this.fb.group({
        skillName: skillSet.skillName,
        experience: skillSet.experience,
        proficiency: skillSet.proficiency
      }))
    });
    return formArray;
  }

  formCreation(): void {
    this.employeeForm = this.fb.group({
      // Validation function provided by Validator class - 1. required, 
      // 2. requiredTrue, 3. email, 4. pattern, 5. min, 6. max, 7. minLength, 8. maxLength
      fullName: ["", [Validators.required, Validators.minLength(2), Validators.maxLength(20)]],  // required, minLength, maxLength    
      contactPreference: ["email"],
      emailGroup: this.fb.group({
        email: ["", [Validators.required, CustomValidators.emailDomain("kd.com")]],
        confirmEmail: ["", Validators.required]
      }, { validator: CustomValidators.matchEmail }),
      phone: [""],
      skills: this.fb.array([
        this.addSkillFormGroup()
      ])
    });

    // this.employeeForm = new FormGroup({
    //   fullName: new FormControl(),
    //   email: new FormControl(),
    //   skills: new FormGroup({
    //     skillName: new FormControl(),
    //     experience: new FormControl(),
    //     proficiency: new FormControl()
    //   })
    // });
  }

  addSkillFormGroup(): FormGroup {
    return this.fb.group({
      skillName: ["", Validators.required],
      experience: ["", Validators.required],
      proficiency: ["", Validators.required]
    })
  }

  removeSkillButtonClick(skillGroupIndex: number): void {
    const skillsFormArray = <FormArray>this.employeeForm.get('skills');
    skillsFormArray.removeAt(skillGroupIndex);
    skillsFormArray.markAsDirty();
    skillsFormArray.markAsTouched();
  }

  addSkillButtonClick(): void {
    (<FormArray>this.employeeForm.get('skills')).push(this.addSkillFormGroup());
  }

  onContactPreferenceChange(selectedValue: string): void {
    const phoneControl = this.employeeForm.get('phone');
    if (selectedValue === "phone") {
      phoneControl.setValidators([Validators.required, Validators.minLength(10), Validators.maxLength(10)]);
    } else {
      phoneControl.clearValidators();
    }
    phoneControl.updateValueAndValidity();
  }
  logValidationErrors(group: FormGroup = this.employeeForm): void {
    Object.keys(group.controls).forEach((key: string) => {
      const abstractControl = group.get(key);
      this.formErrors[key] = '';
      if (abstractControl && abstractControl.errors &&
        (abstractControl.touched || abstractControl.dirty || abstractControl.value !== '')) {
        const messages = this.validationMessages[key];
        for (const errorKey in abstractControl.errors) {
          if (errorKey) {
            this.formErrors[key] += messages[errorKey] + " ";
          }
        }
      }
      if (abstractControl instanceof FormGroup) {
        this.logValidationErrors(abstractControl);
      }
    })
  }


  onLoadDataClick(): void {
    this.logValidationErrors(this.employeeForm);
    console.log(this.formErrors);

    // setValue() use to set value of entire form and
    // patchValue() use to set value part of the form.
    // this.employeeForm.setValue({
    //   fullName: "Kartick Dey",
    //   email: "kartick_d@gmail.com",
    //   skills: {
    //     skillName: "Python",
    //     experience: 5,
    //     proficiency: "advanced"
    //   }
    // })
  }

  // In a reactive from we create instance of FormGroup and formControl.
  // Both classes inherit from AbstractControl base class.
  // The abstractControl class has property to tract both FormControl and FormGroup value and State
  // The properties are 1. value, 2. errors, 3. valid, 4. invalid, 5. dirty, 6. pristine,
  // 7. touched and 8. untouched. 
  // To 

  onSubmit(): void {
    this.mapFormValuesToEmployeeModel();
    if (this.employee.id) {
      this.emplpoyeeService.updateEmployee(this.employee).subscribe(() =>
        this.router.navigate(['list']),
        (error: any) => console.log(error)
      );
    } else {
      this.emplpoyeeService.addEmployee(this.employee).subscribe(() =>
        this.router.navigate(['list']),
        (error: any) => console.log(error)
      );
    }
   }
  mapFormValuesToEmployeeModel() {
    this.employee.fullName = this.employeeForm.value.fullName;
    this.employee.contactPreference = this.employeeForm.value.contactPreference;
    this.employee.email = this.employeeForm.value.emailGroup.email;
    this.employee.phone = this.employeeForm.value.phone;
    this.employee.skills = this.employeeForm.value.skills;
    // console.log(this.employee);
    
  }

}