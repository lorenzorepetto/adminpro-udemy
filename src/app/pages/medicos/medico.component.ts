import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Hospital } from '../../models/hospital.model';
import { Medico } from '../../models/medico.model';
import { HospitalService, MedicoService } from 'src/app/services/service.index';
import { ModalUploadService } from '../../components/modal-upload/modal-upload.service';

@Component({
  selector: 'app-medico',
  templateUrl: './medico.component.html',
  styles: []
})
export class MedicoComponent implements OnInit {
  
  hospitales: Hospital[] = [];
  medico: Medico = new Medico('', '', '', '', '');
  hospital: Hospital = new Hospital('');

  constructor( public _hospitalService: HospitalService,
               public _medicoService: MedicoService,
               public _modalUploadService: ModalUploadService,
               public router: Router,
               public activatedRoute: ActivatedRoute ) { 

    this.activatedRoute.params.subscribe( params => {
      
      let id = params['id'];
      
      if (id !== 'nuevo') {
        this.cargarMedico( id );
      }
    })

  }

  ngOnInit() {
    this._hospitalService.getHospitales()
              .subscribe( (resp: any) => this.hospitales = resp.hospitales);

    this._modalUploadService.notificacion
            .subscribe( resp => {
              this.medico.img = resp.medico.img;
            })
  }


  cargarMedico( id: string ) {
    
    this._medicoService.getMedico( id )
            .subscribe( medico => {
              
              this.medico = medico;
              this.medico.hospital = medico.hospital._id;
              this.cambioHospital( this.medico.hospital );

            }) 
  }

  guardarMedico( f:NgForm ) {
   
    if ( f.invalid ) {
      return;
    }

    this._medicoService.guardarMedico( this.medico )
            .subscribe( (medico:any) => {

              this.medico._id = medico._id;
              this.router.navigate(['/medico', medico._id ]);
            })
  }

  
  cambioHospital( id:string ) {
    
    this._hospitalService.getHospital( id )
            .subscribe( hospital => this.hospital = hospital)

  }

  cambiarFoto() {
    
    this._modalUploadService.mostrarModal('medicos', this.medico._id);
  }


}
