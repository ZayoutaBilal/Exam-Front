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

  private headers: HttpHeaders | undefined;


  constructor(private http: HttpClient, private authService: AuthService) {
    this.authService.getToken().subscribe((token) => {
      token ? this.headers = new HttpHeaders({ Authorization: `Bearer ${token}` })
        : this.headers = new HttpHeaders();
    });
  }

  getAllDepartments(): Observable<HttpResponse<Departement[]>> {
    console.log(this.headers)
    return this.http.get<Departement[]>(`${environment.apiUrl}/admin/departements`,{headers : this.headers , observe : "response"});
  }
}
