import { Component } from '@angular/core';
import { Sidebar } from '../../sidebar/sidebar';

@Component({
  selector: 'app-controle-de-volume',
  standalone: true,
  imports: [Sidebar],
  templateUrl: './controle-de-volume.html',
  styleUrl: './controle-de-volume.css'
})
export class ControleDeVolume {

  menuAberto = true;

  alterarMenu(aberto: boolean): void {

    this.menuAberto = aberto;

  }

}