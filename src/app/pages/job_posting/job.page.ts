import { Component, OnInit } from '@angular/core';
import { UtilService } from '../../services/util.service';
import { Router, NavigationExtras } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';

import { PopoverController,AlertController } from '@ionic/angular';
@Component({
  selector: 'app-Job',
  templateUrl: './Job.page.html',
  styleUrls: ['./Job.page.scss'],
})
export class JobsPage implements OnInit {

  dummy: any[] = [];
  orders: any[] = [];
  image_link:any='';
  constructor(
    public util: UtilService,
    private router: Router,
    public api: ApiService, private popoverController:PopoverController,) {

  }

  ionViewWillEnter() {
    this.getOrders('', false);
  }
  getOrders(event, haveRefresh) {
    this.dummy = Array(15);
    this.orders = [];
    const param = {
      u_id: localStorage.getItem('uid')
    }
    this.api.post('Android/view_job_posting', param).subscribe((data: any) => {
      this.dummy = [];
      if (data && data.status === 200) {
        this.orders = data.data.product;
         this.image_link = data.data.image_link;
        if (haveRefresh) {
          event.target.complete();
        }
        console.log('orderss==>?', this.orders);
      }
    }, error => {
      console.log(error);
      this.dummy = [];
      this.orders = [];
      this.util.errorToast(this.util.getString('Something went wrong'));
    });
  }

  ngOnInit() {
  }

  openMenu() {
    this.util.openMenu();
  }
 
  
  doRefresh(event) {
    console.log(event);
    this.getOrders(event, true);
  }

}
