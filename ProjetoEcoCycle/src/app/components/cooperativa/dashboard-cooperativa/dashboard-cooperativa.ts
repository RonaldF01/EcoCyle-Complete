import { Component, OnInit } from '@angular/core';
import { Sidebar } from '../../sidebar/sidebar';

@Component({
  selector: 'app-dashboard-cooperativa',
  standalone: true,
  imports: [Sidebar],
  templateUrl: './dashboard-cooperativa.html',
  styleUrl: './dashboard-cooperativa.css'
})
export class DashboardCooperativa implements OnInit {

  menuAberto = true;

  nomeUsuario = '';

  constructor() {}

  ngOnInit(): void {

    this.nomeUsuario =
      localStorage.getItem('nomeUsuario') || 'Cooperativa';

  }

  alterarMenu(aberto: boolean): void {

    this.menuAberto = aberto;

  }

}