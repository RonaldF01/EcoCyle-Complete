import { Component } from '@angular/core';
import { Sidebar } from '../../sidebar/sidebar';

@Component({
  selector: 'app-match-mapa',
  standalone: true,
  imports: [Sidebar],
  templateUrl: './match-emapa.html',
  styleUrl: './match-emapa.css'
})
export class MatchEmapa {

  menuAberto = true;

  alterarMenu(aberto: boolean): void {

    this.menuAberto = aberto;

  }

}