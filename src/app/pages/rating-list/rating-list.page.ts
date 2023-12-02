import { Component, OnInit } from '@angular/core';
import { NavController, ModalController } from '@ionic/angular';
import { ApiService } from 'src/app/services/api.service';
import { UtilService } from 'src/app/services/util.service';
import { ActivatedRoute } from '@angular/router';
import * as moment from 'moment';
@Component({
  selector: 'app-rating-list',
  templateUrl: './rating-list.page.html',
  styleUrls: ['./rating-list.page.scss'],
})
export class RatingListPage implements OnInit {
  name: any;
  type: any;
  id: any;
  dummy: any[] = [];
  ratings: any[] = [];
  profile_image_link;
  constructor(
    private navCtrl: NavController,
    public api: ApiService,
    public util: UtilService,
    private modalCtrl: ModalController,
    private route: ActivatedRoute
  ) {
    this.route.queryParams.subscribe((data: any) => {
      console.log(data);
      if (data && data.id) {
        this.id = data.id;
        this.name = data.name;
        this.type = data.type;
        this.getFrom();
      }
    })
  }

  getFrom() {
    // getFromIDs
    const param = {
      id: this.id
    };
    this.dummy = Array(10);
    this.ratings = [];
    this.api.post('Android/view_rating', param).subscribe((data: any) => {
      console.log(data);
      this.dummy = [];
      if (data && data.status === 200) {
        this.ratings = data.data.product;
        this.profile_image_link = data.data.image_link;
      }
    }, error => {
      console.log(error);
      this.dummy = [];
      this.util.errorToast(this.util.getString('Something went wrong'));
    });
  }

  ngOnInit() {
  }

  back() {
    this.navCtrl.back();
  }


  getDate(date) {
    return moment(date).format('ll');
  }
}
