import { Component, OnInit } from '@angular/core';
import { UsuarioService } from '../../services/service.index';
import { Usuario } from 'src/app/models/usuario.model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styles: []
})
export class ProfileComponent implements OnInit {

  usuario: Usuario;
  imagenSubir: File;
  imagenTemp: string;

  constructor( public _usuarioService: UsuarioService ) { 

    this.usuario = this._usuarioService.usuario;

  }

  ngOnInit() {
  }

  guardar( usuario: Usuario ) {
    
    this.usuario.nombre = usuario.nombre;
    if ( !this.usuario.google ) {
      this.usuario.email = usuario.email;
    }

    this._usuarioService.actualizarUsuario( this.usuario )
              .subscribe();

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


  actualizarImagen() {

    this._usuarioService.actualizarImagen( this.imagenSubir, this.usuario._id )
    
  }

}
