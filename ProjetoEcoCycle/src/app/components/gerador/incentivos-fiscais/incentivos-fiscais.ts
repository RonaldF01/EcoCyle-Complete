import { Component } from '@angular/core';
import { Sidebar } from '../../sidebar/sidebar';

@Component({
  selector: 'app-incentivos-fiscais',
  standalone: true,
  imports: [Sidebar],
  templateUrl: './incentivos-fiscais.html',
  styleUrl: './incentivos-fiscais.css',
})
export class IncentivosFiscais {

  menuAberto = true;

  alterarMenu(aberto: boolean) {

    this.menuAberto = aberto;

  }




  



}