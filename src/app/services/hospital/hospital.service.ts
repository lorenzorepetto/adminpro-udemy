import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, switchAll } from 'rxjs/operators';

import { URL_SERVICIOS } from '../../config/config';
import { UsuarioService } from '../usuario/usuario.service';
import Swal from 'sweetalert2';
import { Hospital } from 'src/app/models/hospital.model';


@Injectable({
  providedIn: 'root'
})
export class HospitalService {

  constructor( public http: HttpClient,
               public _usuarioService: UsuarioService ) { }



// =================================================================
//                           Read							 
// =================================================================

    getHospitales( desde: number = 0 ) {
        
      let url = `${ URL_SERVICIOS }/hospital?desde=${ desde }`;
    
      return this.http.get( url );
    }
    
    getHospital( id: string ) {

      let url = `${ URL_SERVICIOS }/hospital/${ id }`;

      return this.http.get( url )
                    .pipe(
                      map( (resp: any) => resp.hospital)
                    );
    }

    buscarHospitales( termino: string ) {
    
      let url = `${ URL_SERVICIOS }/busqueda/coleccion/hospitales/${ termino }`;
      
      return this.http.get( url )
                  .pipe(
                    map( (resp: any) => resp.hospitales )
                  )
    }

  
  // =================================================================
  //                           Registro							 
  // =================================================================
    
  crearHospital( nombre: string ) {
    
    let url = `${ URL_SERVICIOS }/hospital?token=${ this._usuarioService.token }`;

    return this.http.post( url, { nombre } )
                  .pipe(
                    map( (resp: any) => resp.hospital)
                  )
  }

  // =================================================================
  //                           Delete							 
  // =================================================================

  borrarHospital( id: string ) {

    let url = `${ URL_SERVICIOS }/hospital/${ id }?token=${ this._usuarioService.token }`;

    return this.http.delete( url )
                  .pipe(
                    map( (resp:any) => {
                      Swal.fire(
                        'Hospital borrado',
                        'Eliminado correctamente',
                        'success'
                      );
                    })
                  )
  }


  // =================================================================
  //                           Update							 
  // =================================================================
  
  actualizarHospital( hospital: Hospital ) {
    
    let url = `${ URL_SERVICIOS }/hospital/${ hospital._id }?token=${ this._usuarioService.token }`;
    
    return this.http.put( url, hospital )
                .pipe(
                  map( (resp: any) => {
                    
                    Swal.fire(
                      'Hospital actualizado',
                       hospital.nombre,
                      'success'
                    )
                    
                    return resp.hospital
                  })
                )
  }

}
