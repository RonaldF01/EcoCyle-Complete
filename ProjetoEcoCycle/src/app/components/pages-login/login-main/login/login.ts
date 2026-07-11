import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {

  constructor(private router: Router) {}

  slideAtual = 0;

  slides = [
    {
      titulo: 'GERADOR',
      icone: 'fa-building',
      headline: 'Gerencie seus resíduos com eficiência',
      descricao:
        'Solicite coletas, acompanhe a destinação e gere certificados de conformidade com a PNRS.',
      itens: [
        'Solicitação de coleta em poucos cliques',
        'Certificados de rastreabilidade',
        'Acesso a incentivos fiscais'
      ]
    },

    {
      titulo: 'COOPERATIVA',
      icone: 'fa-recycle',
      headline: 'Conecte-se com geradores e recicladoras',
      descricao:
        'Receba solicitações de coleta, gerencie sua frota e otimize rotas de transporte.',
      itens: [
        'Match automático de coletas',
        'Gestão de frota e motoristas',
        'Acompanhamento em tempo real'
      ]
    },

    {
      titulo: 'RECICLADORA',
      icone: 'fa-industry',
      headline: 'Receba e processe resíduos com rastreabilidade',
      descricao:
        'Controle de volumes recebidos, aferição de peso e validação de manifestos.',
      itens: [
        'Controle de volume por tipo',
        'Aferição e validação de peso',
        'Rastreabilidade completa'
      ]
    }
  ];

  proximoSlide() {
    this.slideAtual = (this.slideAtual + 1) % this.slides.length;
  }

  slideAnterior() {
    this.slideAtual =
      (this.slideAtual - 1 + this.slides.length) % this.slides.length;
  }

  irParaSlide(indice: number) {
    this.slideAtual = indice;
  }

 entrar() {

  const perfil = localStorage.getItem('perfilUsuario');

  if (perfil === 'gerador') {

    this.router.navigate(['/gerador/dashboard']);

  } else if (perfil === 'cooperativa') {

    this.router.navigate(['/cooperativa/dashboard']);

  } else if (perfil === 'recicladora') {

    this.router.navigate(['/recicladora/dashboard']);

  } else {

    alert('Nenhum perfil cadastrado.');

  }

}

  irCadastro() {
    this.router.navigate(['/cadastro']);
  }

}