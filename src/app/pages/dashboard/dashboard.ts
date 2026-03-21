import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Auth, signOut } from '@angular/fire/auth';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { DividerModule } from 'primeng/divider';
import { AuthService } from '../../services/auth';
import { AvService } from '../../services/av';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, CardModule, ButtonModule, TagModule, DividerModule],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.scss']
})
export class Dashboard implements OnInit, OnDestroy {
  ethPrice = 0;
  priceUp = false;
  nombreUsuario = '';
  private priceInterval: any;

  avs = [
    { id: 'tincho', nombre: 'TINCHO', capital: 0, capitalRestante: 0, ppc: 0, porcentaje: 0, gp: 0, balasRestantes: 0 },
    { id: 'seba', nombre: 'SEBA', capital: 0, capitalRestante: 0, ppc: 0, porcentaje: 0, gp: 0, balasRestantes: 0 },
    { id: 'toro', nombre: 'TORO', capital: 0, capitalRestante: 0, ppc: 0, porcentaje: 0, gp: 0, balasRestantes: 0 },
  ];

  constructor(
    private auth: Auth,
    private router: Router,
    private authService: AuthService,
    private avService: AvService
  ) {}

  async ngOnInit() {
    this.nombreUsuario = this.authService.getNombre();
    this.fetchEthPrice();
    this.priceInterval = setInterval(() => this.fetchEthPrice(), 60000);
    await this.loadAvData();
  }

  ngOnDestroy() {
    clearInterval(this.priceInterval);
  }

  async fetchEthPrice() {
    try {
      const res = await fetch('https://api.kraken.com/0/public/Ticker?pair=ETHUSD');
      const data = await res.json();
      const newPrice = parseFloat(data.result.XETHZUSD.c[0]);
      this.priceUp = newPrice >= this.ethPrice;
      this.ethPrice = newPrice;
      this.recalcularAvs();
    } catch (e) {
      console.error('Error fetching ETH price', e);
    }
  }

  async loadAvData() {
    for (let av of this.avs) {
      const config = await this.avService.getAv(av.id);
      if (config) {
        av.capital = config.capital;
        av.ppc = config.ppc;
      }

      const ingresadas = await this.avService.getBalasIngresadas(av.id);
      const retiradas = await this.avService.getBalasRetiradas(av.id);

      const totalUsdtInvertido = ingresadas.reduce((s, b) => s + b.usdt, 0)
                               - retiradas.reduce((s, b) => s + b.usdt, 0);

      const totalBalasUsadas = ingresadas.reduce((s, b) => s + b.balas, 0)
                             - retiradas.reduce((s, b) => s + b.balas, 0);

      av.capitalRestante = av.capital - totalUsdtInvertido;
      av.balasRestantes = (config?.balas ?? 30) - totalBalasUsadas;

      const tamaño = totalUsdtInvertido * (config?.palanca ?? 5);
      av.porcentaje = av.ppc > 0 ? (av.ppc - this.ethPrice) / av.ppc * (config?.palanca ?? 5) : 0;
      av.gp = av.ppc > 0 ? (av.ppc - this.ethPrice) / av.ppc * tamaño : 0;
    }
  }

  recalcularAvs() {
    for (let av of this.avs) {
      if (av.ppc > 0) {
        const palanca = 5;
        av.porcentaje = (av.ppc - this.ethPrice) / av.ppc * palanca;
        av.gp = av.porcentaje * av.capital;
      }
    }
  }

  getPortcentajeClass(val: number): string {
    if (val > 0) return 'positive';
    if (val < 0) return 'negative';
    return 'neutral';
  }

  goToAv(id: string) {
    this.router.navigate(['/av', id]);
  }

  async logout() {
    await signOut(this.auth);
    this.router.navigate(['/login']);
  }
}
