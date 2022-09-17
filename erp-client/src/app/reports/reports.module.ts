import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReportHomeComponent } from './report-home/report-home.component';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../shared/auth.gaurd';
import { FormsModule } from '@angular/forms';
import { NbButtonModule, NbCardModule, NbInputModule, NbListModule, NbMenuModule } from '@nebular/theme';
import { MainPipe } from '../pipe.module';
import { ReportViewerComponent } from './report-viewer/report-viewer.component';
import { ReportsListComponent } from './reports-list/reports-list.component';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { CalendarModule } from 'primeng/calendar';
import { AccordionModule } from 'primeng/accordion';



const routes: Routes = [
  { path: 'ReportsList' , component: ReportsListComponent,canActivate:[AuthGuard]},
  { path: 'ReportViewer' , component: ReportViewerComponent, canActivate:[AuthGuard]},  
]

@NgModule({

  declarations: [ReportHomeComponent, ReportViewerComponent, ReportsListComponent],
  imports: [
    CommonModule,
    NbButtonModule,
    NbCardModule,
    NbListModule,
    FormsModule,
    NbMenuModule.forRoot(),
    NbInputModule,
    RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' }),
    MainPipe,
    TableModule,
    ButtonModule,
    InputTextModule,
    CalendarModule,
    AccordionModule

  ]
})
export class ReportsModule { }
