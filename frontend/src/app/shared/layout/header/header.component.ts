import {Component, OnInit} from '@angular/core';
import {UserInfoType} from "../../../../types/user-info.type";
import {AuthService} from "../../../core/auth/auth.service";
import {Router} from "@angular/router";
import {MatSnackBar} from "@angular/material/snack-bar";
import {DefaultResponseType} from "../../../../types/default-response.type";
import {HttpErrorResponse} from "@angular/common/http";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  userInfo: UserInfoType | null = null;

  constructor(private authService: AuthService,
              private _snackBar: MatSnackBar,
              private router: Router) {
    if (this.authService.getIsLoggedIn()) {
      this.userInfo = this.authService.getUserInfo();
    }
  }

  ngOnInit() {
    this.authService.isLogged$
      .subscribe((isLoggedIn: boolean) => {
        this.userInfo = isLoggedIn ? this.authService.getUserInfo() : null;
      })
  }

  logout(): void {
    this.authService.logout().subscribe({
      next: (data: DefaultResponseType) => {
        this.doLogout();
      },
      error: (errorResponse: HttpErrorResponse) => {
        this.doLogout();
      }
    })
  }

  doLogout(): void {
    this.authService.removeTokens();
    this.authService.removeUserInfo();
    this._snackBar.open('Вы вышли из сиситемы');
    this.router.navigate(['/']);
  }
}
