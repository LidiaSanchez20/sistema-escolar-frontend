import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarUser } from '../../partials/navbar-user/navbar-user';

@Component({
  selector: 'app-dashboard-layout',
  imports: [
    RouterOutlet,
    NavbarUser],
  templateUrl: './dashboard-layout.html',
  styleUrl: './dashboard-layout.scss',
})
export class DashboardLayout {

}
