
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RatingpagePage } from './ratingpage.page';
const routes: Routes = [
  {
    path: '',
    component: RatingpagePage
  }
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RatingPageRoutingModule { }
