import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';
import { catchError } from 'rxjs/operators';
@Injectable()
export class JwtInterceptor implements HttpInterceptor {

    constructor(private cookieService: CookieService,private router: Router){}

    private handleError(err: HttpErrorResponse): Observable<any> {
        //handle your auth error or rethrow
        if (err.status === 401 || err.status === 403) {
            //navigate /delete cookies or whatever
            sessionStorage.clear();
            console.log('clear');
            this.router.navigateByUrl(`/Login`);
            // if you've caught / handled the error, you don't want to rethrow it unless you also want downstream consumers to have to handle it as well.
            return of(err.message); // or EMPTY may be appropriate here
        }
        return throwError(err);
    }
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        // add authorization header with jwt token if available
        const currentUser = sessionStorage.getItem('user_id');
        const token = sessionStorage.getItem('accessToken');
        console.log("access");
        if(!sessionStorage.getItem('store_id') && currentUser && token){
          this.router.navigateByUrl('/StoreSelect');
        }
        if (currentUser && token) {
            request = request.clone({
                setHeaders: {
                    Authorization: `Bearer ${token}`
                }
            });
            request = request.clone({
              params: (request.params ? request.params : new HttpParams())
                         .set('b_id', sessionStorage.getItem('store_id')) /*.... add new params here .....*/
            });
        }

        return next.handle(request).pipe(
            catchError((err: HttpErrorResponse) => {
              if (err.status === 401) {
                sessionStorage.clear();
                this.router.navigate(['Login'], { queryParams: { returnUrl: this.router.url } });
                return throwError(err.error.detail);
              } else if (err.status === 0) {
                return throwError('Unable to Connect to the Server');
              } else if (err.status === 400){
                return throwError("exist")
              } else {
                return throwError(err.error);
              }

            })
        )
    }
}
