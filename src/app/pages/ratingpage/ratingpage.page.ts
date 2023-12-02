import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { Storage } from '@ionic/storage';
import { ToastController ,NavParams,LoadingController,ModalController,PopoverController} from '@ionic/angular';
@Component({
  selector: 'app-ratingpage',
  templateUrl: './ratingpage.page.html',
  styleUrls: ['./ratingpage.page.scss'],
})
export class RatingpagePage implements OnInit {
   comment_value='';
  user_id;
  ub_id;
  rating="4";
  driver_name;
  driver_moblie_no;
  driver_image;
  constructor(public popoverController:PopoverController,private params: NavParams,private toastController: ToastController, public api: ApiService, public storage: Storage, public modalController: ModalController,public loadingController:LoadingController) {
   
    this.ub_id=params.get('oh_id');	
    this.driver_name=params.get('user_name');
    	this.driver_moblie_no=params.get('user_moblie_no');	
    this.driver_image=params.get('user_address');	
    
     this.user_id=localStorage.getItem('uid');
   }

  ngOnInit() {
    this.ub_id=this.params.get('oh_id');	
    this.driver_name=this.params.get('user_name');
    	this.driver_moblie_no=this.params.get('user_moblie_no');	
    this.driver_image=this.params.get('user_address');	
  
    this.user_id=localStorage.getItem('uid');
  }
  ionViewWillEnter() {
    this.ub_id=this.params.get('oh_id');	
    this.driver_name=this.params.get('user_name');
    	this.driver_moblie_no=this.params.get('user_moblie_no');	
    this.driver_image=this.params.get('user_address');	
    this.user_id=localStorage.getItem('uid');
  }
  
  async closeModal(data) {
    const onClosedData: string = data;
    await this.popoverController.dismiss(onClosedData);
    } 


    async savetolinktoreview() {
    if(this.rating!=''){
      let body = {
        "ub_id": this.ub_id,
        "user_id": this.user_id,
        "rating": this.rating,
        "comment_value": this.comment_value,
      };
      console.log(body);
      this.api.post('Android/rating_vender', body).subscribe(async (res: any) => {
      
        if (res && res.status === 200) {
          const toast = await this.toastController.create({
            message: 'Thankyou For your Feedback',
            duration: 2000
          });
          toast.present();
          this.closeModal(res);
        }
        else {
          const toast = await this.toastController.create({
            message: 'Some Thing is Worng.',
            duration: 2000
          });
          toast.present();
        }
       
      });
    }
     
    }
    logRatingChange(e)
    {
     console.log(e);
     this.rating=e;
     console.log(this.comment_value);
    }
    
}
