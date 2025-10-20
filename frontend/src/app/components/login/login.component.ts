import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm = {
    username: '',
    password: ''
  };

  loading = false;
  error = '';
  returnUrl = '';

  constructor(
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    // Redirect to home if already logged in
    if (this.authService.currentUserValue) {
      this.router.navigate(['/']);
    }
  }

  ngOnInit(): void {
    // Get return url from route parameters or default to '/'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/dashboard';
  }

  onSubmit(): void {
    this.error = '';

    // Validate
    if (!this.loginForm.username || !this.loginForm.password) {
      this.error = 'Please enter username and password';
      return;
    }

    this.loading = true;

    this.authService.login(this.loginForm.username, this.loginForm.password)
      .subscribe({
        next: (response) => {
          if (response.success) {
            // Login successful, redirect to return url
            this.router.navigate([this.returnUrl]);
          }
        },
        error: (err) => {
          this.error = err.error?.message || 'Login failed. Please try again.';
          this.loading = false;
        }
      });
  }
}
