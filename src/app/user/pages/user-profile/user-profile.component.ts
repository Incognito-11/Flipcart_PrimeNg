import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/core/services/auth.service';
import { ApiService } from 'src/app/core/services/api.service';
import { ToastService } from 'src/app/core/services/toast-service';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit {
  profileForm: FormGroup;
  loading = false;
  saving = false;
  maxDate: Date;
  yearRange: string;
  genderOptions = [
    { label: 'Male', value: 'male' },
    { label: 'Female', value: 'female' },
    { label: 'Other', value: 'other' }
  ];

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private apiService: ApiService,
    private toastService: ToastService
  ) {
    this.maxDate = new Date();
    this.yearRange = '1900:' + this.maxDate.getFullYear();
    this.profileForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.pattern('^[0-9]{10}$')],
      gender: [''],
      birthDate: ['']
    });
  }

  ngOnInit(): void {
    this.loadUserProfile();
  }

  loadUserProfile(): void {
    this.loading = true;
    const userId = this.authService.currentUser?.id;

    this.apiService.get(`/users/${userId}`).subscribe({
      next: (user: any) => {
        this.profileForm.patchValue({
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          phone: user.phone,
          gender: user.gender,
          birthDate: user.birthDate ? new Date(user.birthDate) : null
        });
        this.loading = false;
      },
      error: () => {
        this.toastService.showError('Failed to load profile');
        this.loading = false;
      }
    });
  }

  saveProfile(): void {
    if (this.profileForm.invalid) {
      return;
    }

    this.saving = true;
    const userId = this.authService.currentUser?.id;
    const profileData = this.profileForm.value;

    this.apiService.put(`/users/${userId}`, profileData).subscribe({
      next: (updatedUser: any) => {
        this.authService.updateCurrentUser(updatedUser); 
        this.toastService.showSuccess('Profile updated successfully');
        this.saving = false;
      },
      error: () => {
        this.toastService.showError('Failed to update profile');
        this.saving = false;
      }
    });
  }
}
