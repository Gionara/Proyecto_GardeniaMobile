import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../servicios/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegistroPage {
  registroForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.registroForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]], // Validación de correo
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]],
      nombre: ['', Validators.required],
      apellido: ['', Validators.required],
    });
  }

  async registrar() {
    if (this.registroForm.valid) {
      const { email, password, confirmPassword, nombre, apellido } = this.registroForm.value;
  
      // Ahora se compara correctamente con confirmPassword
      if (password === confirmPassword) {
        try {
          await this.authService.register(email, password, nombre, apellido);
          this.router.navigate(['/login']);  // Redirige al login después del registro
        } catch (error) {
          console.error('Error en el registro:', error);
        }
      } else {
        console.log('Las contraseñas no coinciden');
      }
    } else {
      console.error('Formulario inválido');
    }
  }
}
