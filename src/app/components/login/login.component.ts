import { Component } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {UserService} from "../../services/user.service";
import {HttpResponse} from "@angular/common/http";
import {UserLoggedInModule} from "../../models/user-logged-in/user-logged-in.module";
import {AuthService} from "../../services/auth.service";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  protected loginForm : FormGroup ;
  protected message : string = "";

  constructor(private formBuilder : FormBuilder,
              private userService : UserService,
              private authService : AuthService) {
    this.loginForm = this.formBuilder.group({
      login: ['', Validators.required],
      password:['', Validators.required]
    });
  }

  logIn() {
    if(this.loginForm.invalid){
      this.message = "Both login and password are required";
      return
    }
    console.log(this.loginForm.value)

    this.userService.login(this.loginForm.value).subscribe({
      next: (response : HttpResponse<UserLoggedInModule>) => {
        if(response.body){
          this.authService.logIn(response.body.token,response.body.roles);

        }
      },
      error: (error) => {
        this.message = error.error;
        this.loginForm.reset();
      }
    });
  }

  forgetPassword() {

  }
}
