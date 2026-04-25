import { Routes } from '@angular/router';
import { Login } from './pages/login/login';
import { Dashboard } from './pages/dashboard/dashboard';
import { StrategyDetail } from './pages/strategy-detail/strategy-detail';
import { Markets } from './pages/markets/markets';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: Login },
  { path: 'dashboard', component: Dashboard },
  { path: 'strategy/:id', component: StrategyDetail },
  { path: 'markets', component: Markets },
];