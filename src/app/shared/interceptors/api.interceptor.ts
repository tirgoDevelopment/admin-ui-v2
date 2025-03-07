import { HttpErrorResponse, HttpEvent, HttpHandlerFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, Observable, throwError, timeout } from 'rxjs';
import { AuthService } from 'src/app/pages/auth/services/auth.service';

export const authInterceptor = (
    req: HttpRequest<unknown>, 
    next: HttpHandlerFn
): Observable<HttpEvent<unknown>> => {
    const authService = inject(AuthService);

    let newReq = req.clone();
    
    if (authService.accessToken) {
        newReq = req.clone({
            headers: req.headers.set('Authorization', 'Bearer ' + authService.accessToken),
        });
    }
    return next(newReq).pipe(
        timeout(50000),
        catchError((error) => {
            if (error instanceof HttpErrorResponse && error.status === 401) {
                authService.logout();
                location.reload();
            }
            return throwError(error);
        }),
    );
 };
