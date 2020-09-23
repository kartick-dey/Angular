import { AbstractControl } from '@angular/forms';
/// Path alise creation
export class CustomValidators {
    static emailDomain(domainName: string) {
        return (control: AbstractControl): { [key: string]: any } | null => {
            const email = control.value;
            const pattern = new RegExp('^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$');
            const domain = email.substring(email.lastIndexOf('@') + 1);           
            if (email === '' || domain.toLowerCase() === domainName.toLowerCase()) {
                return null;
            } else {
                return { 'emailDomainError': true };
            }
        };
    }

    static matchEmail(group: AbstractControl):{[key: string]: any} | null {
        const email = group.get('email');
        const confirmEmail = group.get('confirmEmail');
        if ((email.value === confirmEmail.value) || (confirmEmail.pristine && confirmEmail.value ==='')){
            return null;
        } else {
            return {'emailMismatchError': true}
        }
    }

    static pattern (control: AbstractControl): {[key: string]: any} | null {
        const email = control.value;
        const emailPattern = new RegExp('^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$');
        if (email === '' || emailPattern.test(email)) {
            return null;
        } else {
            return { 'patternError': true };
        }
    }

    static validPhoneNumber (control: AbstractControl): {[key: string]: any} | null {
        const phone = control.value;
        const phonePattern = new RegExp('^[6-9]+[0-9]{9}$');
        if (phone === '' || phonePattern.test(phone)) {
            return null;
        } else {
            return {'validPhoneNumberError': true}
        }
    }

    //
    static passwordValidation (control: AbstractControl): {[key: string]: any} | null {
        const pwd = control.value;
        const symbolRejectRegx = /[$%&/:?{~"^`\[\]]/g; // !@#_- required validation
        const symbolAcceptRegx = /[!@#_-]/g;
        const lowerLetters = /[a-z]+/.test(pwd);
        const upperLetters = /[A-Z]+/.test(pwd);
        const numbers = /[0-9]+/.test(pwd);
        const symbolsAccept = symbolAcceptRegx.test(pwd);  
        const symbolReject = symbolRejectRegx.test(pwd)     
        if (pwd === '' || upperLetters && lowerLetters && numbers && symbolsAccept) {
            if (symbolReject) {
                return { 'passwordValidationSyError': true };
            } else {
                return null;
            }
        } else {
            if (symbolReject) {
                return { 'passwordValidationSyError': true };
            } else {
                return { 'passwordValidationError': true }; //passwordValidationError;
            }
        }
    }

    static matchPassword (control: AbstractControl): {[key: string]: any} | null {
        if (control && (control.value != null || control.value != undefined)) {
            const confirmPwdValue = control.value;
            const pwdControl = control.root.get("password");
            if (pwdControl) {
                const pwdValue = pwdControl.value;
                if (pwdValue !== confirmPwdValue) {
                    return { matchPasswordError : true};
                } else {
                    return null;
                }
            }
        }
    }
    static numericValueValidation(control: AbstractControl): {[key: string]: any} | null {
        const numericValue = control.value;
        const numericvaluePattern = new RegExp('[0-9]$');
        // console.log(numericvaluePattern.test(numericValue));        
        if (numericValue === '' || numericvaluePattern.test(numericValue)) {
            return null;
        } else {
            return {'numericValueValidationError': true};
        }
    }
}