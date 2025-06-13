import { Component } from '@angular/core';
import { UserService } from '../services/user.service';
import { Credential } from '../models/user/Credential';
import { Router } from '@angular/router';
import { StorageService } from "../services/storage.service";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  username: string = "";
  password: string = "";

  constructor(
    private userService: UserService,
    private storageService: StorageService,
    private router: Router
  ) {}

  callLogin() {
    const myCredential = new Credential();
    myCredential.username = this.username;
    myCredential.password = this.password;

    this.userService.postLogin(myCredential).subscribe({
      next: (data: any) => {
        console.log('Login exitoso:', data);

        // Guardar el token en el localStorage
        this.storageService.setSession("token", data.accessToken);
        this.storageService.setSession("user", this.username);

        // Redirigir al home
        this.router.navigate(['/home']);
      },
      error: (error) => {
        console.error('Error en login:', error);
        alert("Credenciales incorrectas o servidor no disponible.");
        this.username = "";
        this.password = "";
      }
    });
  }
}
