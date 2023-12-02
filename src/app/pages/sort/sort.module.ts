import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import { BrowserModule } from '@angular/platform-browser';
import { SortPageRoutingModule } from './sort-routing.module';

import { SortPage } from './sort.page';

@NgModule({
  imports: [
    CommonModule,
    BrowserModule,
    FormsModule,
    IonicModule,
    SortPageRoutingModule
  ],
  declarations: [SortPage]
})
export class SortPageModule {}
