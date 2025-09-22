import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { ProductsRoutingModule } from './products-routing.module';
import { SharedModule } from '../shared/shared.module';

//PrimeNg Modules
import { DataViewModule } from 'primeng/dataview';
import { RatingModule } from 'primeng/rating';
import { PanelModule } from 'primeng/panel';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { PaginatorModule } from 'primeng/paginator';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { BadgeModule } from 'primeng/badge';
// up to this one
import { ProductListComponent } from './pages/products-list/product-list.component';
import { ProductsDetailsComponent } from './pages/products-details/products-details.component';

@NgModule({
  declarations: [ProductListComponent, ProductsDetailsComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    ProductsRoutingModule,
    SharedModule,
    DataViewModule,
    RatingModule,
    PanelModule,
    DropdownModule,
    InputTextModule,
    ButtonModule,
    PaginatorModule,
    ProgressSpinnerModule,
    BadgeModule,
  ],
})
export class ProductsModule {}
