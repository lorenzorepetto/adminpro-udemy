import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { map, catchError } from 'rxjs/operators';
import { throwError } from 'rxjs/internal/observable/throwError';

import Swal from 'sweetalert2';

import { URL_SERVICIOS } from '../../config/config';

//modelos
import { Usuario } from 'src/app/models/usuario.model';
import { SubirArchivoService } from '../subirArchivo/subir-archivo.service';
import { Observable, pipe } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  usuario: Usuario;
  token: string;
  menu: any = [];

  constructor( public http: HttpClient,
               public router: Router,
               public _subirArchivoService: SubirArchivoService ) {

    this.cargarStorage();
  }


  renuevaToken(){
    
    let url = `${ URL_SERVICIOS }/login/renuevatoken?token=${ this.token }`;

    return this.http.get( url )
                  .pipe(
                    map( (resp: any) => {
                      
                      this.token = resp.token;
                      localStorage.setItem('token', this.token);
                      return true;
                    }),
                    catchError( err => {
                      this.router.navigate(['/login']);
                      Swal.fire('No se pudo renovar token', 'No fue posible la operación', 'error');
                      return throwError(err);
                    })
                  )
  }
// =================================================================
//                          Logout
// =================================================================

logout() {
  this.usuario = null;
  this.token = '';
  this.menu = [];

  localStorage.removeItem('token');
  localStorage.removeItem('usuario');
  localStorage.removeItem('menu');

  this.router.navigate(['/login']);
}



// =================================================================
//                        Login Google
// =================================================================

loginGoogle( token: string ) {

    let url = URL_SERVICIOS + '/login/google';
    return this.http.post( url, { token })
                .pipe(
                  map( (resp:any) => {
                    this.guardarStorage( resp.id, resp.token, resp.usuario, resp.menu);
                    return true;
                  })
                )

}


// =================================================================
//                          Login
// =================================================================


  login( usuario: Usuario, recordar:boolean = false ) {

      if ( recordar ) {
        localStorage.setItem('email', usuario.email);
      } else {
        localStorage.removeItem('email');
      }

      let url = URL_SERVICIOS + '/login';
      return this.http.post( url, usuario )
                    .pipe(
                      map( (resp:any) => {
                        this.guardarStorage( resp.id, resp.token, resp.usuario, resp.menu);
                        return true;
                      }),
                      catchError( err => {
                        console.log(err.error.mensaje);
                        Swal.fire('Error en el login', err.error.mensaje, 'error');
                        return throwError(err);
                      })
                      
                    );
  }


// =================================================================
//                           Read							 
// =================================================================

  getUsuarios( desde: number = 0 ) {
    
    let url = `${ URL_SERVICIOS }/usuario?desde=${ desde }`;

    return this.http.get( url );
  }


  buscarUsuarios( termino: string ) {
    
    let url = `${ URL_SERVICIOS }/busqueda/coleccion/usuarios/${ termino }`;
    
    return this.http.get( url )
                .pipe(
                  map( (resp: any) => resp.usuarios )
                )
  }

// =================================================================
//                           Update							 
// =================================================================

  actualizarUsuario( usuario: Usuario ) {

    let url = `${ URL_SERVICIOS }/usuario/${ usuario._id }?token=${ this.token }`;

    return this.http.put( url, usuario )
                  .pipe(
                    map( (resp: any) => {
                      
                      if ( usuario._id === this.usuario._id ) {
                        let usuarioDB: Usuario = resp.usuario;
                        this.guardarStorage( usuarioDB._id, this.token, usuarioDB, this.menu );
                      }
                      
                      
                      Swal.fire(
                        'Usuario actualizado',
                        usuario.nombre,
                        'success'
                      );
                      
                      return true;

                    })
                  );
  }

  
  actualizarImagen( file: File, id: string ) {
    
    this._subirArchivoService.subirArchivo( file, 'usuarios', id )
                .then( (resp: any) => {
                  
                  this.usuario.img = resp.usuario.img;
                  Swal.fire('Imagen actualizada', this.usuario.nombre, 'success');
                  this.guardarStorage( id, this.token, this.usuario, this.menu );
                  
                })
                .catch( resp => {
                  console.log(resp);
                });
  }

// =================================================================
//                           Delete							 
// =================================================================

  borrarUsuario( id:string ) {
    
    let url = `${ URL_SERVICIOS }/usuario/${ id }?token=${ this.token }`;

    return this.http.delete( url )
                .pipe(
                  map( resp => {
                    Swal.fire(
                      'Usuario eliminado!',
                      'El usuario ha sido eliminado correctamente.',
                      'success'
                    );
                    return true;
                  })
                )
  }



// =================================================================
//                         Registro
// =================================================================

  crearUsuario( usuario: Usuario ) {

    let url = URL_SERVICIOS + '/usuario';

    return this.http.post( url, usuario )
                    .pipe(
                        map( (resp: any) => {
                          Swal.fire(
                            'Usuario creado',
                            usuario.email,
                            'success'
                          );
                          return resp.usuario;
                        }),
                        catchError( err => {
                          console.log(err.error.mensaje);
                          Swal.fire(err.error.mensaje, err.error.errors.message, 'error');
                          return throwError(err);
                        })
                    );
  }

  // =================================================================
  //                          Autenticación
  // =================================================================

  estaLoggeado() {
      return ( this.token.length > 5 ) ? true : false;
  }


  // =================================================================
  //                           Storage
  // =================================================================

  guardarStorage( id: string, token: string, usuario: Usuario, menu: any) {

    localStorage.setItem('id', id);
    localStorage.setItem('token', token);
    localStorage.setItem('usuario', JSON.stringify(usuario) );
    localStorage.setItem('menu', JSON.stringify(menu) );

    this.usuario = usuario;
    this.token = token;
    this.menu = menu;
  }


  cargarStorage() {
    if (localStorage.getItem('token')) {
      this.token = localStorage.getItem('token');
      this.usuario = JSON.parse( localStorage.getItem('usuario') );
      this.menu = JSON.parse( localStorage.getItem('menu') );
    } else {
      this.token = '';
      this.usuario = null;
      this.menu = [];
    }
  }



}
