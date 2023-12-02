import { Component, OnInit } from '@angular/core';
import { UtilService } from '../../services/util.service';
import { Router, NavigationExtras } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';

import { PopoverController,AlertController } from '@ionic/angular';
import { RatingpagePage } from '../ratingpage/ratingpage.page';
import { CallNumber } from '@ionic-native/call-number/ngx';
@Component({
  selector: 'app-orders',
  templateUrl: './orders.page.html',
  styleUrls: ['./orders.page.scss'],
})
export class OrdersPage implements OnInit {

  dummy: any[] = [];
  orders: any[] = [];
  image_link:any='';
  constructor(
    public util: UtilService,
    private router: Router,
    public api: ApiService, private popoverController:PopoverController,private callNumber:CallNumber) {

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
    this.api.post('Android/geallhistory', param).subscribe((data: any) => {
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
  async ratingpage(oh_id,user_name,user_moblie_no,user_address,user_status,booking_time)
  { 
    
    console.log(user_name);
    console.log(user_moblie_no);
    console.log(user_address);
    console.log(booking_time);
    console.log(oh_id);
    
    if(user_status=='2'){
    const modal = await this.popoverController.create({
      component: RatingpagePage,
      showBackdrop:true, 
      componentProps: {
        'oh_id': oh_id,
        'user_name': user_name,
        'user_moblie_no': user_moblie_no,
        'user_address': user_address,
        'booking_time': booking_time,
        
      }
    });

    modal.onDidDismiss().then((dataReturned) => {
      if (dataReturned.data == "cancel") {
       
      }

    });
    return await modal.present();
  }
    
  }
  
  doRefresh(event) {
    console.log(event);
    this.getOrders(event, true);
  }
  call_now(moblie_no)
  {
    this.callNumber.callNumber(moblie_no, true)
    .then(res => console.log('Launched dialer!', res))
    .catch(err => console.log('Error launching dialer', err));
  }

}
