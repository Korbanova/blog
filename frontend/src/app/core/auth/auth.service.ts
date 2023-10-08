import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable, Subject, tap, throwError} from "rxjs";
import {DefaultResponseType} from "../../../types/default-response.type";
import {LoginResponseType} from "../../../types/login-response.type";
import {environment} from "../../../environments/environment";
import {UserInfoType} from "../../../types/user-info.type";
import {UserInfoResponseType} from "../../../types/user-info-response.type";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  public accessTokenKey = 'accessToken';
  public refreshTokenKey = 'refreshToken';
  private userInfoKey: string = 'userInfo';

  public isLogged$: Subject<boolean> = new Subject<boolean>();
  private isLogged = false;

  constructor(private http: HttpClient) {
    this.isLogged = !!localStorage.getItem(this.accessTokenKey)
  }

  login(email: string, password: string, rememberMe: boolean): Observable<DefaultResponseType | LoginResponseType> {
    return this.http.post<DefaultResponseType | LoginResponseType>(environment.api + 'login', {
      email,
      password,
      rememberMe
    })
  }

  signup(name: string, email: string, password: string): Observable<DefaultResponseType | LoginResponseType> {
    return this.http.post<DefaultResponseType | LoginResponseType>(environment.api + 'signup', {
      name,
      email,
      password
    })
  }

  refresh(): Observable<DefaultResponseType | LoginResponseType> {
    const tokens = this.getTokens();
    if (tokens && tokens.refreshToken) {
      return this.http.post<DefaultResponseType | LoginResponseType>(environment.api + 'refresh', {
        refreshToken: tokens.refreshToken
      })
    }

    throw throwError(() => 'Can not use token');
  }

  logout(): Observable<DefaultResponseType> {
    const tokens = this.getTokens();
    if (tokens && tokens.refreshToken) {
      return this.http.post<DefaultResponseType>(environment.api + 'logout', {
        refreshToken: tokens.refreshToken
      })
    }

    throw throwError(() => 'Can not find token')

  }

  getIsLoggedIn() {
    return this.isLogged;
  }

  public setTokens(accessToken: string, refreshToken: string): void {
    localStorage.setItem(this.accessTokenKey, accessToken);
    localStorage.setItem(this.refreshTokenKey, refreshToken);
    this.isLogged = true;
    this.isLogged$.next(true);
  }

  public removeTokens(): void {
    localStorage.removeItem(this.accessTokenKey);
    localStorage.removeItem(this.refreshTokenKey);
    this.isLogged = false;
    this.isLogged$.next(false);
  }

  public getTokens(): { accessToken: string | null, refreshToken: string | null } {
    return {
      accessToken: localStorage.getItem(this.accessTokenKey),
      refreshToken: localStorage.getItem(this.refreshTokenKey)
    }
  }

  public userInfo(): Observable<DefaultResponseType | UserInfoResponseType> {
    const tokens = this.getTokens();
    if (tokens && tokens.accessToken) {
      return this.http.get<DefaultResponseType | UserInfoResponseType>(environment.api + 'users');
    }

    throw throwError(() => 'Can not find token')

  }

  public setUserInfoInStorage(info: UserInfoType): void {
    localStorage.setItem(this.userInfoKey, JSON.stringify(info));
    this.isLogged = true;
    this.isLogged$.next(true);
  }

  public removeUserInfo(): void {
    localStorage.removeItem(this.userInfoKey);
  }

  public getUserInfo(): UserInfoType | null {
    const userinfo: string | null = localStorage.getItem(this.userInfoKey);
    if (userinfo) {
      return JSON.parse(userinfo);
    }
    return null;
  }


}
