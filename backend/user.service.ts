import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://localhost:3000/api/users';

  constructor(private http: HttpClient) {}

  registerUser(user: { email: string, nickname: string, password: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, user);
  }
}
