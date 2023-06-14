import { HttpClient } from '@angular/common/http';
import { Injectable, NgZone } from '@angular/core';
import { registerForm } from '../interfaces/register-form.interface';
import { environment } from 'src/environments/environment';
import { loginForm } from '../interfaces/login-form-interface';
import { catchError, map, tap } from 'rxjs/operators'
import { Observable, of } from 'rxjs';
import { Router } from '@angular/router';
import { Usuario } from '../models/usuario.model';

declare const google: any
const base_url = environment.base_url

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  public usuario!: Usuario;

  constructor(private http: HttpClient,
    private router: Router,
    private ngZone: NgZone) {
  }

  get token(): string {
    return localStorage.getItem('token') || ''
  }
  get uid(): string{
    return this.usuario.uid || '';
  }

  logout() {
    const email = localStorage.getItem('email') || '';
    google.accounts.id.revoke(email, () => {
      this.ngZone.run(() => {
        this.router.navigateByUrl('/login');
      })
      localStorage.removeItem('token');
      localStorage.removeItem('email');
    })

  }

  validarToken(): Observable<boolean> {
    // const token = localStorage.getItem('token') || '';

    return this.http.get(` ${base_url}/login/renew`, {
      headers: {
        'x-token': this.token
      }
    }).pipe(
      map((resp: any) => {
        const { email, google, nombre, role, img = '', uid } = resp.usuario;
        this.usuario = new Usuario(nombre, email, '', img, google, role, uid)

        // this.usuario.imprimirUsuario();
        localStorage.setItem('token', resp.token)
        return true;
      }),
      catchError(error => of(false))
    );
  }

  crearUsuario(formData: registerForm) {
    return this.http.post(`${base_url}/usuarios`, formData)
      .pipe(
        tap((resp: any) => {
          localStorage.setItem('token', resp.token)
        }

        )
      )

  }
  actualizarPerfil(data: { email: string, nombre: string, role: string|undefined}) {

    data = {
      ...data,
      role: this.usuario.role
    };
    return this.http.put(`${base_url}/usuarios/${this.uid}`, data, {
      headers: {
        'x-token': this.token
      }
    })
  }

  login(formData: loginForm) {
    return this.http.post(`${base_url}/login`, formData)
      .pipe(
        tap((resp: any) => {
          localStorage.setItem('token', resp.token)
        }

        )
      )

  }

  loginGoogle(token: string) {
    return this.http.post(`${base_url}/login/google`, { token })
      .pipe(
        tap((resp: any) => {
          console.log(resp)
          localStorage.setItem('token', resp.token)
          localStorage.setItem('email', resp.email)
        }

        )
      )

  }
}
