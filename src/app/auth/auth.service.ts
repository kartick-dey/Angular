import { Injectable } from '@angular/core';
import { HttpClient, 
         HttpErrorResponse } from '@angular/common/http';
import { Observable, 
         throwError, 
         BehaviorSubject,
         timer} from 'rxjs';
import { catchError, tap, debounceTime, retry, retryWhen, delayWhen, scan } from 'rxjs/operators';
import { User } from './user.model';
import { Router } from '@angular/router';
import { AuthService, 
         FacebookLoginProvider, 
         GoogleLoginProvider } from 'angularx-social-login';

export interface AuthResponseData {
    idToken: string;
    email: string;
    refreshToken: string;
    expiresIn: string;
    localId: string;
    registered?: string
};

// Package for Social login - npm install angularx-social-login --save
// For Google client id ("392303435767-rl0ihdq91nulieq4udtcvjtj4b62r8hb.apps.googleusercontent.com") - console.developers.google.com
// For Facebook client id ("195444011581327") - developers.facebook.com
// For Linked In client id ("86weczqa95vm3e") - developers.linkedin.com

@Injectable()
export class AuthenticationService {
    private tokenExpirationTimer: any;
    loggedInStatus = new BehaviorSubject<boolean>(false);
    user = new BehaviorSubject<User>(null);
    authMessage = new BehaviorSubject<string>(null);
    public gSignUpAPIEndpoint = "https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyBxENhbcvBZQXfrr6aj-W8-DXoJPSMpi6k";
    public gLoginAPIEndpoint = "https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyBxENhbcvBZQXfrr6aj-W8-DXoJPSMpi6k";

    // "Subject" is used to multicast the Obseravble means 
    // when a new value emites all the subscriber will get the same value.
    // Whereas "BehaviorSubject" has same features but it have some extra feacture like it can 
    // hold the previous value after emiting a new value.

    constructor(private http: HttpClient,
                private router: Router,
                private socialAuthService: AuthService) {}

    public singnUp(email: string, password: string): Observable<AuthResponseData> {
        return this.http.post<AuthResponseData>
            (this.gSignUpAPIEndpoint,
            {
                email: email,
                password: password,
                returnSecureToken: true          
            })
            .pipe(
                tap(resData => this.handleAuthentication(resData)),
                catchError(errorRes => this.handleError(errorRes))
                )
    }

    public logIn(email: string, password: string): Observable<AuthResponseData> {
        return this.http.post<AuthResponseData>
            (this.gLoginAPIEndpoint,
            {
                email: email,
                password: password,
                returnSecureToken: true

            })
            .pipe(
                // retryWhen((error) => {
                // console.log("error", error); 
                // return error.pipe(scan(retryCount => {                   
                //     if (retryCount > 3) {
                //         throw error;
                //     } else {
                //         retryCount++;                        
                //         return retryCount;
                //     }
                // }, 0),
                //     delayWhen(() => timer(1000)))
                // }),
                tap(resData => this.handleAuthentication(resData)),
                catchError(errorRes => this.handleError(errorRes))
                )
    }

    public facebookLogin(): void {
        this.socialAuthService.signIn(FacebookLoginProvider.PROVIDER_ID)
            .then(resData => {
                this.handleSocialAuthentication(resData);
                this.router.navigate(["/registration"]);
                })
            .catch(errorRes => console.log(errorRes))
    }
    public googleLogin(): void {
        this.socialAuthService.signIn(GoogleLoginProvider.PROVIDER_ID)
            .then(resData => {
                this.handleSocialAuthentication(resData);
                this.router.navigate(["/registration"]); 
            })
            .catch(error => console.log(error))
    }

    // public checkIdentity(id: any, id_token: any) {
    //     let uriFB = "https://graph.facebook.com/debug_token?input_token=" + id_token + "&access_token=" + this.client_id;
    //     let uriG = "https://oauth2.googleapis.com/tokeninfo?id_token="+id_token;
    //     // let uriFB = "https://graph.facebook.com/v7.0/oauth/access_token?client_id=" + this.client_id + "&redirect_uri=" + this.redirect_uri + "&client_secret=" + this.client_secret + "&code=" + id;
    //     this.http.get(uriFB)
    //     .subscribe(res => console.log("res : ",res),
    //                err => console.log("err : ", err)      
    //     );
    // }

