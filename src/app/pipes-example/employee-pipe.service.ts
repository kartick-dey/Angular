import { HttpClient } from '@angular/common/http';
import { Employee } from './employee.model';
import { Observable, throwError, forkJoin } from 'rxjs';
import { Injectable } from '@angular/core';
import { catchError } from 'rxjs/operators';
import { IUserModel } from 'app/registration-form/registration.service';

@Injectable()
export class EmployeePipeService {
    private getEmpUrl = "http://localhost:3000/employee";
    public getUserUrl = "http://localhost:3000/user";
    constructor(private http: HttpClient) { }

    // This method will help to fetch employees and users data from server uaing HTTP req.
    public getEmployeesAndUsers():Observable<[Employee[], IUserModel[]]>{
        return forkJoin([this.http.get<Employee[]>(this.getEmpUrl)
            .pipe(catchError(err => 
                {
                    alert("Server is not Responding")
                    return throwError("Server error")
                })), 
            this.http.get<IUserModel[]>(this.getUserUrl)
                .pipe(catchError(err => throwError("Server Error")))])
    }

    // This method is use to fetch data from server,
    // but its developped for showing the Async pipe functionality
    public getEmp(): Observable<Employee[]> {
        return this.http.get<Employee[]>(this.getEmpUrl)
        .pipe(catchError(err => 
            {
                alert("Server is not Responding")
                return throwError("Server error")
            }))
    }

    // public getUser(): Observable<IUserModel[]> {
    //     return this.http.get<IUserModel[]>(this.getUserUrl)
    //     .pipe(catchError(err => throwError("Server Error")));
    // }
}