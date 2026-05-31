import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';  // ← añade esta línea
import { RouterModule, Routes } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { HomePage } from './home.page';

const routes: Routes = [{ path: '', component: HomePage }];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,      // ← y aquí
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [HomePage],
})
export class HomePageModule {}