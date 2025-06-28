import { Component } from '@angular/core';
import { SidebarEmpleadoComponent } from "../../shared/sidebar-empleado/sidebar-empleado.component";
import { RouterOutlet } from '@angular/router';
import { TopbarComponent } from "../../shared/topbar/topbar.component";
import { FooterComponent } from '../../shared/footer/footer.component';


@Component({
  selector: 'empleado-dashboard',
  imports: [RouterOutlet, SidebarEmpleadoComponent, TopbarComponent, FooterComponent],
  templateUrl: './empleado-dashboard.component.html',
  styleUrl: './empleado-dashboard.component.css',
})
export class EmpleadoDashboardComponent { }
