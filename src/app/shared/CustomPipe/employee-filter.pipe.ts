import { PipeTransform, Pipe } from '@angular/core';
import { IUserModel } from 'app/registration-form/registration.service';

@Pipe({
    name: 'userFilter',
    // pure: false
})
export class EmployeeFilterPipe implements PipeTransform {
    transform(users: IUserModel[], searchTerm: string): IUserModel[] {
        // console.log("searchTerm : ", searchTerm);        
        if (!users || !searchTerm) {
            return users;
        } else {
            return users.filter(employee => {
                // console.log(employee.name.toLowerCase().indexOf(searchTerm.toLowerCase()));                
                return employee.fullName.toLowerCase().indexOf(searchTerm.toLowerCase()) === 0 
            });
        }
    }
}