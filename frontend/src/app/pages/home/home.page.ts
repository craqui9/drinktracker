import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {
  AlertController,
  LoadingController,
  ToastController,
  RefresherCustomEvent,
} from '@ionic/angular';
import { forkJoin } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { DrinkService, DrinkCounts, Totals } from '../../services/drink.service';

export type DrinkType = 'cerveza' | 'copa' | 'chupito';

interface DrinkCard {
  type: DrinkType;
  label: string;
  emoji: string;
  color: string;
}

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  readonly drinks: DrinkCard[] = [
    { type: 'cerveza', label: 'Cerveza', emoji: '🍺', color: '#e8a838' },
    { type: 'copa',    label: 'Copa',    emoji: '🍷', color: '#c0392b' },
    { type: 'chupito', label: 'Chupito', emoji: '🥃', color: '#8e44ad' },
  ];

  myDrinks: DrinkCounts = { cerveza: 0, copa: 0, chupito: 0 };
  totals: Totals = { cerveza: 0, copa: 0, chupito: 0, totalUsuarios: 0 };
  loading = true;
  activeTab: 'mine' | 'global' = 'mine';

  constructor(
    public authService: AuthService,
    private drinkService: DrinkService,
    private router: Router,
    private alertCtrl: AlertController,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData(event?: RefresherCustomEvent): void {
    forkJoin({
      my: this.drinkService.getMyDrinks(),
      totals: this.drinkService.getTotals(),
    }).subscribe({
      next: ({ my, totals }) => {
        this.myDrinks = my;
        this.totals = totals;
        this.loading = false;
        event?.detail.complete();
      },
      error: () => {
        this.loading = false;
        event?.detail.complete();
        this.showToast('Error al cargar los datos', 'danger');
      },
    });
  }

  async addOneDrink(type: DrinkType): Promise<void> {
    const payload: Partial<DrinkCounts> = { [type]: 1 };

    this.drinkService.addDrinks(payload).subscribe({
      next: (updated) => {
        this.myDrinks = updated;
        // Also refresh totals after adding
        this.drinkService.getTotals().subscribe((t) => (this.totals = t));
        this.showToast(this.getDrinkCard(type)?.emoji + ' +1 añadido!', 'success');
      },
      error: () => this.showToast('Error al añadir bebida', 'danger'),
    });
  }

  async confirmReset(): Promise<void> {
    const alert = await this.alertCtrl.create({
      header: '¿Resetear contadores?',
      message: 'Esto pondrá todos tus contadores a 0. ¿Estás seguro?',
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Sí, resetear',
          role: 'destructive',
          handler: () => this.resetDrinks(),
        },
      ],
    });
    alert.present();
  }

  private resetDrinks(): void {
    this.drinkService.resetMyDrinks().subscribe({
      next: (updated) => {
        this.myDrinks = updated;
        this.drinkService.getTotals().subscribe((t) => (this.totals = t));
        this.showToast('Contadores reseteados', 'medium');
      },
      error: () => this.showToast('Error al resetear', 'danger'),
    });
  }

  async logout(): Promise<void> {
    const alert = await this.alertCtrl.create({
      header: 'Cerrar sesión',
      message: '¿Seguro que quieres salir?',
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Salir',
          handler: () => {
            this.authService.logout();
            this.router.navigate(['/login'], { replaceUrl: true });
          },
        },
      ],
    });
    alert.present();
  }

  getDrinkCard(type: DrinkType): DrinkCard | undefined {
    return this.drinks.find((d) => d.type === type);
  }

  get totalMyDrinks(): number {
    return this.myDrinks.cerveza + this.myDrinks.copa + this.myDrinks.chupito;
  }

  get totalAllDrinks(): number {
    return this.totals.cerveza + this.totals.copa + this.totals.chupito;
  }

  private async showToast(message: string, color: string): Promise<void> {
    const toast = await this.toastCtrl.create({
      message,
      duration: 2000,
      color,
      position: 'top',
    });
    toast.present();
  }
}
