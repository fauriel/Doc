import { HttpClient } from '@angular/common/http';
import { Injectable, NgZone } from '@angular/core';
import { registerForm } from '../interfaces/register-form.interface';
import { environment } from 'src/environments/environment';
import { loginForm } from '../interfaces/login-form-interface';
import { catchError, delay, map, tap } from 'rxjs/operators'
import { Observable, of } from 'rxjs';
import { Router } from '@angular/router';
import { Usuario } from '../models/usuario.model';
import { CargarUsuario } from '../interfaces/cargar-usuarios.interface';

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
  get role(): 'ADMIN_ROLE' | 'USER_ROLE'{
    return this.usuario.role!
  }
  get uid(): string{
    return this.usuario.uid || '';
  }
  get headers() {
    return {
      headers: {
        'x-token': this.token
      }
    }
  }

  guardarLocalStorage( menu: any){
    localStorage.setItem('menu', JSON.stringify(menu))
  }


  logout() {
    const email = localStorage.getItem('email') || '';
    google.accounts.id.revoke(email, () => {
      this.ngZone.run(() => {
        this.router.navigateByUrl('/login');
      })
      localStorage.removeItem('token');
      localStorage.removeItem('email');
      localStorage.removeItem('menu');
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
        this.guardarLocalStorage(resp.menu);
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
          this.guardarLocalStorage(resp.menu);
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
          this.guardarLocalStorage(resp.menu);
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
          this.guardarLocalStorage(resp.menu);
        }

        )
      )

  }

  cargarUsuarios(desde: number = 0){

    const url = `${base_url}/usuarios?desde=${ desde }`;
    return this.http.get<CargarUsuario>(url, this.headers)
    .pipe(
      map(resp =>{
        const usuarios = resp.usuarios.map(
           user => new Usuario(user.nombre, user.email, '', user.img, user.google, user.role, user.uid)
            )
            return {
              total: resp.total,
              usuarios
            }
      }),
    )

  }

  eliminarUsuario(usuario: Usuario){
    const url = `${base_url}/usuarios/${ usuario.uid}`;
    return this.http.delete(url, this.headers)

  }
  guardarUsuario(usuario: Usuario) {


     return this.http.put(`${base_url}/usuarios/${usuario.uid}`,usuario, this.headers)
   }
}
