import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError, shareReplay } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

/** GET /api/quiz/auth/me — the quiz participant allow-list entry for the logged-in ITS user. */
export interface QuizProfile {
  id: number;
  itsId: string;
  displayName: string | null;
  role: 'USER' | 'ADMIN';
  isActive: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class QuizService {

  /** Cached for the session: the allow-list does not change mid-visit. */
  private profile$?: Observable<QuizProfile | null>;

  constructor(private http: HttpClient) { }

  /**
   * null = no quiz access (403) or the call failed. Never throws.
   *
   * The quiz module lives on environment.serverUrl, so TokenInterceptor attaches the NTMS
   * bearer token automatically. `role` here is the *quiz* role from the quiz_participants
   * allow-list, not the NTMS role in localStorage — a Super Admin gets no quiz access from
   * that role alone.
   */
  getQuizProfile(): Observable<QuizProfile | null> {
    if (!this.profile$) {
      this.profile$ = this.http
        .get<QuizProfile>(`${environment.serverUrl}/api/quiz/auth/me`)
        .pipe(
          // 403 means "authenticated but not enrolled" — a normal answer, not an error.
          // 401 is left to TokenInterceptor, which owns session expiry.
          catchError(() => of(null)),
          shareReplay(1)
        );
    }
    return this.profile$;
  }

  isQuizAdmin(): Observable<boolean> {
    return this.getQuizProfile().pipe(map(p => p?.role === 'ADMIN'));
  }

  /** Called on logout so the next user in this tab does not inherit this one's access. */
  reset(): void {
    this.profile$ = undefined;
  }
}
