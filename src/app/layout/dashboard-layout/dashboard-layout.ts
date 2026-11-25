import { Component } from '@angular/core';
import { NavbarUser } from '../../partials/navbar-user/navbar-user';
import { SidebarComponent } from '../../partials/sidebar/sidebar';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-dashboard-layout',
  imports: [
    NavbarUser,
    SidebarComponent,
    RouterOutlet
  ],
  templateUrl: './dashboard-layout.html',
  styleUrl: './dashboard-layout.scss',
})
export class DashboardLayout {

}
