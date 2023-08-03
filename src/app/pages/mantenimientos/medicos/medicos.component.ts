import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription, delay } from 'rxjs';
import { Medico } from 'src/app/models/medico.model';
import { BusquedasService } from 'src/app/services/busquedas.service';
import { MedicoService } from 'src/app/services/medico.service';
import { ModalImagenService } from 'src/app/services/modal-imagen.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-medicos',
  templateUrl: './medicos.component.html',
  styleUrls: ['./medicos.component.css']
})
export class MedicosComponent implements OnInit, OnDestroy {

public cargando: boolean = true;
public medicos: Medico[] = [] ;
private imgSubs!: Subscription;

  constructor( private medicoService: MedicoService,
               private modalImageService: ModalImagenService,
               private busquedaService:BusquedasService ){}
  ngOnDestroy(): void {
   this.imgSubs.unsubscribe();
  }

  ngOnInit(): void {
    this.cargarMedicos();

    this.imgSubs = this.modalImageService.nuevaImagen
    .pipe(delay(100))
    .subscribe( img => this.cargarMedicos())
  }

  cargarMedicos(){
    this.cargando = true;
    this.medicoService.cargarMedicos()
    .subscribe(medicos =>{
      this.cargando = false;
      this.medicos = medicos;
    })

  }
  abrirModal(medico: Medico){
    this.modalImageService.abrirModal('medicos', medico._id!, medico.img)
  }
  buscar(termino: string){
    if( termino.length === 0){
      return this.cargarMedicos()
    }

    this.busquedaService.buscar('medicos', termino)
    .subscribe( resultados => {
     this.medicos = resultados;
    })
  }

  borrarMedico(medico: Medico){

    Swal.fire({
      title: '¿Eliminar Medico?',
      text: "No podras revertir los cambios!",
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Si, eliminarlo!'
    }).then((result) => {
      if (result.value) {
        this.medicoService.borrarMedico(medico._id!)
        .subscribe(resp =>  {
          this.cargarMedicos();
          Swal.fire(
            'Medico Eliminado', `${medico.nombre} fue eliminado correctamente`,
            'success'
          )

        })

      }
    })
    return true
  }
}
