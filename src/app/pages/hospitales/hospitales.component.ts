import { Component, OnInit } from '@angular/core';
import { HospitalService } from 'src/app/services/service.index';
import Swal from 'sweetalert2';

import { Hospital } from '../../models/hospital.model';
import { ModalUploadService } from '../../components/modal-upload/modal-upload.service';

@Component({
  selector: 'app-hospitales',
  templateUrl: './hospitales.component.html',
  styleUrls: ['./hospitales.component.css']
})
export class HospitalesComponent implements OnInit {

  hospitales: Hospital[] = [];
  
  loading: boolean = true;
  
  desde: number = 0;
  totalRegistros: number;

  constructor( public _hospitalService: HospitalService,
               public _modalUploadService: ModalUploadService ) { }

  ngOnInit() {
    this.cargarHospitales();
    this._modalUploadService.notificacion
            .subscribe( () => this.cargarHospitales() );
  }

  cargarHospitales() {
    
    this.loading = true;

    this._hospitalService.getHospitales( this.desde )
              .subscribe( (resp: any) => {

                this.totalRegistros = resp.total;
                this.hospitales = resp.hospitales;
                
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
    this.cargarHospitales();
  }
 
  
  buscarHospital( termino: string ) {
    
    if (termino.length <= 0) {
      this.cargarHospitales();
      return;
    }

    this.loading = true
    
    this._hospitalService.buscarHospitales( termino )
                .subscribe( (hospitales: Hospital[]) => {
                  this.hospitales = hospitales;
                  this.loading = false;
                })
  }


  crearHospital() {
    
    Swal.fire({
      title: 'Crear hospital',
      text: 'Ingrese el nombre del hospital',
      input: 'text',
      showCancelButton: true
    })
    .then( (nombre) => {
      
      if (!nombre.value || nombre.value === 0) {
        return;
      }
      
      this._hospitalService.crearHospital( nombre.value )
                  .subscribe( () => {
                    this.cargarHospitales();
                    Swal.fire('Hospital cargado correctamente!') 
                  })

    })

  }

  guardarHospital( hospital: Hospital ) {
    
    this._hospitalService.actualizarHospital( hospital )
              .subscribe( () => this.cargarHospitales() );
  }

  borrarHospital( hospital: Hospital ) {
    
    Swal.fire({
      title: '¿Está seguro?',
      text: "Borrará al hospital " + hospital.nombre,
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí!'
    }).then((result) => {
      
      if (result.value) {
        
        this._hospitalService.borrarHospital( hospital._id )
                  .subscribe( () => this.cargarHospitales() );

        
      }
    })
    
  }


  actualizarImagen( hospital: Hospital ) {
    
    this._modalUploadService.mostrarModal('hospitales', hospital._id);
  }

}
