import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReportHomeComponent } from './report-home/report-home.component';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../shared/auth.gaurd';
import { FormsModule } from '@angular/forms';
import { NbButtonModule, NbCardModule, NbListModule, NbMenuModule } from '@nebular/theme';




const routes: Routes = [
  { path: 'ReportsList' , component: ReportHomeComponent,canActivate:[AuthGuard]},
]

@NgModule({

  declarations: [ReportHomeComponent],
  imports: [
    CommonModule,
    NbButtonModule,
    NbCardModule,
    NbListModule,
    FormsModule,
    NbMenuModule.forRoot(),
    RouterModule.forRoot(routes),

  ]
})
export class ReportsModule { }
