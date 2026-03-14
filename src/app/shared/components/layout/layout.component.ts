import { Component, signal, computed } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatMenuModule } from '@angular/material/menu';
import { AuthService } from '../../../services/auth.service';

@Component({
    selector: 'app-layout',
    standalone: true,
    imports: [
        CommonModule,
        RouterOutlet,
        RouterLink,
        RouterLinkActive,
        MatIconModule,
        MatButtonModule,
        MatTooltipModule,
        MatMenuModule,
    ],
    templateUrl: './layout.component.html',
    styleUrls: ['./layout.component.scss'],
})
export class LayoutComponent {
    sidebarCollapsed = signal(false);

    constructor(public authService: AuthService) { }

    toggleSidebar() {
        this.sidebarCollapsed.update(v => !v);
    }

    logout() {
        this.authService.logout();
    }

    get userInitials(): string {
        const name = this.authService.user()?.name ?? '';
        return name
            .split(' ')
            .map(n => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    }
}
