import { Injectable } from '@angular/core';
import { Firestore, collection, doc, getDoc, setDoc, addDoc, getDocs, query, orderBy } from '@angular/fire/firestore';

export interface AvData {
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
export class AvService {

  constructor(private firestore: Firestore) {}

  async getAv(userId: string): Promise<AvData | null> {
    const ref = doc(this.firestore, `users/${userId}/av/config`);
    const snap = await getDoc(ref);
    return snap.exists() ? snap.data() as AvData : null;
  }

  async saveAv(userId: string, data: AvData): Promise<void> {
    const ref = doc(this.firestore, `users/${userId}/av/config`);
    await setDoc(ref, data);
  }

  async getBalasIngresadas(userId: string): Promise<Bala[]> {
    const ref = collection(this.firestore, `users/${userId}/av/balas/ingresadas`);
    const q = query(ref, orderBy('fecha'));
    const snap = await getDocs(q);
    return snap.docs.map(d => d.data() as Bala);
  }

  async addBalaIngresada(userId: string, bala: Bala): Promise<void> {
    const ref = collection(this.firestore, `users/${userId}/av/balas/ingresadas`);
    await addDoc(ref, bala);
  }

  async getBalasRetiradas(userId: string): Promise<BalaRetirada[]> {
    const ref = collection(this.firestore, `users/${userId}/av/balas/retiradas`);
    const q = query(ref, orderBy('fecha'));
    const snap = await getDocs(q);
    return snap.docs.map(d => d.data() as BalaRetirada);
  }

  async addBalaRetirada(userId: string, bala: BalaRetirada): Promise<void> {
    const ref = collection(this.firestore, `users/${userId}/av/balas/retiradas`);
    await addDoc(ref, bala);
  }
}
