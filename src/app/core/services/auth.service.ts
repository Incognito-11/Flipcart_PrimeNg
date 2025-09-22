import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { User } from 'src/app/shared/models/user.model';
import { environment } from 'src/environments/environment';
import { API_ENDPOINTS } from '../constants/api-endpoints';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient, private router: Router) {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      this.currentUserSubject.next(JSON.parse(storedUser));
    }
  }

  /** Get current user value */
  get currentUser(): User | null {
    return this.currentUserSubject.value;
  }

  /** Check if user is logged in */
  get isAuthenticated(): boolean {
    return !!this.currentUser;
  }

  /**
   * Perform login using username and password
   * @param username - user input
   * @param password - user input
   */
  login(username: string, password: string): Observable<User> {
    const url = `${environment.apiUrl}${API_ENDPOINTS.USERS.BASE}?username=${username}&password=${password}`;

    return this.http.get<User[]>(url).pipe(
      map(users => {
        if (!users.length) throw new Error('Invalid credentials');
        const user = users[0];

        if (!user.username || !user.role) throw new Error('Incomplete user data');

        localStorage.setItem('currentUser', JSON.stringify(user));
        this.currentUserSubject.next(user);
        return user;
      }),
      catchError(error => throwError(() => new Error(error.message || 'Login failed')))
    );
  }

  /** Logout user and redirect to login */
  logout(): void {
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
    this.router.navigate(['/auth/login']);
  }

  /**
   * Check if the current user has any of the given roles
   * @param roles - list of allowed roles
   */
  hasRole(...roles: string[]): boolean {
    return !!this.currentUser && roles.includes(this.currentUser.role);
  }

  /**
   * Update current user details in localStorage and memory
   * @param updatedUser - partial user data to update
   */
  updateCurrentUser(updatedUser: Partial<User>): void {
    const currentUser = this.currentUser;

    if (!currentUser) {
      throw new Error('No current user found to update.');
    }

    const newUser = { ...currentUser, ...updatedUser };
    localStorage.setItem('currentUser', JSON.stringify(newUser));
    this.currentUserSubject.next(newUser);
  }
}
