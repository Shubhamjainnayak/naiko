import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { UtilService } from '../../services/util.service';
import { Router, NavigationExtras } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { AlertController, PopoverController } from '@ionic/angular';
import { FiltersComponent } from 'src/app/components/filters/filters.component';
@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  slideOpts = {
    slidesPerView: 1.2,
  };slideOpts2 = {
    slidesPerView: 1.5,
  };
  slideTops = {
    slidesPerView: 2,
    spaceBetween: 5,
    slideShadows: true,
  }

  dummyBanners= Array(10);
  banners: any[] = [];
  topProducts: any[] = [];
  popular_venders: any[] = [];
  popular_near: any[] = [];
  image_link: any = '';
  image_link2: any = '';
  topProducts_main: any[] = [];
  terms;
  products: any[] = [];
  dummyProducts: any[] = [];
  selectedFilterID;
  selectedFilter="Both";
  constructor(
    public util: UtilService,
    private router: Router,
    public api: ApiService,
    private chMod: ChangeDetectorRef,
    private iab: InAppBrowser,
    private alertCtrl: AlertController,
    private popoverController: PopoverController,
  ) {
    this.dummyBanners = Array(5);
    this.banners = [];
    this.products = [];
    if (!this.util.appClosed) {
      this.getInit();

    }
    this.util.subscribeCity().subscribe((data) => {
      this.dummyBanners = Array(5);
      this.banners = [];
      this.products = [];
      if (!this.util.appClosed) {
        this.getInit();
      }
    });

  }


  getInit() {
    this.getBanners();
    this.dummyBanners = Array(5);
    this.products = [];

  }


  ngOnInit() {
  }


  

  updateFilter(selectedFilterID) {
    if (selectedFilterID ==3 || selectedFilterID ==4) {
      this.selectedFilter="Both";
      this.topProducts = this.topProducts_main;
    } else {
      if (selectedFilterID == 1) {
        const val = "male";
        this.selectedFilter="Male";
        // if the value is an empty string don't filter the items
        if (val && val.trim() != '') {
          this.topProducts = this.topProducts_main.filter((location) => {

            if ((location.gender ? location.gender.toLowerCase() : location.gender) == val.toLowerCase()) {
              return true;
            }
            else {
              return false;
            }
          });
        }
      } else {
        const val = "female";
        this.selectedFilter="Female";
        // if the value is an empty string don't filter the items
        if (val && val.trim() != '') {
          this.topProducts = this.topProducts_main.filter((location) => {
            if ((location.gender ? location.gender.toLowerCase() : location.gender) == val.toLowerCase()) {
              return true;
            }
            else {
              return false;
            }
          });
        }
      }
    }
  }


  getBanners() {
    this.dummyBanners = Array(5);

    const param = {
      latitude: localStorage.getItem('latitude') ? localStorage.getItem('latitude') : 'NA',
      longitude: localStorage.getItem('longitude') ? localStorage.getItem('longitude') : 'NA'
    };
    this.api.post('Android/home_data', param).subscribe((data: any) => {
      console.log(data);
      this.dummyBanners = [];

      this.banners = [];
      if (data && data.status === 200 && data.data) {

        this.banners = data.data.banner;
        this.image_link = data.data.image_link;
        this.image_link2 = data.data.image_link_product;
        this.topProducts = data.data.top_venders;
        this.popular_venders = data.data.popular_venders;
        this.popular_near = data.data.popular_near;
        this.topProducts_main = data.data.top_venders;
       
      }

    }, error => {
      console.log(error);
      this.dummyBanners = [];
    });
  }
  goToSingleProduct(u_id, name) {
    const param: NavigationExtras = {
      queryParams: {
        id: u_id,
        name: name
      }
    };
    this.router.navigate(['product'], param);
  }
  changeCity() {
    this.router.navigate(['products']);
  }


  search(event: string) {
    console.log(event);
    if (event && event !== '') {


      event = event.toLocaleLowerCase();

      return this.topProducts = this.topProducts_main.filter(it => {
    
        if (it.business_name.toLocaleLowerCase().includes(event)) {
          return true;
        }
        else {
          return false;
        }
      });

     
    }
  }

}
