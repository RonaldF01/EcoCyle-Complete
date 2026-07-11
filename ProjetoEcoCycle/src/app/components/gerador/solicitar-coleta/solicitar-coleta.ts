import { Component } from '@angular/core';
import { Sidebar } from '../../sidebar/sidebar';

@Component({
  selector: 'app-solicitar-coleta',
  standalone: true,
  imports: [Sidebar],
  templateUrl: './solicitar-coleta.html',
  styleUrl: './solicitar-coleta.css',
})
export class SolicitarColeta {

  menuAberto = true;

alterarMenu(aberto: boolean) {

  this.menuAberto = aberto;

}

}
