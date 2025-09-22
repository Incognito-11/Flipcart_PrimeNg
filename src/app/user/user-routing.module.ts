import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../auth/guards/auth.guard';

import { UserDashboardComponent } from './pages/user-dashboard/user-dashboard.component';
import { UserProfileComponent } from './pages/user-profile/user-profile.component';
import { UserOrdersComponent } from './pages/user-orders/user-orders.component';
import { AddressBookComponent } from './pages/addressbook/addressbook.component';

const routes: Routes = [
  {
    path: '',
    component: UserDashboardComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'profile',
    component: UserProfileComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'orders',
    component: UserOrdersComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'addresses',
    component: AddressBookComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'products',
    loadChildren: () =>
      import('../products/products.module').then(m => m.ProductsModule),
    canActivate: [AuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule {}
