import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {LoginComponent} from "./components/login/login.component";
import {AppComponent} from "./app.component";
import {EmployeesListComponent} from "./components/employees-list/employees-list.component";


const routes: Routes = [
  // { path: 'home', component: AppComponent },
  { path : "login",component: LoginComponent},
  { path : "employees",component: EmployeesListComponent},
  { path: '**', redirectTo: 'login', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    initialNavigation: 'enabledBlocking'
  })],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
