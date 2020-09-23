import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpParams } from '@angular/common/http';
import { AuthenticationService } from './auth.service';
import { take, exhaustMap } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable()
export class AuthInterceptorService implements HttpInterceptor {
    constructor(private authService: AuthenticationService) {}
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<any> {
        return this.authService.user.pipe(
            take(1),
            exhaustMap(user => {
                if (!user) {
                    return next.handle(req);
                }
                const headers = req.headers.set("authToken", user.token)
                const modifiedReq = req.clone({headers});
                // const modifiedReq = req.clone({params: new HttpParams().set("auth", user.token)});
                return next.handle(modifiedReq)
            }));
    }

}

//Intercepter for app module.
// Router event subscribe.
// Timer in service call in every call - alert show if the user idle in 5 min.
// 