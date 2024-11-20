import { Component, ElementRef, NgZone, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireAuth } from '@angular/fire/compat/auth'; // Importa AngularFireAuth

declare var google: any;

export interface Direccion {
  id?: string;
  alias: string;
  direccion: string;
  nombreContacto: string;
  telefono: string;
  lat: number;
  lng: number;
}

@Component({
  selector: 'app-direcciones',
  templateUrl: './direcciones.page.html',
  styleUrls: ['./direcciones.page.scss'],
})
export class DireccionesPage implements OnInit, AfterViewInit {
  center: google.maps.LatLngLiteral = { lat: -33.4489, lng: -70.6693 };
  options: google.maps.MapOptions = { zoom: 12, disableDefaultUI: true };
  markers: google.maps.Marker[] = [];
  direcciones: Direccion[] = [];
  direccion = ''; 
  geodireccion = ''; 
  alias = ''; 
  nombreContacto = ''; 
  telefono = ''; 
  lat = 0;
  lng = 0;

  @ViewChild('autocomplete', { static: false }) autocompleteInput!: ElementRef;
  map: google.maps.Map | undefined;

  constructor(
    private ngZone: NgZone,
    private firestore: AngularFirestore,
    private afAuth: AngularFireAuth // Inyecta AngularFireAuth
  ) {}
  
  uid: string | null = null; // Variable para almacenar el uid del usuario
  
  ngOnInit() {
    this.afAuth.authState.subscribe((user) => {
      if (user) {
        this.uid = user.uid; // Obtén el uid del usuario
        this.obtenerDirecciones(); // Carga las direcciones relacionadas al usuario
      } else {
        this.uid = null;
      }
    });
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.initAutocomplete();
      this.initMap();
    }, 1000);
  }

  initAutocomplete() {
    const input = document.getElementById('autocomplete') as HTMLInputElement;
    const autocomplete = new google.maps.places.Autocomplete(input);

    autocomplete.addListener('place_changed', () => {
      const place = autocomplete.getPlace();
      if (place.geometry && place.formatted_address) {
        this.direccion = place.formatted_address;
        this.lat = place.geometry.location.lat();
        this.lng = place.geometry.location.lng();
        this.placeMarker(this.lat, this.lng, this.direccion);
      }
    });
  }

  initMap() {
    this.map = new google.maps.Map(document.getElementById('map') as HTMLElement, {
      center: this.center,
      zoom: 12,
      disableDefaultUI: true,
    });
  }

  placeMarker(lat: number, lng: number, direccion: string) {
    if (this.map) {
      const position = { lat, lng };
      this.markers.forEach((m) => m.setMap(null));
      this.markers = [];
      const marker = new google.maps.Marker({ position, map: this.map });
      this.markers.push(marker);
      this.map.setCenter(position);
      this.geodireccion = `Lat: ${lat}, Lng: ${lng}`;
      this.direccion = direccion;
    }
  }

  agregarDireccion() {
    if (this.uid && this.direccion && this.alias && this.nombreContacto && this.telefono) {
      const nuevaDireccion: Direccion = {
        direccion: this.direccion,
        alias: this.alias,
        nombreContacto: this.nombreContacto,
        telefono: this.telefono,
        lat: this.lat,
        lng: this.lng,
      };
      this.firestore
        .collection('direcciones')
        .add({ ...nuevaDireccion, uid: this.uid }) // Agrega el uid del usuario
        .then(() => {
          this.obtenerDirecciones();
        });
      this.direccion = '';
      this.alias = '';
      this.nombreContacto = '';
      this.telefono = '';
    }
  }

  obtenerDirecciones() {
    if (this.uid) {
      this.firestore
        .collection('direcciones', (ref) => ref.where('uid', '==', this.uid)) // Filtra por uid
        .snapshotChanges()
        .subscribe((data) => {
          this.direcciones = data.map((e) => {
            const docData = e.payload.doc.data() as Direccion;
            return {
              id: e.payload.doc.id,
              alias: docData.alias || 'Sin alias',
              direccion: docData.direccion || 'Sin dirección',
              nombreContacto: docData.nombreContacto || 'Sin contacto',
              telefono: docData.telefono || 'Sin teléfono',
              lat: docData.lat || 0,
              lng: docData.lng || 0,
            };
          });
        });
    }
  }

  eliminarDireccion(id: string) {
    if (id && this.uid) {
      this.firestore
        .collection('direcciones')
        .doc(id)
        .ref.get()
        .then((doc) => {
          if (doc.exists) {
            const direccionData = doc.data() as Direccion & { uid: string }; // Especifica el tipo
            if (direccionData.uid === this.uid) {
              // Verifica que la dirección pertenece al usuario
              doc.ref.delete().then(() => {
                this.obtenerDirecciones();
              });
            }
          }
        });
    }
  }
}
