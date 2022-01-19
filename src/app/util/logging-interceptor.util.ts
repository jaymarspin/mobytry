import { HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
// #docregion excerpt
import { finalize, tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements HttpInterceptor {
  constructor() {}

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    const started = Date.now();
    let msg: string;

    // extend server response observable with logging
    return next.handle(req).pipe(
      tap(
        // Succeeds when there is a response; ignore other events
        (event) => {
          msg = event instanceof HttpResponse ? 'succeeded' : '';
        },
        // Operation failed; error is an HttpErrorResponse
        (error) => {
          msg = 'failed';
        }
      ),
      // Log when response observable either completes or errors
      finalize(() => {
        const elapsed = Date.now() - started;
        const logMsg = `${req.method} "${req.urlWithParams}" ${msg} in ${elapsed} ms.`;
        console.log(logMsg);
      })
    );
  }
}
