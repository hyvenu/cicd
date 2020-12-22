import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ManageProductComponent } from './manage-product/manage-product.component';
import { ManageCategoryComponent } from './manage-category/manage-category.component';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NbThemeModule, NbLayoutModule,NbButtonModule ,NbCardModule,NbListModule,NbInputModule, NbToastrModule} from '@nebular/theme';
import { NbToastrService } from '@nebular/theme';

const routes: Routes = [
  { path: 'ManageCategory' , component: ManageCategoryComponent},
];
@NgModule({
  declarations: [ManageProductComponent, ManageCategoryComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    RouterModule.forRoot(routes),
    NbInputModule,
    NbLayoutModule,
    NbListModule,
    NbButtonModule,
    NbCardModule,
    NbToastrModule.forRoot(),

  ],
  providers:[NbToastrService],
  exports:[ ManageCategoryComponent,]
})
export class InventoryModule { }
