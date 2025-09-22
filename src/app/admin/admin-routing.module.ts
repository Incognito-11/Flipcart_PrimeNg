import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RoleGuard } from '../auth/guards/role.guard';

import { AdminDashboardComponent } from './pages/admin-dashboard/admin-dashboard.component';
import { ProductManagementComponent } from './pages/product-management/product-management.component';
import { UserManagementComponent } from './pages/user-management/user-management.component';
import { OrderManagementComponent } from './pages/order-management/order-management.component';

const routes: Routes = [
  {
    path: '',
    component: AdminDashboardComponent,
    canActivate: [RoleGuard],
    data: { roles: ['Admin', 'Manager'] },
  },
  {
    path: 'products',
    component: ProductManagementComponent,
    canActivate: [RoleGuard],
    data: { roles: ['Admin', 'Manager'] },
  },
  {
    path: 'users',
    component: UserManagementComponent,
    canActivate: [RoleGuard],
    data: { roles: ['Admin'] },
  },
  {
    path: 'orders',
    component: OrderManagementComponent,
    canActivate: [RoleGuard],
    data: { roles: ['Admin', 'Manager', 'Auditor'] },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminRoutingModule {}
