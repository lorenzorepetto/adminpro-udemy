import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { URL_SERVICIOS } from 'src/app/config/config';
import { map } from 'rxjs/operators';
import { UsuarioService } from '../usuario/usuario.service';
import Swal from 'sweetalert2';
import { Medico } from 'src/app/models/medico.model';

@Injectable({
  providedIn: 'root'
})
export class MedicoService {

  constructor( public http: HttpClient,
               public _usuarioService: UsuarioService ) { }

  // =================================================================
  //                           Read							 
  // =================================================================
  
  getMedicos() {
    
    let url = `${ URL_SERVICIOS }/medico`;

    return this.http.get( url );
  }

  getMedico( id:string ) {
    
    let url = `${ URL_SERVICIOS }/medico/${ id }`;

    return this.http.get( url )
                .pipe(
                  map( (resp:any) => resp.medico)
                )
  }

  buscarMedicos( termino: string ) {
    
    let url = `${ URL_SERVICIOS }/busqueda/coleccion/medicos/${ termino }`;
    
    return this.http.get( url )
                .pipe(
                  map( (resp: any) => resp.medicos )
                )
  }
  
  // =================================================================
  //                           Delete							 
  // =================================================================
  
  borrarMedico( id: string) {
    
    let url = `${ URL_SERVICIOS }/medico/${ id }?token=${ this._usuarioService.token }`;

    return this.http.delete( url )
                  .pipe(
                    map( resp => {
                      
                      Swal.fire('Médico borrado!', 'Médico borrado correctamente', 'success');
                      return resp;
                    })
                  )

  }  

  
  // =================================================================
  //                     Registro / Update						 
  // =================================================================
  
  guardarMedico( medico: Medico ) {

    let url = URL_SERVICIOS + '/medico';

    if ( medico._id ) {
      //actualizando
      
      url += '/' + medico._id;
      url += '?token=' + this._usuarioService.token;

      return this.http.put( url, medico )
              .pipe(
                map( (resp:any) => {

                  Swal.fire('Médico actualizado', medico.nombre, 'success');
                  return resp.medico;
                })
              )
    } else {
      //creando
      
      url += '?token=' + this._usuarioService.token;
      return this.http.post(url, medico)
              .pipe(
                map( (resp: any) => {
                  
                  Swal.fire('Médico creado', medico.nombre, 'success');
                  return resp.medico;
                }) 
              )
    }

  }



}
