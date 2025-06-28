import { CommonModule, NgFor } from '@angular/common';
import { Component } from '@angular/core';
import { SearchComponent } from '../../shared/search/search.component';
import { FormsModule } from '@angular/forms';
import { ClasificacionModalComponent } from '../clasificacion-modal/clasificacion-modal.component';
import { Clasificacion } from '../../models/clasificacion';
import { ClasificacionService } from '../../services/clasificacion.service';
import { MatTooltip } from '@angular/material/tooltip';

@Component({
  selector: 'admin-clasificaciones',
  standalone: true,
  imports: [CommonModule, FormsModule, SearchComponent, ClasificacionModalComponent, MatTooltip],
  templateUrl: './admin-clasificaciones.component.html',
  styleUrl: './admin-clasificaciones.component.css',
})

export class AdminClasificacionesComponent {
  clasificaciones: Clasificacion[] = [];
  clasificacionesOriginal: Clasificacion[] = [];
  modalVisible = false;
  clasificacionEditando: Clasificacion | null = null;

  currentPage: number = 1;
  rowsPerPage: number = 10;

  constructor(private clasificacionService: ClasificacionService) { }

  ngOnInit(): void {
    this.cargarClasificaciones();
  }

  cargarClasificaciones() {
    this.clasificacionService.visualizar().subscribe({
      next: (data) => {
        this.clasificacionesOriginal = data;
        this.clasificaciones = data;
      },
      error: (err) => console.error('Error al cargar clasificaciones', err),
    });
  }

  abrirModal() {
    this.clasificacionEditando = null;
    this.modalVisible = true;
  }

  cerrarModal() {
    this.modalVisible = false;
  }

  agregarClasificacion(clasificacion: Clasificacion) {
    if (this.clasificacionEditando) {
      clasificacion.idClasificacion = this.clasificacionEditando.idClasificacion;
      this.clasificacionService.actualizar(clasificacion.idClasificacion, clasificacion).subscribe({
        next: () => {
          this.cargarClasificaciones();
          this.cerrarModal();
        },
        error: (err) => {
          console.error('Error al actualizar clasificación', err);
          alert('Error al actualizar clasificación.');
        },
      });
    } else {
      this.clasificacionService.crear(clasificacion).subscribe({
        next: () => {
          this.cargarClasificaciones();
          this.cerrarModal();
        },
        error: (err) => {
          console.error('Error al crear clasificación', err);
          alert('Error al crear clasificación.');
        },
      });
    }
  }

  editarClasificacion(clasificacion: Clasificacion) {
    this.clasificacionEditando = { ...clasificacion };
    this.modalVisible = true;
  }

  eliminarClasificacion(idClasificacion: number) {
    if (confirm('¿Estás seguro de eliminar esta clasificación?')) {
      this.clasificacionService.eliminar(idClasificacion).subscribe({
        next: () => this.cargarClasificaciones(),
        error: (err) => {
          console.error('Error al eliminar clasificación', err);
          alert('Error al eliminar clasificación.');
        },
      });
    }
  }
  getColorCode(colorName: string): string {
    const colorMap: { [key: string]: string } = {
      'naranja': '#FFA500',
      'azul': '#0000FF',
      'amarillo': '#FFFF00',
      'rojo': '#FF0000',
      'verde': '#008000',
      'negro': '#000000',
      'blanco': '#FFFFFF',
      'gris': '#808080',
      'beige': '#F5F5DC',
      'veige': '#F5F5DC',
      'plateado': '#C0C0C0',
      'dorado': '#FFD700',
      'morado': '#800080',
      'lila': '#C8A2C8',
      'rosa': '#FFC0CB',
      'rosado': '#FFC0CB',
      'cafe': '#A52A2A',
      'marron': '#A52A2A',
      'turquesa': '#40E0D0',
      'verde lima': '#00FF00',
      'verde oliva': '#808000',
      'vino': '#722F37',
      'azul marino': '#000080',
      'azul cielo': '#87CEEB',
      'cyan': '#00FFFF',
      'magenta': '#FF00FF',
      'coral': '#FF7F50',
      'salmon': '#FA8072',
      'oro': '#FFD700',
      'bronce': '#CD7F32'
    };

    const normalizedColor = colorName.toLowerCase()
      .trim()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/\s+/g, ' ');

    if (colorMap[normalizedColor]) {
      return colorMap[normalizedColor];
    }

    const foundColor = Object.keys(colorMap).find(key =>
      normalizedColor.includes(key)
    );

    if (foundColor) {
      return colorMap[foundColor];
    }

    if (/^#([0-9A-F]{3}){1,2}$/i.test(normalizedColor)) {
      return normalizedColor;
    }

    return this.generateRandomColor();
  }

  generateRandomColor(): string {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

  filtrarClasificaciones(termino: string) {
    const lower = termino.toLowerCase();
    this.clasificaciones = this.clasificacionesOriginal.filter(emp =>
      emp.nombre.toLowerCase().includes(lower) ||
      emp.color.toLowerCase().includes(lower)
    );
    this.currentPage = 1; // Reiniciar a la primera página
  }

  get paginatedClasificaciones(): Clasificacion[] {
    const start = (this.currentPage - 1) * this.rowsPerPage;
    const end = start + this.rowsPerPage;
    return this.clasificaciones.slice(start, end);
  }

  totalPaginas(): number {
    return Math.ceil(this.clasificaciones.length / this.rowsPerPage);
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
    const end = Math.min(start + this.rowsPerPage - 1, this.clasificaciones.length);
    return `${start}-${end}`;
  }
}
