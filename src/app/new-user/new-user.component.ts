import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';  // Importa el servicio
import { first } from 'rxjs';

@Component({
  selector: 'app-new-user',
  templateUrl: './new-user.component.html',
  styleUrls: ['./new-user.component.css']
})
export class NewUserComponent implements OnInit {
  newUserForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,  
    private router: Router
  ) {}

  ngOnInit(): void {
     
    this.newUserForm = this.fb.group({
      username: ['', [Validators.required, Validators.maxLength(20)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

 
  onSubmit(): void {
    if (this.newUserForm.invalid) {
      return;
    }

    const userData = this.newUserForm.value;

    this.userService.registerUser(userData).pipe(first()).subscribe({
      next: (data) => {
         this.router.navigate(['/login']);
      },
      error: (error) => {
        console.error('Error al registrar usuario', error);
      }
    });
  }
}
