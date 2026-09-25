import { Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { UserComponent } from './user/user.component';
import { AdminComponent } from './admin/admin.component';
import { LovePosterComponent } from './love-poster/love-poster.component';
// import { DashboardComponent } from './dashboard/dashboard.component';
// import { UserComponent } from '../user/user.component';
// import { AdminComponent } from '../admin/admin.component';


export const routes: Routes = [
    { path : '' , pathMatch: 'full', component : DashboardComponent },
    { path : 'user/:id' , component : LovePosterComponent },
    { path : 'admin' , component : AdminComponent },
];
