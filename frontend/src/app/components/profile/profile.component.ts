import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  user: any = {
    id: null,
    username: '',
    email: '',
    full_name: '',
    phone: '',
    role: ''
  };

  profileForm: any = {
    username: '',
    email: '',
    full_name: '',
    phone: ''
  };

  passwordForm = {
    current_password: '',
    new_password: '',
    confirm_password: ''
  };

  loading = true;
  error = '';
  successMessage = '';
  showPasswordModal = false;

  constructor(private apiService: ApiService) { }

  ngOnInit(): void {
    this.loadUserProfile();
  }

  loadUserProfile(): void {
    this.loading = true;
    // Assuming you have a getUserProfile endpoint
    this.apiService.getUserProfile().subscribe({
      next: (response) => {
        if (response.success) {
          this.user = response.data;
          this.profileForm = {
            username: this.user.username,
            email: this.user.email,
            full_name: this.user.full_name,
            phone: this.user.phone
          };
        }
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load profile';
        this.loading = false;
      }
    });
  }

  updateProfile(): void {
    this.error = '';
    this.successMessage = '';

    if (!this.profileForm.username || !this.profileForm.email) {
      this.error = 'Username and email are required';
      return;
    }

    this.apiService.updateUserProfile(this.profileForm).subscribe({
      next: (response) => {
        if (response.success) {
          this.successMessage = 'Profile updated successfully';
          this.loadUserProfile();
          setTimeout(() => this.successMessage = '', 3000);
        }
      },
      error: (err) => {
        this.error = err.error?.message || 'Failed to update profile';
      }
    });
  }

  openPasswordModal(): void {
    this.showPasswordModal = true;
    this.passwordForm = {
      current_password: '',
      new_password: '',
      confirm_password: ''
    };
  }

  closePasswordModal(): void {
    this.showPasswordModal = false;
    this.passwordForm = {
      current_password: '',
      new_password: '',
      confirm_password: ''
    };
  }

  changePassword(): void {
    this.error = '';
    this.successMessage = '';

    if (!this.passwordForm.current_password || !this.passwordForm.new_password || !this.passwordForm.confirm_password) {
      this.error = 'All password fields are required';
      return;
    }

    if (this.passwordForm.new_password !== this.passwordForm.confirm_password) {
      this.error = 'New passwords do not match';
      return;
    }

    if (this.passwordForm.new_password.length < 6) {
      this.error = 'New password must be at least 6 characters';
      return;
    }

    this.apiService.changePassword(this.passwordForm).subscribe({
      next: (response) => {
        if (response.success) {
          this.successMessage = 'Password changed successfully';
          this.closePasswordModal();
          setTimeout(() => this.successMessage = '', 3000);
        }
      },
      error: (err) => {
        this.error = err.error?.message || 'Failed to change password';
      }
    });
  }
}
