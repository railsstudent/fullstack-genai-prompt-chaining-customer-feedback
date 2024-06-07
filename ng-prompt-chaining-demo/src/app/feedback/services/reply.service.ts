import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, delay, Observable, of, retry } from 'rxjs';
import { BACKEND_URL } from '~app/app.constant';


@Injectable()
export class ReplyService {
  private readonly httpClient = inject(HttpClient);
  private readonly backendUrl = inject(BACKEND_URL); 

  getReply(prompt: string): Observable<string> {
    return this.httpClient.post(`${this.backendUrl}/esg-advisory-feedback`, { prompt }, {
      responseType: 'text'
    }).pipe(
      retry(3),
      delay(500),
      catchError((err) => {
        console.error(err);
        if (err instanceof Error) {
          return of(err.message);
        }
        return of('Error occurs when generating reply');
      })
    );
  }
}
