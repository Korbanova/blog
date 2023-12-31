import {Component, OnDestroy} from '@angular/core';
import {FormBuilder, Validators} from "@angular/forms";
import {DefaultResponseType} from "../../../../types/default-response.type";
import {AuthService} from "../../../core/auth/auth.service";
import {Router} from "@angular/router";
import {LoginResponseType} from "../../../../types/login-response.type";
import {HttpErrorResponse} from "@angular/common/http";
import {MatSnackBar} from "@angular/material/snack-bar";
import {UserInfoResponseType} from "../../../../types/user-info-response.type";
import {ReplaySubject, Subscription, switchMap, takeUntil} from "rxjs";

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnDestroy {
  signupForm = this.fb.group({
    userName: ['', [Validators.required, Validators.pattern(/^([А-ЯЁ][а-яё]+\s*([А-ЯЁ][а-яё]+\s?)*)$/)]],
    email: ['', [Validators.email, Validators.required]],
    password: ['', [Validators.required, Validators.pattern(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/)]],
    agree: [false, [Validators.requiredTrue]],
  })

  onDestroy = new ReplaySubject(1);

  constructor(private fb: FormBuilder,
              private authService: AuthService,
              private _snackBar: MatSnackBar,
              private router: Router) {
  }

  signup(): void {
    if (this.signupForm.valid && this.signupForm.value.email && this.signupForm.value.password
      && this.signupForm.value.userName && this.signupForm.value.agree)
      this.authService.signup(this.signupForm.value.userName, this.signupForm.value.email, this.signupForm.value.password)
        .pipe(
          switchMap((data: DefaultResponseType | LoginResponseType) => {
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
            return this.authService.userInfo()
          }),
          takeUntil(this.onDestroy)
        )
        .subscribe({
          next: ((data: UserInfoResponseType | DefaultResponseType) => {
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
            this._snackBar.open('Вы успешно зарегистрировались');
            this.router.navigate(['/']);
          }),
          error: (errorResponse: HttpErrorResponse) => {
            if (errorResponse.error && errorResponse.error.message) {
              this._snackBar.open(errorResponse.error.message);
            } else {
              this._snackBar.open('Ошибка при регистрации');
            }
          }
        })
  }

  ngOnDestroy() {
    this.onDestroy.next(1);
    this.onDestroy.complete();
  }
}
