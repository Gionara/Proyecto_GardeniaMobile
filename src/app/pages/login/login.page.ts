import { Component } from '@angular/core';
import { AuthService } from '../../servicios/auth.service';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage {
  usuario_login: string = '';
  password_login: string = '';
  error_message: string | null = null;

  constructor(private authService: AuthService, private navCtrl: NavController) {}

  async iniciarSeccion() {
    try {
      await this.authService.login(this.usuario_login, this.password_login);
      this.error_message = null;
      this.navCtrl.navigateForward('/home');  // Redirige al usuario a la página principal
    } catch (error) {
      this.error_message = "Credenciales incorrectas. Por favor, intenta de nuevo.";
      console.error("Error en el inicio de sesión:", error);
    }
  }
}
