import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

// import { JobsPageRoutingModule } from './Job-routing.module';

import {JobsPage } from './job.page';
import { ComponentsModule } from 'src/app/components/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    // JobsPageRoutingModule,
    ComponentsModule
  ],
  declarations: [JobsPage]
})
export class JobsPageModule { }
