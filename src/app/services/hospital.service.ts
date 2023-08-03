import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Hospital, HospitalInterface } from '../models/hospital.model';

const base_url = environment.base_url

@Injectable({
  providedIn: 'root'
})
export class HospitalService {


  constructor(private http: HttpClient) { }

  get token(): string {
    return localStorage.getItem('token') || ''
  }

  get headers() {
    return {
      headers: {
        'x-token': this.token
      }
    }
  }

  cargarHospitales(){

    const url = `${base_url}/hospitales`;
   return this.http.get<HospitalInterface>(url, this.headers)
    .pipe(
      map( (resp: HospitalInterface) => resp.hospitales)
    )

  }
  crearHospitales(nombre: string){

    const url = `${base_url}/hospitales`;
    return this.http.post(url, {nombre}, this.headers)


  }
 actualizarHospitales(_id: string, nombre: string){

    const url = `${base_url}/hospitales/${_id}`;
    return this.http.post(url, {nombre}, this.headers)

  }
  borrarHospitales(_id: string){

    const url = `${base_url}/hospitales`;
    return this.http.delete(url,  this.headers)


  }
}
