import { Component } from '@angular/core';
import { Sidebar } from '../../sidebar/sidebar';

@Component({
  selector: 'app-frota',
  standalone: true,
  imports: [Sidebar],
  templateUrl: './frota.html',
  styleUrl: './frota.css'
})
export class Frota {

  menuAberto = true;

  alterarMenu(aberto: boolean): void {
    this.menuAberto = aberto;
  }

}