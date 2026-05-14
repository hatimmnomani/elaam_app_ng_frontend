import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class QuizService {

  constructor(private http: HttpClient) { }

  getQuizEligibility(): Observable<boolean> {
    const itsId = localStorage.getItem('itsId');
    if (!itsId) {
      return of(false);
    }

    const url = `${environment.quizApiUrl}/api/v1/public/user-quiz-access?itsId=${itsId}`;
    
    return this.http.get<any>(url).pipe(
      map(response => {
        // API response structure: { success, message, data: { allowed, isSuperAdmin }, timestamp }
        return response.data?.isSuperAdmin && JSON.parse(localStorage.getItem('role') || '') === 'Super Admin';
      }),
      catchError(error => {
        console.error('Error checking quiz eligibility:', error);
        return of(false);
      })
    );
  }
}
