import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders, HttpResponse} from "@angular/common/http";
import {AuthService} from "./auth.service";
import {Observable} from "rxjs";
import {Departement} from "../models/departement/departement.module";
import {environment} from "../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class DepartementService {

  private headers : HttpHeaders = new HttpHeaders();


  constructor(private http: HttpClient, private authService: AuthService) {
    // this.authService.getToken().subscribe((token) => {
    //   token ? this.headers = new HttpHeaders()
    //     : this.headers = new HttpHeaders();
    // });
  }

  getAllDepartments(): Observable<HttpResponse<Departement[]>> {
    return this.http.get<Departement[]>(`${environment.apiUrl}/admin/departements`,{withCredentials:true , observe : "response"});
  }
}
