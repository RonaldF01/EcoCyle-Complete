import { Component } from '@angular/core';
import { Sidebar } from '../../sidebar/sidebar';

@Component({
  selector: 'app-dashboard-recicladora',
  standalone: true,
  imports: [Sidebar],
  templateUrl: './dashboard-recicladora.html',
  styleUrl: './dashboard-recicladora.css'
})
export class DashboardRecicladora {

  menuAberto = true;

  alterarMenu(aberto: boolean): void {
    this.menuAberto = aberto;
  }

}