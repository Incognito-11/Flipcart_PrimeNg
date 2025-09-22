import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Address } from 'src/app/shared/models/address.model';
import { ApiService } from 'src/app/core/services/api.service';
import { ToastService } from 'src/app/core/services/toast-service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-address-book',
  templateUrl: './addressbook.component.html',
  styleUrls: ['./addressbook.component.scss'],
  providers: [MessageService]
})
export class AddressBookComponent implements OnInit {
  addresses: Address[] = [];
  addressForm!: FormGroup;
  userId = 1; // This should ideally come from AuthService or session
  submitted = false;

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private toastService: ToastService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadAddresses();
  }

  initForm(): void {
    this.addressForm = this.fb.group({
      fullName: ['', Validators.required],
      phoneNumber: ['', [Validators.required, Validators.pattern(/^[6-9]\d{9}$/)]],
      pincode: ['', [Validators.required, Validators.pattern(/^\d{6}$/)]],
      city: ['', Validators.required],
      state: ['', Validators.required],
      addressType: ['Home', Validators.required],
      isDefault: [false]
    });
  }

  loadAddresses(): void {
    this.apiService.getUserAddresses(this.userId).subscribe({
      next: (data) => {
        this.addresses = data;
      },
      error: () => {
        this.toastService.showError('Failed to load addresses.');
      }
    });
  }

  onSubmit(): void {
    this.submitted = true;
    if (this.addressForm.invalid) return;

    const newAddress: Address = {
      ...this.addressForm.value,
      userId: this.userId
    };

    this.apiService.addAddress(newAddress).subscribe({
      next: (response) => {
        this.addresses.push(response);
        this.toastService.showSuccess('Address added successfully!');
        this.messageService.add({ severity: 'success', summary: 'Address', detail: 'Saved successfully' });
        this.addressForm.reset();
        this.submitted = false;
      },
      error: () => {
        this.toastService.showError('Failed to add address.');
      }
    });
  }

  setDefaultAddress(addressId: number): void {
    this.addresses.forEach((a) => {
      a.default = a.id === addressId;
    });

    const updateRequests = this.addresses.map((a) =>
      this.apiService.updateAddress(a)
    );

    Promise.all(updateRequests.map(req => req.toPromise()))
      .then(() => {
        this.toastService.showSuccess('Default address updated!');
      })
      .catch(() => {
        this.toastService.showError('Failed to update default address!');
      });
  }

  deleteAddress(id: number): void {
    this.apiService.deleteAddress(id).subscribe({
      next: () => {
        this.addresses = this.addresses.filter((a) => a.id !== id);
        this.toastService.showSuccess('Address deleted!');
      },
      error: () => {
        this.toastService.showError('Failed to delete address!');
      }
    });
  }
}
