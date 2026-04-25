import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Auth, signOut } from '@angular/fire/auth';
import { AuthService } from '../../services/auth';
import { StrategyService } from '../../services/strategy';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.scss']
})
export class Dashboard implements OnInit, OnDestroy {
  nombreUsuario = '';
  private priceInterval: any;

  strategies = [
    { id: 'anti-vitalik', nombre: 'Anti Vitalik', tipo: 'ETH Short', capital: 0, capitalRestante: 0, ppc: 0, porcentaje: 0, gp: 0, balasRestantes: 0 },
    { id: 'michael-saylor', nombre: 'Michael Saylor', tipo: 'BTC Long', capital: 0, capitalRestante: 0, ppc: 0, porcentaje: 0, gp: 0, balasRestantes: 0 },
    { id: 'operaciones', nombre: 'Operaciones', tipo: 'Long / Short', capital: 0, capitalRestante: 0, ppc: 0, porcentaje: 0, gp: 0, balasRestantes: 0 },
  ];

  constructor(
    private auth: Auth,
    private router: Router,
    private authService: AuthService,
    private strategyService: StrategyService
  ) {}

  async ngOnInit() {
    this.nombreUsuario = this.authService.getNombre();
    await this.loadData();
  }

  ngOnDestroy() {
    clearInterval(this.priceInterval);
  }

  async loadData() {
    for (let strategy of this.strategies) {
      const config = await this.strategyService.getStrategy(strategy.id);
      if (config) {
        strategy.capital = config.capital;
        strategy.ppc = config.ppc;
        strategy.capitalRestante = config.capital;
        strategy.balasRestantes = config.balas;
      }
    }
  }

  goToStrategy(id: string) {
    this.router.navigate(['/strategy', id]);
  }

  goToMarkets() {
    this.router.navigate(['/markets']);
  }

  async logout() {
    await signOut(this.auth);
    this.router.navigate(['/login']);
  }
}