import { Router, NavigationExtras } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { UtilService } from 'src/app/services/util.service';
import { ApiService } from 'src/app/services/api.service';
@Component({
  selector: 'app-account',
  templateUrl: './account.page.html',
  styleUrls: ['./account.page.scss'],
})
export class AccountPage implements OnInit {
  get_full_name:any='';
  get_email:any='';
  get_image:any='';
  constructor(
    private router: Router,
    private navCtrl: NavController,
    public util: UtilService,
    public api: ApiService
  ) {

    const param = {
      u_id: localStorage.getItem('uid')
    };
    this.api.post('Android/get_profile_details', param).subscribe((data: any) => {
      console.log(data);
      if (data && data.status === 200 ) {
     
        this.get_full_name=data.data.profile.full_name;
        this.get_email=data.data.profile.email_id;
        this.get_image=data.data.image_link+data.data.profile.profile_image;
      }
    }, error => {
      console.log(error);
      this.util.errorToast(this.util.getString('Something went wrong'));
    });

   }

  ngOnInit() {
  }

  openMenu() {
    this.util.openMenu();
  }

  ditProfile() {
    this.router.navigate(['/edit-profile']);
  }

  logout() {
    localStorage.clear();
    this.navCtrl.navigateRoot(['login']);
  }

  

  goToAbout() {
    this.router.navigate(['/tabs/account/about']);
  }

  editProfile() {
    this.router.navigate(['/tabs/account/profile']);
  }


  goToContact() {
    this.router.navigate(['tabs/account/contacts']);
  }

  reset() {
    this.router.navigate(['reset-password']);
  }

 
  goFaqs() {
    this.router.navigate(['tabs/account/faqs']);
  }

  goHelp() {
    this.router.navigate(['tabs/account/help']);
  }
}
