import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { InputNumberModule } from 'primeng/inputnumber';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { TagModule } from 'primeng/tag';
import { DividerModule } from 'primeng/divider';
import { AvService, Bala, BalaRetirada, AvData } from '../../services/av';

@Component({
  selector: 'app-av-detail',
  standalone: true,
  imports: [CommonModule, FormsModule, ButtonModule, InputNumberModule, TableModule, DialogModule, TagModule, DividerModule],
  templateUrl: './av-detail.html',
  styleUrls: ['./av-detail.scss']
})
export class AvDetail implements OnInit {
  avId = '';
  ethPrice = 0;
  config: AvData = { capital: 0, balas: 30, palanca: 5, ppc: 0 };
  balasIngresadas: Bala[] = [];
  balasRetiradas: BalaRetirada[] = [];

  // Calculados
  totalUsdtInvertido = 0;
  totalBalasUsadas = 0;
  capitalRestante = 0;
  balasRestantes = 0;
  tamano = 0;
  porcentaje = 0;
  gp = 0;
  tp = 0;
  liquidacion = 0;
  ppcCalculado = 0;

  // Dialogs
  showDialogIngresada = false;
  showDialogRetirada = false;
  showDialogConfig = false;

  nuevaBala: Bala = { hora: '', fecha: '', balas: 0, usdt: 0, precioCompra: 0 };
  nuevaRetirada: BalaRetirada = { hora: '', fecha: '', balas: 0, usdt: 0, precioVenta: 0 };

 constructor(
  private route: ActivatedRoute,
  private router: Router,
  private avService: AvService,
  private cdr: ChangeDetectorRef
) {}

  async ngOnInit() {
    this.avId = this.route.snapshot.paramMap.get('id') ?? '';
    await this.fetchEthPrice();
    await this.loadData();
    setInterval(() => this.fetchEthPrice(), 60000);
  }

  async fetchEthPrice() {
    try {
      const res = await fetch('https://api.kraken.com/0/public/Ticker?pair=ETHUSD');
      const data = await res.json();
      this.ethPrice = parseFloat(data.result.XETHZUSD.c[0]);
      this.recalcular();
    } catch (e) {}
  }

  async loadData() {
    const config = await this.avService.getAv(this.avId);
    if (config) this.config = config;
    this.balasIngresadas = await this.avService.getBalasIngresadas(this.avId);
    this.balasRetiradas = await this.avService.getBalasRetiradas(this.avId);
    this.recalcular();
  }

  recalcular() {
    const usdtIn = this.balasIngresadas.reduce((s, b) => s + b.usdt, 0);
    const usdtOut = this.balasRetiradas.reduce((s, b) => s + b.usdt, 0);
    const balasIn = this.balasIngresadas.reduce((s, b) => s + b.balas, 0);
    const balasOut = this.balasRetiradas.reduce((s, b) => s + b.balas, 0);

    this.totalUsdtInvertido = usdtIn - usdtOut;
    this.totalBalasUsadas = balasIn - balasOut;
    this.capitalRestante = this.config.capital - this.totalUsdtInvertido;
    this.balasRestantes = this.config.balas - this.totalBalasUsadas;
    this.tamano = this.totalUsdtInvertido * this.config.palanca;

    // PPC calculado
    const ethIn = this.balasIngresadas.reduce((s, b) => s + (b.precioCompra > 0 ? b.usdt / b.precioCompra : 0), 0);
    const ethOut = this.balasRetiradas.reduce((s, b) => s + (b.precioVenta > 0 ? b.usdt / b.precioVenta : 0), 0);
    this.ppcCalculado = ethIn - ethOut > 0 ? this.totalUsdtInvertido / (ethIn - ethOut) : 0;

    const ppc = this.config.ppc > 0 ? this.config.ppc : this.ppcCalculado;
    this.porcentaje = ppc > 0 ? (ppc - this.ethPrice) / ppc * this.config.palanca : 0;
    this.gp = ppc > 0 ? (ppc - this.ethPrice) / ppc * this.tamano : 0;
    this.tp = ppc * (1 - 0.17 / this.config.palanca);
    this.liquidacion = ppc * (1 + 1 / this.config.palanca);
  }

async guardarConfig() {
  await this.avService.saveAv(this.avId, this.config);
  this.recalcular();
  this.showDialogConfig = false;
  this.cdr.detectChanges();
}

async agregarBalaIngresada() {
  this.nuevaBala.usdt = this.nuevaBala.balas * (this.config.capital / this.config.balas);
  await this.avService.addBalaIngresada(this.avId, this.nuevaBala);
  this.balasIngresadas = await this.avService.getBalasIngresadas(this.avId);
  this.nuevaBala = { hora: '', fecha: '', balas: 0, usdt: 0, precioCompra: 0 };
  this.showDialogIngresada = false;
  this.recalcular();
  this.cdr.detectChanges();
}

async agregarBalaRetirada() {
  this.nuevaRetirada.usdt = this.nuevaRetirada.balas * (this.config.capital / this.config.balas);
  await this.avService.addBalaRetirada(this.avId, this.nuevaRetirada);
  this.balasRetiradas = await this.avService.getBalasRetiradas(this.avId);
  this.nuevaRetirada = { hora: '', fecha: '', balas: 0, usdt: 0, precioVenta: 0 };
  this.showDialogRetirada = false;
  this.recalcular();
  this.cdr.detectChanges();
}

  getPnlClass(val: number) {
    if (val > 0) return 'positive';
    if (val < 0) return 'negative';
    return 'neutral';
  }

  volver() {
    this.router.navigate(['/dashboard']);
  }
}
