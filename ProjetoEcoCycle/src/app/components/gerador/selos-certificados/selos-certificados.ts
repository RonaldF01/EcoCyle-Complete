import { Component } from '@angular/core';
import { Sidebar } from '../../sidebar/sidebar';

@Component({
  selector: 'app-selos-certificados',
  standalone: true,
  imports: [Sidebar],
  templateUrl: './selos-certificados.html',
  styleUrl: './selos-certificados.css',
})
export class SelosCertificados {


    menuAberto = true;

  alterarMenu(aberto: boolean) {

  this.menuAberto = aberto;

}
}
