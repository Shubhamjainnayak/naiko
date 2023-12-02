import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';

import { UtilService } from 'src/app/services/util.service';
@Component({
  selector: 'app-sort',
  templateUrl: './sort.page.html',
  styleUrls: ['./sort.page.scss'],
})
export class SortPage implements OnInit {
  
  true_check=0;
  check: boolean;
  gender: any = 'male';
  city: any= '';
  city_list:any;
  vendor_name='';
  
  constructor(
    private modalCtrl: ModalController,
    private navParam: NavParams,
    public util: UtilService,
  ) {
   this.city_list = this.navParam.get('city_list');
   console.log(this.city_list);
  }

  ngOnInit() {
  }
  close() {
    this.modalCtrl.dismiss({
      close: false
    });
  }

  apply() {
    this.true_check=0;
    if(this.check){
      this.true_check=1;
    }
    this.modalCtrl.dismiss({
      city: this.city,
      gender: this.gender,
       true_check: this.true_check,
       vendor_name: this.vendor_name,
      close: true
    });
  }

  
}
