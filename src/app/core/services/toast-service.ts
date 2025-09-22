import { Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  //Injecting PrimeNg's MessageService to use its toast functionalities
  constructor(private messageService: MessageService) {}
  /**
   * Display a success toast notificaton
   * @param message - The message to display in toast
   */
  showSuccess(message: string): void {
    this.messageService.add({
      severity: 'success',
      summary: 'Success',
      detail: message,
    });
  }
  /**
   * Display Error Toast notification
   * @param message - The message to display in the toast
   */
  showError(message: string): void {
    this.messageService.add({
      severity: 'error',
      summary: 'Error',
      detail: message,
    });
  }
  /**
   * Display an informational toast notification
   * @param message - The message to display in the toast
   */
  showInfo(message: string): void {
    this.messageService.add({
      severity: 'info',
      summary: 'Info',
      detail: message,
    });
  }
  // Display a Warning toast notification
  showWarn(message: string): void {
    this.messageService.add({
      severity: 'warn',
      summary: 'Warning',
      detail: message,
    });
  }
}
