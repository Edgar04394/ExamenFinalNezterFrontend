import { Component, Output, EventEmitter, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'search',
  imports: [FormsModule],
  templateUrl: './search.component.html',
  styleUrl: './search.component.css',
})
export class SearchComponent {
  @Input() tipo: string = ''; // tipo: "empleado", "puesto", etc.
  @Output() agregar = new EventEmitter();
  @Output() buscar = new EventEmitter<string>();

  textoBusqueda: string = '';

  agregarElemento() {
    this.agregar.emit();
  }

  onBuscar() {
    this.buscar.emit(this.textoBusqueda);
  }
}
