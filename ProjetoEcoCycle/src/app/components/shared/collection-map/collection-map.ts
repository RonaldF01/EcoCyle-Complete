import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnChanges,
  OnDestroy,
  SimpleChanges,
  ViewChild
} from '@angular/core';

import * as L from 'leaflet';

import { Coleta } from '../../../models/coleta';
import { Usuario } from '../../../models/usuario';

interface Coordenadas {
  latitude: number;
  longitude: number;
}

interface ResultadoRota {
  distanciaKm: number;
  duracaoMinutos: number;
  coordenadas: [number, number][];
}

@Component({
  selector: 'app-collection-map',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './collection-map.html',
  styleUrl: './collection-map.css'
})
export class CollectionMap
  implements AfterViewInit, OnChanges, OnDestroy {

  @ViewChild('mapContainer')
  mapContainer?: ElementRef<HTMLDivElement>;

  @Input()
  coleta: Coleta | null = null;

  @Input()
  cooperativa: Usuario | null = null;

  mapaCarregando = false;
  erroMapa = '';

  distanciaKm: number | null = null;
  duracaoMinutos: number | null = null;
  enderecoDestino = '';

  private mapa?: L.Map;
  private camadaRota?: L.Polyline;
  private marcadorGerador?: L.Marker;
  private marcadorCooperativa?: L.Marker;

  private mapaInicializado = false;

  ngAfterViewInit(): void {

    this.inicializarMapa();

    if (this.coleta && this.cooperativa) {
      void this.carregarRota();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {

    if (
      this.mapaInicializado &&
      (
        changes['coleta'] ||
        changes['cooperativa']
      )
    ) {
      void this.carregarRota();
    }
  }

  ngOnDestroy(): void {
    this.mapa?.remove();
  }

  private inicializarMapa(): void {

    if (!this.mapContainer || this.mapa) {
      return;
    }

    this.mapa = L.map(
      this.mapContainer.nativeElement,
      {
        center: [-12.9714, -38.5014],
        zoom: 12,
        zoomControl: true
      }
    );

    L.tileLayer(
      'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      {
        maxZoom: 19,
        attribution:
          '&copy; OpenStreetMap contributors'
      }
    ).addTo(this.mapa);

    this.mapaInicializado = true;

    setTimeout(() => {
      this.mapa?.invalidateSize();
    }, 100);
  }

  async carregarRota(): Promise<void> {

    if (
      !this.mapa ||
      !this.coleta ||
      !this.cooperativa
    ) {
      return;
    }

    this.mapaCarregando = true;
    this.erroMapa = '';

    this.limparMapa();

    try {

      const origem =
        await this.obterCoordenadasCooperativa();

      const destino =
        await this.obterCoordenadasColeta();

      this.enderecoDestino =
        this.coleta.enderecoColeta;

      this.adicionarMarcadores(
        origem,
        destino
      );

      const rota =
        await this.calcularRota(
          origem,
          destino
        );

      this.distanciaKm =
        rota.distanciaKm;

      this.duracaoMinutos =
        rota.duracaoMinutos;

      this.camadaRota = L.polyline(
        rota.coordenadas,
        {
          color: '#16837a',
          weight: 6,
          opacity: 0.85,
          lineCap: 'round',
          lineJoin: 'round'
        }
      ).addTo(this.mapa);

      const limites = L.latLngBounds([
        [
          origem.latitude,
          origem.longitude
        ],
        [
          destino.latitude,
          destino.longitude
        ]
      ]);

      rota.coordenadas.forEach(
        coordenada => {
          limites.extend(coordenada);
        }
      );

      this.mapa.fitBounds(
        limites,
        {
          padding: [45, 45]
        }
      );

      this.salvarCoordenadasERota(
        origem,
        destino,
        rota
      );

      setTimeout(() => {
        this.mapa?.invalidateSize();
      }, 100);

    } catch (erro) {

      console.error(erro);

      this.erroMapa =
        erro instanceof Error
          ? erro.message
          : 'Não foi possível carregar a rota.';

    } finally {

      this.mapaCarregando = false;
    }
  }

  private async obterCoordenadasColeta():
    Promise<Coordenadas> {

    const coleta = this.coleta;

    if (!coleta) {
      throw new Error(
        'A coleta não foi identificada.'
      );
    }

    if (
      coleta.latitude !== undefined &&
      coleta.longitude !== undefined
    ) {
      return {
        latitude: coleta.latitude,
        longitude: coleta.longitude
      };
    }

    if (!coleta.enderecoColeta.trim()) {
      throw new Error(
        'A coleta não possui endereço cadastrado.'
      );
    }

    return this.geocodificarEndereco(
      coleta.enderecoColeta
    );
  }

  private async obterCoordenadasCooperativa():
    Promise<Coordenadas> {

    const coleta = this.coleta;
    const cooperativa = this.cooperativa;

    if (
      coleta?.cooperativaLatitude !== undefined &&
      coleta.cooperativaLongitude !== undefined
    ) {
      return {
        latitude:
          coleta.cooperativaLatitude,

        longitude:
          coleta.cooperativaLongitude
      };
    }

    if (!cooperativa) {
      throw new Error(
        'A cooperativa não foi identificada.'
      );
    }

    const enderecoCompleto = [
      cooperativa.endereco,
      cooperativa.cidade,
      cooperativa.estado,
      'Brasil'
    ]
      .filter(Boolean)
      .join(', ');

    if (!enderecoCompleto.trim()) {
      throw new Error(
        'A cooperativa não possui endereço cadastrado.'
      );
    }

    return this.geocodificarEndereco(
      enderecoCompleto
    );
  }

  private async geocodificarEndereco(
    endereco: string
  ): Promise<Coordenadas> {

    const parametros = new URLSearchParams({
      q: endereco,
      format: 'jsonv2',
      limit: '1',
      countrycodes: 'br'
    });

    const resposta = await fetch(
      `https://nominatim.openstreetmap.org/search?${parametros.toString()}`,
      {
        headers: {
          Accept: 'application/json'
        }
      }
    );

    if (!resposta.ok) {
      throw new Error(
        'O serviço de localização está indisponível.'
      );
    }

    const resultados =
      await resposta.json() as Array<{
        lat: string;
        lon: string;
        display_name: string;
      }>;

    if (!resultados.length) {
      throw new Error(
        `Endereço não localizado: ${endereco}`
      );
    }

    const latitude =
      Number(resultados[0].lat);

    const longitude =
      Number(resultados[0].lon);

    if (
      Number.isNaN(latitude) ||
      Number.isNaN(longitude)
    ) {
      throw new Error(
        'O serviço retornou coordenadas inválidas.'
      );
    }

    return {
      latitude,
      longitude
    };
  }

  private async calcularRota(
    origem: Coordenadas,
    destino: Coordenadas
  ): Promise<ResultadoRota> {

    const coordenadasUrl = [
      `${origem.longitude},${origem.latitude}`,
      `${destino.longitude},${destino.latitude}`
    ].join(';');

    const parametros = new URLSearchParams({
      overview: 'full',
      geometries: 'geojson',
      steps: 'false'
    });

    const resposta = await fetch(
      `https://router.project-osrm.org/route/v1/driving/${coordenadasUrl}?${parametros.toString()}`
    );

    if (!resposta.ok) {
      throw new Error(
        'Não foi possível calcular a rota.'
      );
    }

    const resultado =
      await resposta.json() as {
        code: string;
        routes: Array<{
          distance: number;
          duration: number;
          geometry: {
            coordinates:
              [number, number][];
          };
        }>;
      };

    if (
      resultado.code !== 'Ok' ||
      !resultado.routes.length
    ) {
      throw new Error(
        'Nenhuma rota de carro foi encontrada.'
      );
    }

    const rota = resultado.routes[0];

    return {
      distanciaKm:
        Number(
          (rota.distance / 1000).toFixed(1)
        ),

      duracaoMinutos:
        Math.round(
          rota.duration / 60
        ),

      coordenadas:
        rota.geometry.coordinates.map(
          ([longitude, latitude]) => [
            latitude,
            longitude
          ]
        )
    };
  }

  private adicionarMarcadores(
    origem: Coordenadas,
    destino: Coordenadas
  ): void {

    const mapa = this.mapa;
    const coleta = this.coleta;

    if (!mapa || !coleta) {
      return;
    }

    const iconeCooperativa = L.divIcon({
      className: 'marcador-personalizado',
      html: `
        <div class="marcador-mapa marcador-cooperativa">
          <i class="fa-solid fa-truck"></i>
        </div>
      `,
      iconSize: [46, 46],
      iconAnchor: [23, 42],
      popupAnchor: [0, -40]
    });

    const iconeGerador = L.divIcon({
      className: 'marcador-personalizado',
      html: `
        <div class="marcador-mapa marcador-gerador">
          <i class="fa-solid fa-industry"></i>
        </div>
      `,
      iconSize: [46, 46],
      iconAnchor: [23, 42],
      popupAnchor: [0, -40]
    });

    this.marcadorCooperativa = L.marker(
      [
        origem.latitude,
        origem.longitude
      ],
      {
        icon: iconeCooperativa
      }
    )
      .addTo(mapa)
      .bindPopup(`
        <strong>Base da cooperativa</strong><br>
        ${this.cooperativa?.nomeOrganizacao ?? ''}
      `);

    this.marcadorGerador = L.marker(
      [
        destino.latitude,
        destino.longitude
      ],
      {
        icon: iconeGerador
      }
    )
      .addTo(mapa)
      .bindPopup(`
        <strong>Local de coleta</strong><br>
        ${coleta.geradorNome}<br>
        ${coleta.enderecoColeta}
      `);
  }

  private limparMapa(): void {

    if (!this.mapa) {
      return;
    }

    if (this.camadaRota) {
      this.mapa.removeLayer(
        this.camadaRota
      );

      this.camadaRota = undefined;
    }

    if (this.marcadorGerador) {
      this.mapa.removeLayer(
        this.marcadorGerador
      );

      this.marcadorGerador = undefined;
    }

    if (this.marcadorCooperativa) {
      this.mapa.removeLayer(
        this.marcadorCooperativa
      );

      this.marcadorCooperativa = undefined;
    }

    this.distanciaKm = null;
    this.duracaoMinutos = null;
  }

  abrirNoGoogleMaps(): void {

    const coleta = this.coleta;

    if (
      !coleta ||
      coleta.latitude === undefined ||
      coleta.longitude === undefined
    ) {
      alert(
        'As coordenadas da coleta ainda não foram carregadas.'
      );
      return;
    }

    const parametros = new URLSearchParams({
      api: '1',
      destination:
        `${coleta.latitude},${coleta.longitude}`,
      travelmode: 'driving'
    });

    if (
      coleta.cooperativaLatitude !== undefined &&
      coleta.cooperativaLongitude !== undefined
    ) {
      parametros.set(
        'origin',
        `${coleta.cooperativaLatitude},${coleta.cooperativaLongitude}`
      );
    }

    window.open(
      `https://www.google.com/maps/dir/?${parametros.toString()}`,
      '_blank',
      'noopener,noreferrer'
    );
  }

  private salvarCoordenadasERota(
    origem: Coordenadas,
    destino: Coordenadas,
    rota: ResultadoRota
  ): void {

    const coletaAtual = this.coleta;

    if (!coletaAtual) {
      return;
    }

    const coletas = this.obterColetas();

    const indice = coletas.findIndex(
      coleta =>
        coleta.id === coletaAtual.id
    );

    if (indice === -1) {
      return;
    }

    const coletaAtualizada: Coleta = {
      ...coletas[indice],

      latitude:
        destino.latitude,

      longitude:
        destino.longitude,

      cooperativaLatitude:
        origem.latitude,

      cooperativaLongitude:
        origem.longitude,

      distanciaKm:
        rota.distanciaKm,

      duracaoMinutos:
        rota.duracaoMinutos
    };

    coletas[indice] = coletaAtualizada;

    localStorage.setItem(
      'coletas',
      JSON.stringify(coletas)
    );

    this.coleta = {
      ...coletaAtualizada
    };
  }

  private obterColetas(): Coleta[] {

    try {

      return JSON.parse(
        localStorage.getItem('coletas') || '[]'
      ) as Coleta[];

    } catch (erro) {

      console.error(
        'Erro ao carregar coletas:',
        erro
      );

      return [];
    }
  }
}