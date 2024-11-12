import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  constructor(private http: HttpClient) {}

  // Método para cargar los datos desde el archivo JSON
  getData(): Observable<any> {
    return this.http.get('assets/productos.json');
  }
}
