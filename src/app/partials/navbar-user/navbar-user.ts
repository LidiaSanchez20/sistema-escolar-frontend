import { Component, EventEmitter, HostListener, inject, OnInit, Output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../services/auth-service';

@Component({
  selector: 'app-navbar-user',
  imports: [MatIconModule],
  templateUrl: './navbar-user.html',
  styleUrl: './navbar-user.scss',
})
export class NavbarUser implements OnInit {
  @Output() sidebarToggle = new EventEmitter<void>();

  public userInitial = '';
  public isMobileView = false;

  paletteMode: 'light' | 'dark' = 'light';

  colorPalettes = {
    light: {
      '--background-main': '#f4f7fb',
      '--sidebar-bg': '#23395d',
      '--navbar-bg': '#fff',
      '--text-main': '#222',
      '--table-bg': '#fff',
      '--table-header-bg': '#cfe2ff',
    },
    dark: {
      '--background-main': '#181a1b',
      '--sidebar-bg': '#1a2636',
      '--navbar-bg': '#222',
      '--text-main': '#e4ecfa',
      '--table-bg': '#222',
      '--table-header-bg': '#30507a',
    }
  };

  private readonly authService = inject(AuthService);

  constructor() {
    const name = this.authService.getUserCompleteName();
    this.userInitial = name?.trim()?.[0]?.toUpperCase() || '?';
  }

  ngOnInit() {
    this.isMobileView = window.innerWidth <= 992;

    // Recuperar preferencia guardada o usar light por defecto
    const savedTheme = localStorage.getItem('theme-preference') as 'light' | 'dark';
    this.paletteMode = savedTheme || 'light';
    this.applyPalette(this.paletteMode);

  }

  @HostListener('window:resize')
  onResize(): void {
    this.isMobileView = window.innerWidth <= 992;
  }

  togglePalette(): void {
    this.paletteMode = this.paletteMode === 'light' ? 'dark' : 'light';

    // Guardar en localStorage para que persista al iniciar sesión o recargar
    localStorage.setItem('theme-preference', this.paletteMode);
    this.applyPalette(this.paletteMode);
  }

  private applyPalette(mode: 'light' | 'dark'): void {
    const palette = this.colorPalettes[mode];
    Object.keys(palette).forEach((key) => {
      document.documentElement.style.setProperty(
        key,
        palette[key as keyof typeof palette]
      );
    });
    // Opcional: actualiza el atributo para selectores CSS [data-theme="dark"]
    document.documentElement.setAttribute('data-theme', mode);
  }

  requestSidebarToggle(): void {
    this.sidebarToggle.emit();
  }
}
