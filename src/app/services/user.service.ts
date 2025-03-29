import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams, HttpResponse} from "@angular/common/http";
import {environment} from "../environments/environment";
import {Observable} from "rxjs";
import {UserLoggedInModule} from "../models/user-logged-in/user-logged-in.module";


@Injectable({
  providedIn: 'root'
})
export class UserService {

  private apiURL = environment.apiUrl;
  private headers: HttpHeaders = new HttpHeaders();

  constructor(private http: HttpClient) {
  }

  login(body : any): Observable<HttpResponse<UserLoggedInModule>> {
    return this.http.post<UserLoggedInModule>(`${this.apiURL}/auth/login`, body, {
      headers: this.headers,
      observe: 'response'
    });
  }


}