    public loggedInObs(): Observable<boolean> {
        this.loggedInStatus.next(!!sessionStorage.getItem("userData"));
        return this.loggedInStatus;
    }

    public loggedIn(): boolean {
        this.loggedInStatus.next(!!sessionStorage.getItem("userData"));
        return this.loggedInStatus.value;
    }

    // This is the sighnout method for social login system
    public signOut(): void {
        this.socialAuthService.signOut()
    }

    // This is the main logout method
    public logout(): void {
        if (this.user.value.provider === "FACEBOOK" || this.user.value.provider === "GOOGLE") {
            this.socialAuthService.signOut();
        }
        this.user.next(null);
        sessionStorage.removeItem("userData");
        if (this.tokenExpirationTimer) {
            clearTimeout(this.tokenExpirationTimer)
        }
        this.tokenExpirationTimer = null;
        this.loggedInStatus.next(false);
        this.router.navigate(["/auth"]);
    }

    public autoLogin(): void {      
        const userData: {
            email: string;
            id; string;
            _token: string;
            _expirationDuration;
            _tokenExpirationDate: string
        } = JSON.parse(sessionStorage.getItem("userData"));

        if (!userData) {
            return
        }

        const loadedUser = new User(
            userData.email, 
            userData.id, 
            userData._token, 
            userData._expirationDuration,
            new Date(userData._tokenExpirationDate)
        );

        if (loadedUser.token) {
            this.user.next(loadedUser);
            this.loggedInStatus.next(true);
            const expirationDuration = 
                    new Date(userData._tokenExpirationDate).getTime() - new Date().getTime();
            this.autoLogout(expirationDuration);
        }
      

    }

    public autoLogout(expirationDuration: number): void {
        this.tokenExpirationTimer = setTimeout(()=> {
            this.logout();
            alert("")
        }, expirationDuration);
    }

    // This method will help to store google Auth REST API login user info into class property
    // as well as session storage
    private handleAuthentication(resData: AuthResponseData): void {
        const expirationDate = new Date(new Date().getTime() + +resData.expiresIn * 1000);
        // console.log("expirationDate : ", expirationDate);        
        const user = new User(
                    resData.email, 
                    resData.localId, 
                    resData.idToken, 
                    +resData.expiresIn,
                    expirationDate,
                    'NA',
                    'NA');
        this.user.next(user);
        sessionStorage.setItem("userData", JSON.stringify(user));
        this.loggedInStatus.next(true);
        this.authMessage.next("Successfully Logged In!");
    }

    // This method will help to store social login user info into class property
    // as well as session storage
    public handleSocialAuthentication(resData): void {
        // console.log("resData : ", resData);        
        const expirationDate = new Date(new Date().getTime() + 3600 * 1000);
        const user = new User(
                    resData.email,
                    resData.id,
                    resData.authToken,
                    10,
                    expirationDate,
                    resData.provider ? resData.provider : 'NA',
                    resData.photoUrl ? resData.provider : 'NA');
        this.user.next(user);
        sessionStorage.setItem("userData", JSON.stringify(user));
        this.loggedInStatus.next(true);
        this.authMessage.next("Successfully Logged In!");
    }

    public handleError( errRes: HttpErrorResponse): Observable<any> {
        let errorMessage = "An unknown error occurred!";
        if (!errRes.error || !errRes.error.error) {
            return throwError(errorMessage);
        }
        switch (errRes.error.error.message) {
            case 'EMAIL_EXISTS':
                errorMessage = "This email is already exist!";
                break;
            case 'EMAIL_NOT_FOUND': 
                errorMessage = "Email not exist!";
                break;
            case 'INVALID_PASSWORD':
                errorMessage = "Password is invalid!"
            // default:
            //     errorMessage = errRes.error.error.message;
        }

        return throwError(errorMessage);
    }
}