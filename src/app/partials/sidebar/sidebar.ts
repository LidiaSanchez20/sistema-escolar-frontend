import { isPlatformBrowser, NgClass } from '@angular/common';
import { Component, HostListener, inject, OnInit, PLATFORM_ID } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../services/auth-service';

@Component({
  selector: 'app-sidebar',
  imports: [MatIconModule, NgClass, RouterLink, RouterLinkActive],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.scss',
})
export class SidebarComponent implements OnInit {
  public mobileOpen = false;
  public isMobileView = false;

  private readonly platformId = inject(PLATFORM_ID);
  private readonly router = inject(Router);
  private readonly authService = inject(AuthService);

  ngOnInit(): void {
    this.updateViewMode();
  }

  @HostListener('window:resize')
  onResize(): void {
    this.updateViewMode();
  }

  // Lo llama el navbar cuando el usuario pulsa el botón del menú móvil.
  toggleSidebar(): void {
    this.mobileOpen = !this.mobileOpen;
  }

  closeSidebar(): void {
    this.mobileOpen = false;
  }

  logout(): void {
    this.authService.logout().subscribe({
      next: () => this.endSession(),
      error: () => this.endSession()
    });
  }

  canSeeAdminItems(): boolean {
    return this.authService.canSeeAdminItems();
  }

  canSeeTeacherItems(): boolean {
    return this.authService.canSeeTeacherItems();
  }

  canSeeStudentItems(): boolean {
    return this.authService.canSeeStudentItems();
  }

  canSeeHomeItem(): boolean {
    return this.authService.canSeeHomeItem();
  }

  canSeeRegisterItem(): boolean {
    return this.authService.canSeeRegisterItem();
  }

  private updateViewMode(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    this.isMobileView = window.innerWidth <= 992;

    if (!this.isMobileView) {
      this.mobileOpen = false;
    }
  }

  private endSession(): void {
    this.authService.destroyUser();
    this.closeSidebar();
    this.router.navigate(['/login']);
  }
}
