import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { AdminDashboardComponent } from './components/admin-dashboard/admin-dashboard.component';
import { EmpleadoDashboardComponent } from './components/empleado-dashboard/empleado-dashboard.component';
import { BienvenidaAdminComponent } from './components/bienvenida-admin/bienvenida-admin.component';
import { BienvenidaEmpleadoComponent } from './components/bienvenida-empleado/bienvenida-empleado.component';
import { AdminEmpleadosComponent } from './components/admin-empleados/admin-empleados.component';
import { AdminClasificacionesComponent } from './components/admin-clasificaciones/admin-clasificaciones.component';
import { AdminPuestosComponent } from './components/admin-puestos/admin-puestos.component';
import { AdminExamenesComponent } from './components/admin-examenes/admin-examenes.component';
import { AuthGuard } from './guards/auth.guard';
import { RoleGuard } from './guards/role.guard';
import { EmpleadoExamenesComponent } from './components/empleado-examenes/empleado-examenes.component';
import { AdminPreguntasComponent } from './components/admin-preguntas/admin-preguntas.component';
import { AdminRespuestasComponent } from './components/admin-respuestas/admin-respuestas.component';
import { EmpleadoResponderExamenComponent } from './components/empleado-responder-examen/empleado-responder-examen.component';
import { ResultadosExamenEmpleadoComponent } from './components/resultados-examen-empleado/resultados-examen-empleado.component';
import { ResultadosHistoricosComponent } from './components/resultados-historicos/resultados-historicos.component';
import { HistorialExamenesComponent } from './components/historial-examenes/historial-examenes.component';


const routes: Routes = [
  { path: 'login', component: LoginComponent, data: { currentTitle: 'Inicio de sesión' } },
  { path: '', redirectTo: 'login', pathMatch: 'full' },

  {
    path: '',
    component: AdminDashboardComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { expectedRole: 'Administrador' },
    children: [
      { path: 'admin-dashboard', component: BienvenidaAdminComponent, data: { currentTitle: 'Panel Principal' } },
      { path: 'admin-empleados', component: AdminEmpleadosComponent, data: { currentTitle: 'Catálogo de Empleados' } },
      { path: 'admin-puestos', component: AdminPuestosComponent, data: { currentTitle: 'Catálogo de Puestos' } },
      { path: 'admin-clasificaciones', component: AdminClasificacionesComponent, data: { currentTitle: 'Catálogo de Clasificaciones' } },
      { path: 'admin-examenes', component: AdminExamenesComponent, data: { currentTitle: 'Catálogo de Exámenes' } },
      { path: 'preguntas/:idExamen', component: AdminPreguntasComponent, data: { currentTitle: 'Catálogo de Preguntas' } },
      { path: 'respuestas/:idPregunta', component: AdminRespuestasComponent, data: { currentTitle: 'Catálogo de Respuestas' } },
    ]
  },
  {
    path: '',
    component: EmpleadoDashboardComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { expectedRole: 'Empleado' },
    children: [
      { path: 'empleado-dashboard', component: BienvenidaEmpleadoComponent, data: { currentTitle: 'Panel Principal' } },
      { path: 'empleado-examenes', component: EmpleadoExamenesComponent, data: { currentTitle: 'Exámenes' } },
      { path: 'empleado-responder-examen/:idAsignacion', component: EmpleadoResponderExamenComponent, data: { currentTitle: 'Contestar Examen' } },
      { path: 'resultados-examen-empleado/:idAsignacion', component: ResultadosExamenEmpleadoComponent, data: { currentTitle: 'Resultados del Examen' } },
      { path: 'resultados-historicos', component: ResultadosHistoricosComponent, data: { currentTitle: 'Resultados Históricos' } },
      { path: 'historial-examenes', component: HistorialExamenesComponent, data: { currentTitle: 'Historial de Exámenes' } },
    ]
  }

];



@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
