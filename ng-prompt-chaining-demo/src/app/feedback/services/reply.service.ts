import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, Observable, of, retry } from 'rxjs';
import { BACKEND_URL } from '~app/app.constant';

@Injectable()
export class ReplyService {
  private readonly httpClient = inject(HttpClient);
  private readonly backendUrl = inject(BACKEND_URL); 

  getReply(prompt: string): Observable<string> {
    return this.httpClient.post(`${this.backendUrl}/esg-advisory-feedback`, { prompt }, {
      responseType: 'text'
    }).pipe(
      retry({ count: 3, delay: 500 }),
      catchError((err) => {
        console.error(err);
        return (err instanceof Error) ? of(err.message)
          : of('Error occurs when generating reply');
      })
    );
  }
}
