import { Injectable } from '@angular/core';
import {UserService} from "./user.service";
import {Router} from "@angular/router";
import {BehaviorSubject, Observable} from "rxjs";
import {environment} from "../environments/environment";
import {HttpClient, HttpHeaders, HttpResponse} from "@angular/common/http";
import {UserLoggedInModule} from "../models/user-logged-in/user-logged-in.module";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private loggedIn = new BehaviorSubject<boolean>(false);
  private tokenBehaviorSubject = new BehaviorSubject<string>('');

  constructor(
    private router: Router,
    private http: HttpClient,
  ) {
    const token = localStorage.getItem(environment.tokenName);
    this.tokenBehaviorSubject.next(token ? JSON.parse(token) : '');
    // this.check();
  }

  check(): void {
    // const token = this.getToken().subscribe(token => {
    //   if (token) {
    //     this.checkToken(token).subscribe({
    //       next: (response) => {
    //         this.loggedIn.next(true);
    //         this.authorities.next(response.body?.roles ?? []);
    //       },
    //       error: () => {
    //         this.loggedIn.next(false);
    //         this.removeToken();
    //       }
    //     });
    //   } else
    //     this.loggedIn.next(false);
    // });
  }

  logIn(token: string,authorities: string[]) {
    //this.setToken(token);
    this.loggedIn.next(true);
    this.router.navigate(['/employees']).then();
  }

  logOut() {
    this.removeToken();
    this.loggedIn.next(false);
  }

  isLoggedIn() {
    return this.loggedIn.asObservable();
  }

  getToken(): Observable<string> {
    return this.tokenBehaviorSubject.asObservable();
  }

  setToken(value : any): void {
    localStorage.setItem(environment.tokenName, JSON.stringify(value));
    this.tokenBehaviorSubject.next(value);
  }

  removeToken(): void {
    localStorage.removeItem(environment.tokenName);
    this.tokenBehaviorSubject.next('');
  }

  checkToken(token : string):Observable<HttpResponse<UserLoggedInModule>> {
    return this.http.get<UserLoggedInModule>(`${environment.apiUrl}/user/check-token`,{ headers : new HttpHeaders({ Authorization: `Bearer ${token}` }) , observe: 'response' })
  }
}
