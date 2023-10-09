import {Component, OnDestroy} from '@angular/core';
import {FormBuilder, Validators} from "@angular/forms";
import {DefaultResponseType} from "../../../../types/default-response.type";
import {AuthService} from "../../../core/auth/auth.service";
import {Router} from "@angular/router";
import {LoginResponseType} from "../../../../types/login-response.type";
import {HttpErrorResponse} from "@angular/common/http";
import {MatSnackBar} from "@angular/material/snack-bar";
import {UserInfoResponseType} from "../../../../types/user-info-response.type";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnDestroy {
  loginForm = this.fb.group({
    email: ['', [Validators.email, Validators.required]],
    password: ['', [Validators.required]],
    rememberMe: [false]
  });
  private subscriptionLogin: Subscription | null = null;
  private subscriptionInfo: Subscription | null = null;

  constructor(private fb: FormBuilder,
              private authService: AuthService,
              private _snackBar: MatSnackBar,
              private router: Router) {
  }

  login(): void {
    if (this.loginForm.valid && this.loginForm.value.email && this.loginForm.value.password) {
      this.subscriptionLogin = this.authService.login(this.loginForm.value.email, this.loginForm.value.password, !!this.loginForm.value.rememberMe)
        .subscribe({
          next: (data: LoginResponseType | DefaultResponseType) => {
            let error = null;
            if ((data as DefaultResponseType).error !== undefined) {
              error = (data as DefaultResponseType).message;
            }

            const loginResponse = data as LoginResponseType;
            if (!loginResponse.accessToken || !loginResponse.refreshToken || !loginResponse.userId) {
              error = 'Ошибка при авторизации';
            }
            if (error) {
              this._snackBar.open(error);
              throw new Error(error);
            }

            // set tokens
            this.authService.setTokens(loginResponse.accessToken, loginResponse.refreshToken);

            //Получить инф о пользователе.
            this.subscriptionInfo = this.authService.userInfo()
              .subscribe((data: UserInfoResponseType | DefaultResponseType) => {
                let error = null;
                if ((data as DefaultResponseType).error !== undefined) {
                  error = (data as DefaultResponseType).message;
                  this._snackBar.open(error);
                  throw new Error(error);
                }
                const userInfoResponse = data as UserInfoResponseType;

                this.authService.setUserInfoInStorage({
                  fullName: userInfoResponse.name,
                  userId: userInfoResponse.id,
                })
              })

            this._snackBar.open('Вы успешно авторизовались');
            this.router.navigate(['/']);
          },
          error: (errorResponse: HttpErrorResponse) => {
            if (errorResponse.error && errorResponse.error.message) {
              this._snackBar.open(errorResponse.error.message);
            } else {
              this._snackBar.open('Ошибка при авторизации');
            }
          }
        })
    }
  }

  ngOnDestroy() {
    this.subscriptionInfo?.unsubscribe();
    this.subscriptionLogin?.unsubscribe();
  }
}
