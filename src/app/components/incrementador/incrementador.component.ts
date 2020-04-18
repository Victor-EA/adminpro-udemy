import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'app-incrementador',
  templateUrl: './incrementador.component.html',
  styles: [
  ]
})
export class IncrementadorComponent implements OnInit {

  @ViewChild('txtprogress') txtprogress: ElementRef;
  @Input('nombre') leyenda: string = 'Leyenda';
  @Input() progreso: number = 50;

  // tslint:disable-next-line: no-output-rename
  @Output('actualizaValor') cambioValor: EventEmitter<number> = new EventEmitter();

  constructor() { }

  ngOnInit(): void {
  }

  onChange(newValue: number){


    if ( newValue >= 100){
      this.progreso = 100;
    }else if ( newValue <= 0) {
      this.progreso = 0;
    }else{
      this.progreso = newValue;
    }

    this.txtprogress.nativeElement.value = this.progreso;

    this.cambioValor.emit(this.progreso);
  }


  cambiarValor(valor: number) {
    if (this.progreso >= 95) {
      this.progreso = 95;
    }
    if (this.progreso <= 5) {
      this.progreso = 5;
    }

    this.progreso = this.progreso + valor;

    this.cambioValor.emit(this.progreso);
    this.txtprogress.nativeElement.focus();
  }

}
