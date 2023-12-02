import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { UtilService } from 'src/app/services/util.service';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { NavController, ModalController, AlertController } from '@ionic/angular';
import { ViewerModalComponent } from 'ngx-ionic-image-viewer';

@Component({
  selector: 'app-product',
  templateUrl: './product.page.html',
  styleUrls: ['./product.page.scss'],
})
export class ProductPage implements OnInit {

  loaded: boolean;

  name: any = '';
  staff_select;
  image_staff: any = '';
  service_select;
  images_all;
  id: any;
  check_vip = "0"
  timining: any;
  gallery: any[] = [];
  prefix: any = '';
  check: any;
  staff: any;
  service: any;
  address: any;
  product_details: any;
  slideOpts = {
    slidesPerView: 1,
  };

  slideOpts1 = {
    slidesPerView: 2.5,
  };
  gender: any = "male";
  variant: any;
  constructor(
    public api: ApiService,
    public util: UtilService,
    private route: ActivatedRoute,
    private navCtrl: NavController,
    private router: Router,
    private modalController: ModalController,
    private alertCtrl: AlertController
  ) {

    this.route.queryParams.subscribe((data: any) => {
      if (data && data.id) {
        this.id = data.id;
        console.log(data);
        this.name = data.name;
        this.getProduct();
      }
    })
  }
  async openViewer(url,flag) {
    let url2=url;
    if(flag=='2'){
      url2="https://www.naiko.in/assets/images/staff/"+url;
    }
    const modal = await this.modalController.create({
      component: ViewerModalComponent,
      componentProps: {
        src: url2
      },
      cssClass: 'ion-img-viewer',
      keyboardClose: true,
      showBackdrop: true
    });

    return await modal.present();
  }
  getProduct() {
    const param = {
      u_id: this.id
    }
    this.api.post('Android/get_vender_details', param).subscribe((data: any) => {
      this.loaded = true;
      console.log(data);
      this.gallery = [];
      if (data && data.status === 200) {
        this.image_staff = data.data.image_staff;
        this.product_details = data.data.product;
        this.service = data.data.service;
     
        this.staff = data.data.staff;
        this.images_all = data.data.images_all;
       
        this.prefix = this.product_details[0].prefix + this.product_details[0].counter;
        this.id = this.product_details[0].u_id;
        if(this.images_all.length==0){
          this.gallery.push(data.data.image_link + this.product_details[0].profile_image);
        }else{
          for(let i = 0; i < this.images_all.length; i++) {
            this.gallery.push(data.data.image_link + this.images_all[i].image_name);
     
          }
        }
       }

    }, error => {
      console.log(error);
      this.loaded = true;
      this.util.errorToast(this.util.getString('Something went wrong'));
    });
  }

  back() {
    this.navCtrl.back();
  }

  ngOnInit() {
  }
  async submit_booking_user() {

    if (!this.gender || !this.address || !this.timining || !this.staff_select || !this.service_select) {
      this.util.showToast(this.util.getString('All Fields are required'), 'dark', 'bottom');
      return false;
    }

    if (this.check) {
      this.check_vip = "1";
    }

    let alert = await this.alertCtrl.create({
      header: 'Confirm Appointment?',
      message: 'Do you want to confirm This Appointment?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {

          }
        },
        {
          text: 'Confirm',
          handler: () => {
            const param = {
              address: this.address,
              check_vip: this.check_vip,
              timing: this.timining,
              gender: this.gender,
              staff: this.staff_select,
              services: this.service_select,
              vender_id: this.id,
              fcm_token: localStorage.getItem('fcm') ? localStorage.getItem('fcm') : 'NA',
              user_id: localStorage.getItem('uid'),
            }
            console.log(param);
            this.util.show();
            this.api.post('Android/submit_booking_users', param).subscribe((data: any) => {
              this.util.hide();
              if (data && data.status === 200) {
                this.navCtrl.navigateRoot(['/tabs/orders'], { replaceUrl: true, skipLocationChange: true });
              } else if (data && data.status === 500) {
                this.util.errorToast(data.data.message);
              } else {
                this.util.errorToast(this.util.getString('Something went wrong'));
              }
            }, error => {
              console.log(error);

              this.util.errorToast(this.util.getString('Something went wrong'));
            });
          }
        }
      ]
    });
    alert.present();
  }
  productRating() {
    const param: NavigationExtras = {
      queryParams: {
        id: this.id,
        name: this.name,
        type: 'product'
      }
    }

    this.router.navigate(['/tabs/home/ratings'], param);
  }

}
