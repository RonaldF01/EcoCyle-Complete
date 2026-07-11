import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Chart } from 'chart.js/auto';
import { Sidebar } from '../../sidebar/sidebar';
import { Router } from '@angular/router';


@Component({
  selector: 'app-dashboard-gerador',
  standalone: true,
  imports: [Sidebar],
  templateUrl: './dashboard-gerador.html',
  styleUrl: './dashboard-gerador.css',
})
export class DashboardGerador implements OnInit, AfterViewInit {

  menuAberto = true;

  nomeUsuario = '';

 // Banner
 economia = 18540;

 // KPIs
 residuosDestinados = 12.8;
 co2Evitado = 6.4;
 certificados = 18;
 coletasRealizadas = 27;
 mtrEmitidos = 27;
 tendencia = 15;

 // Compliance
 destinacao = 100;
 riscoMulta = 'Zero';

  constructor(private router: Router) {}

  ngOnInit(): void {

    this.nomeUsuario =
      localStorage.getItem('nomeUsuario') || 'Grande Gerador';


      const dados = localStorage.getItem('dashboardGerador');

  if (dados) {

  const dashboard = JSON.parse(dados);

  this.economia = dashboard.economia;
  this.residuosDestinados = dashboard.residuosDestinados;
  this.co2Evitado = dashboard.co2Evitado;
  this.certificados = dashboard.certificados;
  this.coletasRealizadas = dashboard.coletasRealizadas;
  this.mtrEmitidos = dashboard.mtrEmitidos;
  this.tendencia = dashboard.tendencia;

    }
  }



  ngAfterViewInit(): void {

    const canvas = document.getElementById('graficoResiduos') as HTMLCanvasElement;

    if (!canvas) return;

    new Chart(canvas, {

      type: 'line',

      data: {

        labels: [
          'Jan',
          'Fev',
          'Mar',
          'Abr',
          'Mai',
          'Jun',
          'Jul'
        ],

        datasets: [

          {

            label: 'Resíduos',

            data: [
              480,
              760,
              1350,
              1220,
              1860,
              2480,
              2970
            ],

            borderColor: '#16a34a',

            borderWidth: 4,

            fill: true,

            tension: .45,

            pointRadius: 0,

            pointHoverRadius: 7,

            pointHitRadius: 20,

            pointHoverBorderWidth: 3,

            pointBackgroundColor: '#16a34a',

            pointHoverBackgroundColor: '#16a34a',

            pointHoverBorderColor: '#ffffff',

            backgroundColor: (context) => {

              const chart = context.chart;

              const { ctx, chartArea } = chart;

              if (!chartArea) {

                return 'rgba(22,163,74,.15)';

              }

              const gradient = ctx.createLinearGradient(
                0,
                chartArea.top,
                0,
                chartArea.bottom
              );

              gradient.addColorStop(0, 'rgba(22,163,74,.35)');
              gradient.addColorStop(1, 'rgba(22,163,74,0)');

              return gradient;

            }

          }

        ]

      },

      options: {

        responsive: true,

        maintainAspectRatio: false,

        interaction: {

          intersect: false,

          mode: 'index'

        },

        plugins: {

          legend: {

            display: false

          },

          tooltip: {

            backgroundColor: '#111827',

            titleColor: '#ffffff',

            bodyColor: '#ffffff',

            borderColor: '#16a34a',

            borderWidth: 1,

            displayColors: false,

            padding: 14,

            cornerRadius: 12,

            callbacks: {

              title: (items) => {

                return 'Mês: ' + items[0].label;

              },

              label: (context) => {

                return 'Kg: ' + context.parsed.y;

              }

            }

          }

        },

        scales: {

x: {

    ticks: {

        color: '#64748b',

        font: {

            size: 13,

            weight: 500

        }

    },

    grid: {

        display: true,

        color: '#edf2f7',

        lineWidth: 1,

        drawTicks: false

    },

    border: {

        display: false

    }

},

          y: {

            min: 0,

            max: 3200,

            ticks: {

              stepSize: 800,

              color: '#64748b',

              font: {

                size: 13,

                weight: 500

              }

            },

            grid: {

              color: '#e5e7eb',

              lineWidth: 1

            },

            border: {

              display: false

            }

          }

        }

      }

    });

  }

  alterarMenu(aberto: boolean) {

    this.menuAberto = aberto;

  }

  irSolicitarColeta() {

  this.router.navigate(['/gerador/solicitar-coleta']);

  }

  irIncentivos() {

  this.router.navigate(['/gerador/incentivos-fiscais']);

  }

}