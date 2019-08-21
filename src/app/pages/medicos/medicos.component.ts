import { Component, OnInit } from '@angular/core';
import { Medico } from 'src/app/models/medico.model';
import { MedicoService } from 'src/app/services/service.index';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-medicos',
  templateUrl: './medicos.component.html',
  styles: []
})
export class MedicosComponent implements OnInit {

  medicos: Medico[] = [];
  
  loading: boolean = true;
  
  desde: number;
  totalRegistros: number;


  constructor( public _medicoService: MedicoService ) { }

  ngOnInit() {
    this.cargarMedicos();
  }

  cargarMedicos() {
    this.loading = true;

    this._medicoService.getMedicos()
            .subscribe( (resp: any) => {
              this.totalRegistros = resp.total;
              this.medicos = resp.medicos;
                
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
    this.cargarMedicos();
  }

  buscarMedico( termino:string ) {
    
    if (termino.length <= 0) {
      this.cargarMedicos();
      return;
    }

    this.loading = true
    
    this._medicoService.buscarMedicos( termino )
                .subscribe( (medicos: Medico[]) => {
                  this.medicos = medicos;
                  this.loading = false;
                })
  }


  borrarMedico( medico: Medico ) {


    Swal.fire({
      title: '¿Está seguro?',
      text: "Borrará al médico " + medico.nombre,
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí!'
    }).then((result) => {
      
      if (result.value) {
        
        this._medicoService.borrarMedico( medico._id )
              .subscribe( () => this.cargarMedicos() );

        
      }
    })
    
  }
}
