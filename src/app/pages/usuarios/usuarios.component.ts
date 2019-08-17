import { Component, OnInit } from '@angular/core';
import { Usuario } from 'src/app/models/usuario.model';
import { UsuarioService } from 'src/app/services/service.index';
import { ModalUploadService } from 'src/app/components/modal-upload/modal-upload.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styles: []
})
export class UsuariosComponent implements OnInit {
  
  usuarios: Usuario[] = [];
  desde: number = 0;
  totalRegistros: number = 0;

  loading: boolean = true;

  constructor( public _usuarioService: UsuarioService,
               public _modalUploadService: ModalUploadService ) { }

  ngOnInit() {
    this.cargarUsuarios();
    this._modalUploadService.notificacion
            .subscribe( resp => this.cargarUsuarios());
  }

  mostrarModal( id:string ) {
    this._modalUploadService.mostrarModal('usuarios', id );
  }

  cargarUsuarios() {
    
    this.loading = true;

    this._usuarioService.getUsuarios( this.desde )
              .subscribe( (resp: any) => {

                this.totalRegistros = resp.total;
                this.usuarios = resp.usuarios;
                
                this.loading = false;

              })
  }

  cambiarDesde( valor: number ) {

    let desde = this.desde + valor;

    if ( desde >= this.totalRegistros ) {
      return;
    }
    if ( desde < 0 ) {
      return;
    }

    this.desde += valor;
    this.cargarUsuarios();
  }

  
  buscarUsuario( termino: string ) {
    
    if (termino.length <= 0) {
      this.cargarUsuarios();
      return;
    }

    this.loading = true
    
    this._usuarioService.buscarUsuarios( termino )
                .subscribe( (usuarios: Usuario[]) => {
                  this.usuarios = usuarios;
                  this.loading = false;
                })
  }


  borrarUsuario( usuario: Usuario ) {
    
    if ( usuario._id === this._usuarioService.usuario._id) {
      Swal.fire('Operación no permitida', 'No se puede borrar a si mismo', 'error');
      return;
    }
    
    Swal.fire({
      title: '¿Está seguro?',
      text: "Borrará a " + usuario.nombre,
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí!'
    }).then((result) => {
      
      if (result.value) {
        
        this._usuarioService.borrarUsuario( usuario._id)
                  .subscribe( (eliminado:boolean) => {
                    console.log(eliminado);
                    this.cargarUsuarios();
                  }) 

        
      }
    })
  }

  guardarUsuario( usuario: Usuario ) {
    this._usuarioService.actualizarUsuario( usuario )
              .subscribe()
  }

}
