import { Component, OnInit, OnDestroy } from '@angular/core';
import { Employee } from './employee.model';
import { EmployeePipeService } from './employee-pipe.service';
import { Observable, Subscription, forkJoin } from 'rxjs';
import { IUserModel } from 'app/registration-form/registration.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-pipes-example',
  templateUrl: './pipes-example.component.html',
  styleUrls: ['./pipes-example.component.css']
})
export class PipesExampleComponent implements OnInit, OnDestroy {
  public employees: Employee[];
  public users: IUserModel[];
  public employeesAsync: Observable<Employee[]>;
  public employeeTrackBy: Employee[];
  public searchTerm: string;
  public employeeServiceSub: Subscription;
  public serverError: string;
  public loading = false;

  constructor(private employeeService: EmployeePipeService,
    private route: ActivatedRoute) {
    // This is going to fetch the data from route which is created by resolve gurad service.
    let resolveData = this.route.snapshot.data["usersList"];
    // console.log("resolveData : ", resolveData);
    this.employeeTrackBy = resolveData[0];
    // console.log("resolveData[0] : ", resolveData[0]);
    this.users = resolveData[1];
    // console.log("resolveData[1] : ", resolveData[1])        
    }

  ngOnInit(): void {
    this.getEmployeeAsync();
    // this.getEmpUsersFunction();
  }
  public getEmployeeAsync(): void {
    this.employeesAsync = this.employeeService.getEmp();
  }

  // This method is triggered when the "Refresh Employee" button i UI is clicked.
  // It will add an object on employeeTrackBy array.
  public addEmployees(): void {
    this.employeeTrackBy.push(
      { code: 'emp105', name: 'Nancy', gender: 'female', salary: 6700.826, dateOfBirth: '12/12/1981' }
    );
  }

  // This method will triggered to change the name property value of an object 
  // by clicking "Change Name" button in UI. 
  public changeName(): void {
    // this.employees[0].name = "Alex22";
    const newUsers = Object.assign([], this.users);
    newUsers[0].name = "Sayan Dey";
    this.users = newUsers
  }

  // This method is implement to describe or implement the tractBy func in *ngFor directive
  tractByEmpCode(index: number, employee: Employee): string {
    return employee.code;
  }

  ngOnDestroy() {
    // this.employeeServiceSub.unsubscribe()
  }

}
