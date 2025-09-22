import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MessageService } from 'primeng/api';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  providers: [MessageService],
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  loading = false;
  returnUrl = '/';

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private message: MessageService
  ) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.message.add({
        severity: 'warn',
        summary: 'Validation',
        detail: 'Please enter both username and password.',
      });
      return;
    }

    this.loading = true;
    const { username, password } = this.loginForm.value;

    this.auth.login(username, password).subscribe({
      next: (user) => {
        this.message.add({
          severity: 'success',
          summary: 'Success',
          detail: `Welcome, ${user.username}`,
        });
        const role = user.role;
        if (role === 'Admin') this.router.navigate(['/admin']);
        else if (role === 'Manager') this.router.navigate(['/manager']);
        else if (role === 'Customer') this.router.navigate(['/user']);
        else if (role === 'Auditor') this.router.navigate(['/auditor']);
        else this.router.navigate([this.returnUrl]);
      },
      error: (err) => {
        this.message.add({
          severity: 'error',
          summary: 'Login Failed',
          detail: err.message,
        });
      },
      complete: () => (this.loading = false),
    });
  }
}
