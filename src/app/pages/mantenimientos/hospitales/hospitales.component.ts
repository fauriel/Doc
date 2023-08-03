import { Component, OnInit } from '@angular/core';
import { Subscription, delay } from 'rxjs';
import { Hospital } from 'src/app/models/hospital.model';
import { BusquedasService } from 'src/app/services/busquedas.service';
import { HospitalService } from 'src/app/services/hospital.service';
import { ModalImagenService } from 'src/app/services/modal-imagen.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-hospitales',
  templateUrl: './hospitales.component.html',
  styleUrls: ['./hospitales.component.css']
})
export class HospitalesComponent implements OnInit{

  public hospitales: Hospital[] = [];
  public cargando: boolean = true;
  private imgSubs!: Subscription

  constructor(private hospitalService: HospitalService,
    private modalImageService: ModalImagenService,
    private busquedaService: BusquedasService ){

  }
  ngOnInit(): void {
    this.cargarHospitales();

    this.imgSubs = this.modalImageService.nuevaImagen
    .pipe(delay(100))
    .subscribe( img => this.cargarHospitales())
  }

  cargarHospitales() {

    this.cargando = true;
    this.hospitalService.cargarHospitales()
    .subscribe(hospitales =>{
      this.cargando = false;
      this.hospitales = hospitales;

    })
  }
  guardarCambios(hospital: Hospital){

    this.hospitalService.actualizarHospitales(hospital._id!, hospital._nombre!)
    .subscribe(resp => {
      Swal.fire('Actualizado', hospital._nombre, 'success')
    })
  }
  eliminarHospital(hospital: Hospital){

    this.hospitalService.borrarHospitales(hospital._id!)
    .subscribe(resp => {
      this.cargarHospitales()
      Swal.fire('Hospital Eliminado', hospital._nombre, 'success')
    })
  }

  async abrirSweetAlert(){
    const {value = ''} = await Swal.fire({
      title: 'Crear Hospital',
      text: 'Ingrese el nombre del Hospital',
      input: 'text',
      inputPlaceholder: 'Nombre del Hospital',
      showCancelButton: true
    })
    if(value.trim().length > 0){
      this.hospitalService.crearHospitales(value)
      .subscribe((resp: any) => {
        this.hospitales.push( resp.hospital)
      })
    }
  }

  abrirModal(hospital: Hospital){
    this.modalImageService.abrirModal('hospitales', hospital._id!, hospital.img)
  }

  buscar( termino: string ){
    if( termino.length === 0){
      return this.cargarHospitales()
    }

    this.busquedaService.buscar('hospitales', termino)
    .subscribe( resultados => {
      this.hospitales = resultados as Hospital[]
    })

  }

}
