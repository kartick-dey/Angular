import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';


export interface authResponse {
  message: string;
}

@Injectable({ providedIn: 'root' })
export class LoginServiceService {

  private loginURL = "http://127.0.0.1:5000/login";

  constructor(private _http: HttpClient) { }

  // This is api call for login service and its retuen a Observable.
  public login(username: string, password: string): Observable<authResponse> {
    const userData = {
      username: username,
      password: password
    };
    return this._http.post<authResponse>(this.loginURL, userData)
  }
}
