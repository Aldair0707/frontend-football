import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.css']
})
export class LandingPageComponent {
  isLoginVisible: boolean = true;  // Muestra el formulario de login por defecto

  constructor(private router: Router) {}

  // Este método se activa cuando el login es exitoso y oculta el formulario
  hideLogin() {
    this.isLoginVisible = false;
    this.router.navigate(['/home']);  // Redirige a la página principal después del login
  }
}
