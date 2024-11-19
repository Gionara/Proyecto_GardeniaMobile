import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class DireccionesService {
  private direcciones: any[] = [];

  getDirecciones(): Promise<any[]> {
    return Promise.resolve(this.direcciones);
  }

  addDireccion(direccion: string, lat: number, lng: number): Promise<void> {
    this.direcciones.push({ direccion, lat, lng });
    return Promise.resolve();
  }

  deleteDireccion(id: number): Promise<void> {
    this.direcciones = this.direcciones.filter((_, index) => index !== id);
    return Promise.resolve();
  }
}
