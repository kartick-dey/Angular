import { Component, OnInit } from '@angular/core';
import { EmployeeService } from '../shared/employee.service';
import { IEmployee } from '../shared/IEmployee';
import { Router } from '@angular/router';

@Component({
  selector: 'app-list-employees',
  templateUrl: './list-employees.component.html',
  styleUrls: ['./list-employees.component.css']
})
export class ListEmployeesComponent implements OnInit {
  public employees: IEmployee[];

  constructor(private employeeService: EmployeeService,
              private router: Router) { }

  ngOnInit() {
    this.employeeService.getEmployees().subscribe(
      (listOfEmployee: IEmployee[]) => this.employees = listOfEmployee,
      (error) => console.log(error)      
    );
  }

  editButtonClick(employeeId: number) {
    this.router.navigate(['/edit', employeeId]);
  }

}
