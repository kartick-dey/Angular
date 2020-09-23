import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Employee } from './employee.model';
import { EmployeePipeService } from './employee-pipe.service';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { IUserModel } from 'app/registration-form/registration.service';

@Injectable()
export class UserResolverGuard implements Resolve<[Employee[], IUserModel[]]> {
    constructor(private employeeService: EmployeePipeService) {}
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): 
        Observable<[Employee[], IUserModel[]]>
     {
        return this.employeeService.getEmployeesAndUsers();
    }
}

// export class UserResolverGuard implements Resolve<(Observable<Employee[]> | Observable<IUserModel[]>)[]> {
//     constructor(private employeeService: EmployeePipeService) { }
//     resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot):
//         (Observable<Employee[]> | Observable<IUserModel[]>)[] {
//         return [this.employeeService.getEmployees(), this.employeeService.getUser()];
//     }
// }