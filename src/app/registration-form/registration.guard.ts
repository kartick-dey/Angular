import { CanDeactivate } from '@angular/router';
import { RegistrationFormComponent } from './registration-form.component';
import { Injectable } from '@angular/core';

@Injectable()
export class RegistrationCanDeactivateGuard implements CanDeactivate<RegistrationFormComponent> {
    canDeactivate(component: RegistrationFormComponent): boolean {
        if (component.registrationForm.dirty) {
            return confirm("Are you sure you want to discard your changes?");
        } else {
            return true;
        }
    }
}