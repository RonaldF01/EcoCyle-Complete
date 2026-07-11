import { Routes } from '@angular/router';

// LOGIN
import { Login } from './components/pages-login/login-main/login/login';
import { Cadastro } from './components/pages-login/login-main/cadastro/cadastro';
import { CadastroOrganizacao } from './components/pages-login/login-main/cadastro-organizacao/cadastro-organizacao';
import { Perfil } from './components/pages-login/login-main/perfil/perfil';

// GERADOR
import { DashboardGerador } from './components/gerador/dashboard-gerador/dashboard-gerador';
import { SolicitarColeta } from './components/gerador/solicitar-coleta/solicitar-coleta';
import { IncentivosFiscais } from './components/gerador/incentivos-fiscais/incentivos-fiscais';
import { SelosCertificados } from './components/gerador/selos-certificados/selos-certificados';

// COOPERATIVA
import { DashboardCooperativa } from './components/cooperativa/dashboard-cooperativa/dashboard-cooperativa';
import { MatchEmapa } from './components/cooperativa/match-emapa/match-emapa';
import { Frota } from './components/cooperativa/frota/frota';
import { Coletas } from './components/cooperativa/coletas/coletas';

// RECICLADORA
import { DashboardRecicladora } from './components/recicladora/dashboard-recicladora/dashboard-recicladora';
import { Recebimentos } from './components/recicladora/recebimentos/recebimentos';
import { ControleDeVolume } from './components/recicladora/controle-de-volume/controle-de-volume';

export const routes: Routes = [

  {
    path: '',
    component: Login
  },

  {
    path: 'cadastro',
    component: Cadastro
  },

  {
    path: 'cadastro-organizacao',
    component: CadastroOrganizacao
  },

  {
    path: 'perfil',
    component: Perfil
  },

  // GERADOR

  {
    path: 'gerador/dashboard',
    component: DashboardGerador
  },

  {
    path: 'gerador/solicitar-coleta',
    component: SolicitarColeta
  },

  {
    path: 'gerador/incentivos-fiscais',
    component: IncentivosFiscais
  },

  {
    path: 'gerador/selos-certificados',
    component: SelosCertificados
  },

  // COOPERATIVA

  {
    path: 'cooperativa/dashboard',
    component: DashboardCooperativa
  },

  {
    path: 'cooperativa/match-emapa',
    component: MatchEmapa
  },

  {
    path: 'cooperativa/frota',
    component: Frota
  },

  {
    path: 'cooperativa/coletas',
    component: Coletas
  },

  // RECICLADORA

  {
    path: 'recicladora/dashboard',
    component: DashboardRecicladora
  },

  {
    path: 'recicladora/recebimentos',
    component: Recebimentos
  },

  {
    path: 'recicladora/controle-de-volume',
    component: ControleDeVolume
  },

  {
    path: '**',
    redirectTo: ''
  }

];