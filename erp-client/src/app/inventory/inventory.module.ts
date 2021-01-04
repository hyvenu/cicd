import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ManageProductComponent } from './manage-product/manage-product.component';
import { ManageCategoryComponent } from './manage-category/manage-category.component';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NbThemeModule, NbLayoutModule,NbButtonModule ,NbCardModule,NbListModule,NbInputModule, NbToastrModule, NbDialogModule, NbDialogService, NbUserModule, NbTabsetModule, NbSelectModule} from '@nebular/theme';
import { NbToastrService } from '@nebular/theme';
import { ManageSubcategoryComponent } from './manage-subcategory/manage-subcategory.component';
import { ManageUnitmasterComponent } from './manage-unitmaster/manage-unitmaster.component';
import { ManageStockComponent } from './manage-stock/manage-stock.component';
import { AuthGuard } from '../shared/auth.gaurd';
import { ManageBrandComponent } from './manage-brand/manage-brand.component';
import { ProductListComponent } from './product-list/product-list.component';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { ImageUploadModule } from 'angular2-image-upload';

const routes: Routes = [
  { path: 'ManageCategory' , component: ManageCategoryComponent,canActivate:[AuthGuard]},
  { path: 'ManageSubCategory' , component: ManageSubcategoryComponent,canActivate:[AuthGuard]},
  { path: 'ManageUnitMaster' , component: ManageUnitmasterComponent,canActivate:[AuthGuard]},
  { path: 'ManageBrandMaster' , component: ManageBrandComponent,canActivate:[AuthGuard]},
  { path: 'ManageProductMaster' , component: ProductListComponent,canActivate:[AuthGuard]},
  { path: 'ManageProduct' , component: ManageProductComponent,canActivate:[AuthGuard]},
];
@NgModule({
  declarations: [ManageProductComponent, ManageCategoryComponent, ManageSubcategoryComponent, ManageUnitmasterComponent, ManageStockComponent, ManageBrandComponent, ProductListComponent],
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
    NbUserModule,
    NbTabsetModule,
    Ng2SmartTableModule,
    NbSelectModule,
    ImageUploadModule.forRoot(),

  ],
  providers:[NbToastrService, NbDialogService],
  exports:[ ManageCategoryComponent,ProductListComponent]
})
export class InventoryModule { }
