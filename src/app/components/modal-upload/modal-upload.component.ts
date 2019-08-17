import { Component, OnInit } from '@angular/core';
import { SubirArchivoService } from 'src/app/services/service.index';
import { ModalUploadService } from './modal-upload.service';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-modal-upload',
  templateUrl: './modal-upload.component.html',
  styles: []
})
export class ModalUploadComponent implements OnInit {

  imagenSubir: File;
  imagenTemp: string;

  constructor( public _subirArchivoService: SubirArchivoService,
               public _modalUploadService: ModalUploadService ) { }

  ngOnInit() {
  }

  seleccionImagen( archivo: File ) {
    
    if ( !archivo ) {
      return;
      this.imagenSubir = null;
    }
    
    if ( archivo.type.indexOf('image') < 0 ) {
      Swal.fire('Sólo imagenes', 'El archivo seleccionado no es una imagen', 'error');
      this.imagenSubir = null;
      return;
    }
    
    this.imagenSubir = archivo;
  
    let reader = new FileReader();
    let urlImagenTemp = reader.readAsDataURL( archivo );

    reader.onloadend = () => this.imagenTemp = String(reader.result);

  }

  subirImagen() {
    
    this._subirArchivoService.subirArchivo( this.imagenSubir, this._modalUploadService.tipo, this._modalUploadService.id )
            .then( resp => {

              this._modalUploadService.notificacion.emit( resp );
              this.cerrarModal();

            })
            .catch( err => {
              console.log('Error en la carga...');
            })

  }


  cerrarModal() {
    this.imagenTemp = null;
    this.imagenSubir = null;
    this._modalUploadService.ocultarModal();
  }


  

}
