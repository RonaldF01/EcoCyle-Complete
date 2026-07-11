import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cadastro-organizacao',
  imports: [],
  templateUrl: './cadastro-organizacao.html',
  styleUrl: './cadastro-organizacao.css'
})
export class CadastroOrganizacao {

  constructor(private router: Router){}

  voltarLogin(){
    this.router.navigate(['/']);
  }

  concluirCadastro() {

  const perfil = localStorage.getItem('perfilUsuario');

  switch (perfil) {

    case 'gerador':
      this.router.navigate(['/gerador/dashboard']);
      break;

    case 'cooperativa':
      this.router.navigate(['/cooperativa/dashboard']);
      break;

    case 'recicladora':
      this.router.navigate(['/recicladora/dashboard']);
      break;

    default:
      this.router.navigate(['/']);
      break;
  }

}
}