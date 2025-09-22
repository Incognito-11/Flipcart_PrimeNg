import { Component, OnInit } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ApiService } from 'src/app/core/services/api.service';
import { User } from 'src/app/shared/models/user.model';

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.scss'],
  providers: [ConfirmationService, MessageService],
})
export class UserManagementComponent implements OnInit {
  //Array to store user list
  users: User[] = [];
  //Flag to toggle loading spinner
  loading = false;
  //Injecting necessary services

  constructor(
    private apiService: ApiService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService // For confirmation dialogs
  ) {}
  //Lifecycle hook called on component initialization

  ngOnInit(): void {
    this.loadUsers(); //Loads all users when component loads
  }
  /**
   * Fetch users from the backend API and store in `users` array
   */
  loadUsers(): void {
    this.loading = true; //Show loading spinner
    this.apiService.get<User[]>('/users').subscribe({
      next: (users) => {
        this.users = users; //Assign fetched users
        this.loading = false; //Hide spinner
      },
      error: (error) => {
        //show error toast if fetch fails
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to load users',
        });
        this.loading = false; //Hide spinner
      },
    });
  }
  /**
   * Ask for confirmation before deleting a user
   * @param user - The user to be deleted
   */
  confirmDelete(user: User): void {
    this.confirmationService.confirm({
      message: `Are you sure you want to delete.? ${user.username}?`, //Dynamic message
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.deleteUser(user); //Proceed only if user confirms
      },
    });
  }
  /**
   * Delete user from backend and remove from local list
   * @param user The user to be deleted
   */
  deleteUser(user: User): void {
    this.apiService.delete(`/users/${user.id}`).subscribe({
      next: () => {
        //Remove the deleted user from local list
        this.users = this.users.filter((u) => u.id !== user.id);
        //Show success toast
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'User deleted successfully..',
        });
      },
      error: (error) => {
        //Show error toast if deletion fails
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Falied to delete user',
        });
      },
    });
  }
  /**
   * Return a CSS class for styling role badges in the UI
   * @param role - The user's role
   * @returns CSS class name as string
   */
  getRoleBadgeClass(role: string): string {
    switch (role) {
      case 'Admin':
        return 'badge-admin'; //apply admin badge style
      case 'Manager':
        return 'badge-manager';
      case 'Auditor':
        return 'badge-auditor';
      default:
        return 'badge-customer';
    }
  }
}
