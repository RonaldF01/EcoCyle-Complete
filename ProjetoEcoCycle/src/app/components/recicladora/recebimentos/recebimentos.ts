import { Component } from '@angular/core';
import { Sidebar } from '../../sidebar/sidebar';

@Component({
  selector: 'app-recebimentos',
  standalone: true,
  imports: [Sidebar],
  templateUrl: './recebimentos.html',
  styleUrl: './recebimentos.css'
})
export class Recebimentos {

  menuAberto = true;

  alterarMenu(aberto: boolean) {
    this.menuAberto = aberto;
  }

}