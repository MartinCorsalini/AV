import { Injectable } from '@angular/core';
import { Auth, user } from '@angular/fire/auth';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {

  user$: Observable<any>;

  constructor(private auth: Auth) {
    this.user$ = user(this.auth);
  }

  getCurrentUser() {
    return this.auth.currentUser;
  }

  getUserId(): string {
    return this.auth.currentUser?.uid ?? '';
  }

  getEmail(): string {
    return this.auth.currentUser?.email ?? '';
  }

  getNombre(): string {
    const email = this.getEmail();
    return email.split('@')[0].toUpperCase();
  }
}
