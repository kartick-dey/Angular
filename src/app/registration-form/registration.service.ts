import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';

export interface IUserModel {
    fullName: string;
    password: string;
    otpPreferenece: string;
    address: {
        street: string;
        city: string;
        state: string;
        country: string;
        postalCode: string
    }
}

@Injectable()
export class RegistrationService {
    private userUrl = "http://localhost:3000/userr";
    constructor(private http: HttpClient) {}

    public addUser(userData: IUserModel): Observable<IUserModel> {
        return this.http.post<IUserModel>(this.userUrl, userData, {
            headers: new HttpHeaders({
                'Content-Type': 'application/json'
            })
        })
        .pipe(catchError(this.handleError))

    }

    private handleError(errorResponse: HttpErrorResponse): Observable<any> {
        if (errorResponse instanceof ErrorEvent) {
            console.log("Client Side Error : ", errorResponse.error);
        } else {
            console.log("Server Side Error : ", errorResponse);
        }

        return throwError("There is an error to store data.")
    }
}