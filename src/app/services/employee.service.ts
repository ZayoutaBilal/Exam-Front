import { Injectable } from '@angular/core';
import {Observable} from "rxjs";
import {Departement} from "../models/departement/departement.module";
import {AuthService} from "./auth.service";
import {HttpClient, HttpHeaders, HttpResponse} from "@angular/common/http";
import {environment} from "../environments/environment";
import {Employee} from "../models/employee/employee.module";

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  private headers: HttpHeaders | undefined;


  constructor(private http: HttpClient, private authService: AuthService) {
    this.authService.getToken().subscribe((token) => {
      token ? this.headers = new HttpHeaders({ Authorization: `Bearer ${token}` })
        : this.headers = new HttpHeaders();
    });
  }

  getAllEmployeesByDepartmentId(id : number): Observable<HttpResponse<Employee[]>> {
    return this.http.get<Employee[]>(`${environment.apiUrl}/admin/departement/${id}/employes`,{headers : this.headers , observe : "response"});
  }

  deleteEmployee(id : number): Observable<HttpResponse<string>> {
    return this.http.delete<string>(`${environment.apiUrl}/admin/employes/${id}`,{headers : this.headers , observe : "response",responseType : "text" as "json"});
  }

  deleteEmployeesOver60(): Observable<HttpResponse<string>> {
    return this.http.delete<string>(`${environment.apiUrl}/admin/employes/age/60`,{headers : this.headers , observe : "response",responseType : "text" as "json"});
  }

  updateEmployee(id :number, employeeData: any, picture: File | null): Observable<HttpResponse<string>> {
    const formData = new FormData();
    formData.append('createEmployee', JSON.stringify(employeeData));
    if (picture) {
      formData.append('picture', picture);
    }
    return this.http.put<string>(`${environment.apiUrl}/admin/employes/${id}`, formData, {headers : this.headers,observe: "response",responseType : "text" as "json"});
  }

  addEmployee(employeeData: any, picture: File | null): Observable<number> {
    const formData = new FormData();
    formData.append('createEmployee', JSON.stringify(employeeData));
    if (picture) {
      formData.append('picture', picture);
    }
    return this.http.post<number>(`${environment.apiUrl}/admin/employes`, formData, {headers : this.headers});
  }

}
