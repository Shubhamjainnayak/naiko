import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { AlertController, MenuController, ModalController, NavController, PopoverController } from '@ionic/angular';
import { ApiService } from 'src/app/services/api.service';
import { UtilService } from 'src/app/services/util.service';
import { SortPage } from '../sort/sort.page';

@Component({
  selector: 'app-products',
  templateUrl: './products.page.html',
  styleUrls: ['./products.page.scss'],
})
export class ProductsPage implements OnInit {
  products: any[] = [];
  city_list: any[] = [];
  dummyProduct: any[] = [];
  dummy = Array(20);
  city_name:any;
  vip_check:any;
  gender_list:any;
  image_link2:any;
  haveSearch: boolean;
  
  constructor(
    private route: ActivatedRoute,
    private navCtrl: NavController,
    public api: ApiService,
    public util: UtilService,
    private router: Router,
    private popoverController: PopoverController,
    private modalController: ModalController,
    private alertCtrl: AlertController
  ) {
    this.haveSearch = false;
    this.get_product_data(this.city_name,this.vip_check,this.gender_list,'2','');
  }

  get_product_data(city_name,vip_check,gender_list,flag_value,vendor_name){
    
    this.dummyProduct = [];
  this.dummy = [];
    this.products = [];
  this.city_list = [];
    const param = {
      latitude: localStorage.getItem('latitude') ? localStorage.getItem('latitude') : 'NA',
      longitude: localStorage.getItem('longitude') ? localStorage.getItem('longitude') : 'NA',
      city_name:city_name,
      vip_check:vip_check,
      gender_list:gender_list,
      vendor_name:vendor_name,
      flag:flag_value
    };
    this.api.post('Android/home_data_search', param).subscribe((data: any) => {
     
  
      if (data && data.status === 200 && data.data) {
        this.image_link2=data.data.image_link_product;
        this.products=data.data.top_venders;
        this.city_list=data.data.city_list;
      }
     
    }, error => {
      console.log(error);
      this.dummyProduct = [];
      this.dummy = [];
    }); 
    }

  
    goToSingleProduct(u_id,name){
      const param: NavigationExtras = {
        queryParams: {
          id: u_id,
          name: name
        }
      };
      this.router.navigate(['product'], param);
    }

  






  async priceFilter() {
    
    const modal = await this.modalController.create({
      component: SortPage,
      componentProps: {  from: 'products',city_list:this.city_list,}
    });
    modal.onDidDismiss().then((datas: any) => {
      const data = datas.data;
      this.dummy = Array(20);
     
     if(data.close){
      this.get_product_data(data.city,data.true_check,data.gender,'3',data.vendor_name);
     }else{
      this.get_product_data(this.city_name,this.vip_check,this.gender_list,'2',data.vendor_name);
     }
      
    })
    return await modal.present();
  }
  

  

 

  ngOnInit() {
  }

  back() {
    this.navCtrl.back();
  }

  loadData(event) {
    
  }

  singleProduct(item) {
    const param: NavigationExtras = {
      queryParams: {
        id: item.id
      }
    };

    this.router.navigate(['/tabs/categories/product'], param);
  }

  

  
}
