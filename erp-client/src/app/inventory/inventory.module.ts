import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ManageProductComponent } from './manage-product/manage-product.component';
import { ManageCategoryComponent } from './manage-category/manage-category.component';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NbThemeModule, NbLayoutModule,NbButtonModule ,NbCardModule,NbListModule,NbInputModule, NbToastrModule, NbDialogModule, NbDialogService} from '@nebular/theme';
import { NbToastrService } from '@nebular/theme';
import { ManageSubcategoryComponent } from './manage-subcategory/manage-subcategory.component';
import { ManageUnitmasterComponent } from './manage-unitmaster/manage-unitmaster.component';
import { ManageStockComponent } from './manage-stock/manage-stock.component';

const routes: Routes = [
  { path: 'ManageCategory' , component: ManageCategoryComponent},
  { path: 'ManageSubCategory' , component: ManageSubcategoryComponent},
];
@NgModule({
  declarations: [ManageProductComponent, ManageCategoryComponent, ManageSubcategoryComponent, ManageUnitmasterComponent, ManageStockComponent],
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
    NbDialogModule.forRoot(),

  ],
  providers:[NbToastrService, NbDialogService],
  exports:[ ManageCategoryComponent,]
})
export class InventoryModule { }
