import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { RatingPageRoutingModule } from './ratingpage-routing.module';
import { RatingpagePage } from './ratingpage.page';
import { IonicRatingComponentModule } from 'ionic-rating-component';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RatingPageRoutingModule,
    IonicRatingComponentModule
  ],
  declarations: [RatingpagePage]
})
export class RatingpagePageModule { }





