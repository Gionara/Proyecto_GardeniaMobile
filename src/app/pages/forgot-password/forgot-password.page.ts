import { Component } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth'; // Importa AngularFireAuth
import { ToastController } from '@ionic/angular'; // Para mostrar notificaciones

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.page.html',
  styleUrls: ['./forgot-password.page.scss'],
})
export class ForgotPasswordPage {
  email: string = ''; // Variable para almacenar el correo electrónico

  constructor(
    private afAuth: AngularFireAuth, // Inyecta AngularFireAuth
    private toastController: ToastController // Para mostrar toasts
  ) {}

  // Método para enviar el correo de recuperación
  async sendPasswordReset() {
    if (!this.email) {
      this.presentToast('Por favor, ingresa tu correo electrónico.', 'danger');
      return;
    }

    try {
      await this.afAuth.sendPasswordResetEmail(this.email); // Enviar correo de recuperación
      this.presentToast(
        'Se ha enviado un enlace de recuperación a tu correo electrónico.',
        'success'
      );
    } catch (error) {
      console.error('Error al enviar el correo de recuperación:', error);
      this.presentToast(
        'No se pudo enviar el correo de recuperación. Verifica tu dirección de correo.',
        'danger'
      );
    }
  }

  // Método para mostrar un toast
  async presentToast(message: string, color: string) {
    const toast = await this.toastController.create({
      message,
      duration: 3000,
      color,
      position: 'top',
    });
    await toast.present();
  }
}
