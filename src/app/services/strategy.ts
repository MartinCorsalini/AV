import { Injectable } from '@angular/core';
import { Firestore, collection, doc, getDoc, setDoc, addDoc, getDocs, query, orderBy } from '@angular/fire/firestore';

export interface StrategyData {
  capital: number;
  balas: number;
  palanca: number;
  ppc: number;
}

export interface Bala {
  hora: string;
  fecha: string;
  balas: number;
  usdt: number;
  precioCompra: number;
}

export interface BalaRetirada {
  hora: string;
  fecha: string;
  balas: number;
  usdt: number;
  precioVenta: number;
}

@Injectable({ providedIn: 'root' })
export class StrategyService {

  constructor(private firestore: Firestore) {}

  async getStrategy(userId: string): Promise<StrategyData | null> {
    const ref = doc(this.firestore, `users/${userId}/strategy/config`);
    const snap = await getDoc(ref);
    return snap.exists() ? snap.data() as StrategyData : null;
  }

  async saveStrategy(userId: string, data: StrategyData): Promise<void> {
    const ref = doc(this.firestore, `users/${userId}/strategy/config`);
    await setDoc(ref, data);
  }

  async getBalasIngresadas(userId: string): Promise<Bala[]> {
    const ref = collection(this.firestore, `users/${userId}/strategy/balas/ingresadas`);
    const q = query(ref, orderBy('fecha'));
    const snap = await getDocs(q);
    return snap.docs.map(d => d.data() as Bala);
  }

  async addBalaIngresada(userId: string, bala: Bala): Promise<void> {
    const ref = collection(this.firestore, `users/${userId}/strategy/balas/ingresadas`);
    await addDoc(ref, bala);
  }

  async getBalasRetiradas(userId: string): Promise<BalaRetirada[]> {
    const ref = collection(this.firestore, `users/${userId}/strategy/balas/retiradas`);
    const q = query(ref, orderBy('fecha'));
    const snap = await getDocs(q);
    return snap.docs.map(d => d.data() as BalaRetirada);
  }

  async addBalaRetirada(userId: string, bala: BalaRetirada): Promise<void> {
    const ref = collection(this.firestore, `users/${userId}/strategy/balas/retiradas`);
    await addDoc(ref, bala);
  }
}