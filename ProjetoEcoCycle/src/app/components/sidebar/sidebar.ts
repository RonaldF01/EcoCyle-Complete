import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css'
})
export class Sidebar {

  @Input() perfil: 'gerador' | 'cooperativa' | 'recicladora' = 'gerador';

  @Output() menuAlterado = new EventEmitter<boolean>();

  menuAberto = true;

  toggleMenu() {

    this.menuAberto = !this.menuAberto;

    this.menuAlterado.emit(this.menuAberto);

  }

}