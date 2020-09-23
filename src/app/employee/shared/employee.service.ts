import { Injectable } from '@angular/core';
import { IEmployee } from './IEmployee';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export class EmployeeService {
    private listEmployee: IEmployee[];

    constructor(private http: HttpClient) {

    }

    baseURL = "http://localhost:3000/employee";

    getEmployees(): Observable<IEmployee[]> {
        return this.http.get<IEmployee[]>(this.baseURL)
        .pipe(catchError(this.handleError));
    }

    getEmployee(id: number): Observable<IEmployee> {
        return this.http.get<IEmployee>(`${this.baseURL}/${id}`)
        .pipe(catchError(this.handleError));
    }

    addEmployee(employee: IEmployee): Observable<IEmployee> {
        return this.http.post<IEmployee>(this.baseURL, employee, {
            headers: new HttpHeaders ({
                'Content-Type': 'application/json'
            })
        }).pipe(catchError(this.handleError))
    }

    updateEmployee(employee: IEmployee): Observable<IEmployee> {
        return this.http.put<IEmployee>(`${this.baseURL}/${employee.id}`, employee, {
            headers: new HttpHeaders({
                'Content-Type': 'application/json'
            })
        })
        .pipe(catchError(this.handleError))
    }

    private handleError(errorResponse: HttpErrorResponse) {
        if (errorResponse instanceof ErrorEvent) {
            console.log("Client Side Error : ", errorResponse.error);            
        } else {
            console.log("Server Side Error : ", errorResponse);            
        }

        return throwError("There is an error in service.")
    }
}