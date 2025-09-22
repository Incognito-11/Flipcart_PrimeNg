import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { ProductCardComponent } from './components/product-card/product-card.component';
import { SearchBarComponent } from './components/searchbar/searchbar.component';
import { CategoryFilterComponent } from './components/category-filter/category-filter.component';
import { PaginationComponent } from './components/pagination/pagination.component';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { RatingModule } from 'primeng/rating';
import { ButtonModule } from 'primeng/button';

@NgModule({
  declarations: [
    ProductCardComponent,
    SearchBarComponent,
    CategoryFilterComponent,
    PaginationComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    DropdownModule,
    InputTextModule,
    RatingModule,
    ButtonModule
  ],
  exports: [
    ProductCardComponent,
    SearchBarComponent,
    CategoryFilterComponent,
    PaginationComponent,
    CommonModule,
    FormsModule,
    DropdownModule,
    InputTextModule,
    RatingModule,
    ButtonModule,
  ],
})
export class SharedModule {}
