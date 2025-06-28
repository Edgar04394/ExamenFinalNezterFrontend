import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SearchComponent } from '../../shared/search/search.component';
import { PuestoService } from '../../services/puesto.service';
import { Puesto } from '../../models/puesto';
import { PuestoModalComponent } from "../puesto-modal/puesto-modal.component";
import { FormsModule } from '@angular/forms';
import { MatTooltip } from '@angular/material/tooltip';

@Component({
  selector: 'admin-puestos',
  imports: [RouterModule, CommonModule, SearchComponent, PuestoModalComponent, FormsModule, MatTooltip],
  templateUrl: './admin-puestos.component.html',
  styleUrl: './admin-puestos.component.css',
})

export class AdminPuestosComponent {
  puestos: Puesto[] = [];
  puestosOriginal: Puesto[] = [];
  puestoEditando: Puesto | null = null;
  modalVisible = false;

  currentPage: number = 1;
  rowsPerPage: number = 10;

  constructor(private puestoService: PuestoService) { }

  ngOnInit(): void {
    this.cargarPuestos();
  }

  cargarPuestos() {
    this.puestoService.visualizar().subscribe({
      next: (data) => {
        this.puestosOriginal = data;
        this.puestos = data;
      },
      error: (err) => console.error('Error al cargar puestos', err),
    });
  }

  abrirModal() {
    this.puestoEditando = null;
    this.modalVisible = true;
  }

  cerrarModal() {
    this.modalVisible = false;
  }

  agregarPuesto(puesto: Puesto) {
    if (this.puestoEditando && this.puestoEditando.idPuesto > 0) {
      puesto.idPuesto = this.puestoEditando.idPuesto; // Asegura que el id se mantenga
      this.puestoService.actualizar(puesto.idPuesto, puesto).subscribe({
        next: () => {
          this.cargarPuestos();
          this.cerrarModal();
        },
        error: (err) => {
          console.error('Error al actualizar puesto', err);
          alert('Error al actualizar puesto.');
        }
      });
    } else {
      // Creación
      this.puestoService.crear(puesto).subscribe({
        next: () => {
          this.cargarPuestos();
          this.cerrarModal();
        },
        error: (err) => {
          console.error('Error al crear puesto', err);
          alert('Error al crear puesto.');
        }
      });
    }
  }

  editarPuesto(puesto: Puesto) {
    this.puestoEditando = { ...puesto };  // <- CLONAR para evitar modificar directamente
    this.modalVisible = true;
  }

  eliminarPuesto(id: number) {
    if (confirm('¿Estás seguro de eliminar este puesto?')) {
      this.puestoService.eliminar(id).subscribe({
        next: () => this.cargarPuestos(),
        error: (err) => {
          const mensaje = err.error?.mensaje || 'Error al eliminar puesto.';
          alert(mensaje);
          console.error('Error al eliminar puesto', err);
        }
      });
    }
  }


  filtrarPuestos(termino: string) {
    const lower = termino.toLowerCase();
    this.puestos = this.puestosOriginal.filter(emp =>
      emp.puesto.toLowerCase().includes(lower)
    );
    this.currentPage = 1; // 👈 Reinicia a la primera página
  }

  get paginatedPuestos(): Puesto[] {
    const start = (this.currentPage - 1) * this.rowsPerPage;
    const end = start + this.rowsPerPage;
    return this.puestos.slice(start, end);
  }

  totalPaginas(): number {
    return Math.ceil(this.puestos.length / this.rowsPerPage);
  }

  cambiarPagina(pagina: number) {
    this.currentPage = pagina;
  }

  anteriorPagina() {
    if (this.currentPage > 1) this.currentPage--;
  }

  siguientePagina() {
    if (this.currentPage < this.totalPaginas()) this.currentPage++;
  }

  mostrarRango(): string {
    const start = (this.currentPage - 1) * this.rowsPerPage + 1;
    const end = Math.min(start + this.rowsPerPage - 1, this.puestos.length);
    return `${start}-${end}`;
  }
}
