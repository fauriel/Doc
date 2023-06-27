import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription, delay } from 'rxjs';
import { Usuario } from 'src/app/models/usuario.model';
import { BusquedasService } from 'src/app/services/busquedas.service';
import { ModalImagenService } from 'src/app/services/modal-imagen.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.css']
})
export class UsuariosComponent implements OnInit, OnDestroy{

  public totalUsuarios: number = 0;
  public usuarios: Usuario[] = []
  public usuariosTem: Usuario[] = []
  public desde: number = 0;
  public cargando: boolean = true;

  public imgSubs!: Subscription;

  constructor(private usuarioService: UsuarioService,
    private busquedasService: BusquedasService,
    private modalImageService: ModalImagenService){
  }
  ngOnDestroy(): void {
      this.imgSubs.unsubscribe();
  }

  ngOnInit(): void {
    this.cargarUsuarios();
    
   this.imgSubs = this.modalImageService.nuevaImagen
   .pipe(
    delay(100)
   )
   .subscribe(img => {
    this.cargarUsuarios()
   })


  }

  cargarUsuarios(){
    this.cargando = true
    this.usuarioService.cargarUsuarios( this.desde)
    .subscribe(({total, usuarios}) => {
      this.totalUsuarios = total;
      this.usuarios = usuarios;
      this.usuariosTem = usuarios
      this.cargando = false
    })

  }

  cambiarPagina( valor: number){
    this.desde += valor

    if(this.desde < 0 ){
      this.desde = 0;
    } else if (this.desde >= this.totalUsuarios){
      this.desde -= valor
    }

    this.cargarUsuarios();

  }

  buscar( termino: string ){
    if( termino.length === 0){
      return this.usuarios = this.usuariosTem
    }

    this.busquedasService.buscar('usuarios', termino)
    .subscribe( resultados => {
      this.usuarios = resultados
    })
    return true;
  }

  eliminarUsuario(usuario: Usuario){
    if( usuario.uid === this.usuarioService.uid){
       return Swal.fire('Error', 'No puede eliminarse a si mismo', 'error')
    }

    Swal.fire({
      title: '¿Eliminar Usuario?',
      text: "No podras revertir los cambios!",
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Si, eliminarlo!'
    }).then((result) => {
      if (result.value) {
        this.usuarioService.eliminarUsuario( usuario)
        .subscribe(resp =>  {
          this.cargarUsuarios();
          Swal.fire(
            'Usuario Eliminado', `${usuario.nombre} fue eliminado correctamente`,
            'success'
          )

        })

      }
    })
    return true
  }
  cambiarRole(usuario: Usuario){
    this.usuarioService.guardarUsuario(usuario)
    .subscribe( resp => {
      console.log("Cambio de rol exitoso")
    })

  }
  abrirModal(usuario: Usuario){
    this.modalImageService.abrirModal('usuarios', usuario.uid!, usuario.img)
  }
}
