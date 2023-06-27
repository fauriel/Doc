import { Component, OnInit } from '@angular/core';
import { FileUploadService } from 'src/app/services/file-upload.service';
import { ModalImagenService } from 'src/app/services/modal-imagen.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-modal-imagen',
  templateUrl: './modal-imagen.component.html',
  styleUrls: ['./modal-imagen.component.css']
})
export class ModalImagenComponent implements OnInit {
  //public usuario!: Usuario;
  public imagenSubir!: File;
  public imgTemp: any;

  constructor( public modalImagenService: ModalImagenService,
               public fileUploadService: FileUploadService
    ){}

  ngOnInit(): void {

  }

  cerrarModal(){
    this.imgTemp = null
    this.modalImagenService.cerrarModal()
  }

  cambiarImagen( file: File){
    this.imagenSubir = file;

    if(!file){
      return;
    }
    const reader = new FileReader();
    const url64 = reader.readAsDataURL( file);

    reader.onloadend = () => {
      this.imgTemp = reader.result;
      // console.log('base 64 ',reader.result as string );
    }
  }

  subirImagen(){

    const id = this.modalImagenService.id;
    const tipo = this.modalImagenService.tipo;

    this.fileUploadService
    .actualizarFoto( this.imagenSubir, tipo, id)
    .then( (img: any) => {

      Swal.fire('Guardado', 'Imagen guardada correctamente', 'success');
      this.modalImagenService.nuevaImagen.emit(img);
      this.cerrarModal()
    } )
  }

}
