import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { delay } from 'rxjs';
import { Hospital } from 'src/app/models/hospital.model';
import { Medico } from 'src/app/models/medico.model';
import { HospitalService } from 'src/app/services/hospital.service';
import { MedicoService } from 'src/app/services/medico.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-medico',
  templateUrl: './medico.component.html',
})
export class MedicoComponent implements OnInit {

  public medicoForm!: FormGroup
  public hospitales: Hospital[] = [];
  public hospitalSeleccionado: Hospital | undefined;

  public medicoSeleccionado: Medico | undefined;

  constructor( private fb: FormBuilder,
               private hospitalService: HospitalService,
               private medicoService: MedicoService,
               private router: Router,
               private activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {

    this.activatedRoute.params.subscribe( ({id}) => {
      this.cargarMedico(id)
    })
    //this.medicoService.obtenerMedicoPorId();

    this.medicoForm = this.fb.group({
      nombre: ['', Validators.required],
      hospital: ['', Validators.required]
    })

    this.cargarHospitales();
    this.medicoForm.get('hospital')?.valueChanges
    .subscribe(hospitalId => {
     this.hospitalSeleccionado = this.hospitales.find(h => h._id === hospitalId )

    })
  }
  cargarMedico( id: string){
    if ( id === 'nuevo'){
      return;
    }
    if (id.match(/^[0-9a-fA-F]{24}$/)){
      this.medicoService.obtenerMedicoPorId( id )
      .pipe(
        delay(100)
      )
    .subscribe(medico => {
      const {nombre, hospital}  = medico
      const hos = medico.hospital?._id;
      this.medicoSeleccionado = medico;
    this.medicoForm.setValue({nombre, hospital: hospital?._id});
    })}
  }

  cargarHospitales(){
    this.hospitalService.cargarHospitales()
    .subscribe( (hospitales: Hospital[]) => {
      this.hospitales = hospitales

    })
  }
  guardarMedico(){
    const {nombre} = this.medicoForm.value;
    if (this.medicoSeleccionado) {

      /****************Actualizar */
      const data = {
        ...this.medicoForm.value,
        _id: this.medicoSeleccionado._id
      }
      this.medicoService.actualizarMedico( data)
      .subscribe( resp => {
        Swal.fire('Actualizado', `${ nombre} creado correctamente`, 'success')
      })
    }else{


    const {nombre} = this.medicoForm.value;
    this.medicoService.crearMedico(this.medicoForm.value)
    .subscribe( (resp: any) =>{
      Swal.fire('Creado', `${ nombre} creado correctamente`, 'success')
      this.router.navigateByUrl(`/dashboard/medico/${resp.medico._id}`)
    })

  }
  }
}
