import { Component } from '@angular/core';
import { Sidebar } from '../../sidebar/sidebar';

@Component({
  selector: 'app-coletas',
  standalone: true,
  imports: [Sidebar],
  templateUrl: './coletas.html',
  styleUrl: './coletas.css'
})
export class Coletas {

  menuAberto = true;

  alterarMenu(aberto: boolean): void {
    this.menuAberto = aberto;
  }

}