
import { Component, OnInit } from '@angular/core';
import { ModalController, NavController } from '@ionic/angular';
import { UtilService } from 'src/app/services/util.service';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { ApiService } from 'src/app/services/api.service';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { VerifyPage } from '../verify/verify.page';
@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {

  fname: any = '';
  mobile: any = '';
  gender: any = '1';
  email: any = '';
  password: any = '';
  loggedIn: boolean;
  check: boolean;

  passwordType: string = 'password';
  passwordIcon: string = 'eye-off';
  ccCode: any = 91;
  dummy: any[] = [];
  constructor(
    public util: UtilService,
    private router: Router,
    private api: ApiService,
    private iab: InAppBrowser,
    private modalCtrl: ModalController
  ) {
    
  }

  ngOnInit() {
  }

  hideShowPassword() {
    this.passwordType = this.passwordType === 'text' ? 'password' : 'text';
    this.passwordIcon = this.passwordIcon === 'eye-off' ? 'eye' : 'eye-off';
}
  async openModal(userId) {
     const modal = await this.modalCtrl.create({
      component: VerifyPage,
       componentProps: { code: this.ccCode, mobile: this.mobile, uid: userId }
     });

    modal.onDidDismiss().then((data: any) => {
      console.log(data);
    });
    modal.present();
  }

  login() {
    this.ccCode=91;
    if (!this.check) {
      this.util.showToast(this.util.getString('Please accept terms and conditions'), 'dark', 'bottom');
      return false;
    }
    if (!this.fname  || !this.mobile  || !this.password || this.ccCode === '' || !this.ccCode) {
      this.util.showToast(this.util.getString('All Fields are required'), 'dark', 'bottom');
      return false;
    }
if(this.email){
  const emailfilter = /^[\w._-]+[+]?[\w._-]+@[\w.-]+\.[a-zA-Z]{2,6}$/;
  if (!emailfilter.test(this.email)) {
    this.util.showToast(this.util.getString('Please enter valid email'), 'dark', 'bottom');
    return false;
  }
}
    

    const param = {
      first_name: this.fname,
      email: this.email,
      password: this.password,
      gender: this.gender,
      fcm_token: localStorage.getItem('fcm') ? localStorage.getItem('fcm') : 'NA',
      lat: localStorage.getItem('latitude') ? localStorage.getItem('latitude') : 'NA',
      lng: localStorage.getItem('longitude') ? localStorage.getItem('longitude') : 'NA',
      mobile: this.mobile
    }

    this.loggedIn = true;
    this.api.post('Android/registerUser', param).subscribe((data: any) => {
      this.loggedIn = false;
    
      console.log(data);
      if (data && data.status === 200) {
        this.util.userInfo = data.data;
        localStorage.setItem('uMobile', '+' + this.ccCode + this.mobile);
        this.openModal(data.data.last_id);
      } else if (data && data.status === 500) {
        this.util.errorToast(data.data.message);
      } else {  
        this.util.errorToast(this.util.getString('Something went wrong'));
      }
    }, error => {
      console.log(error,'error');
      this.loggedIn = false;
      this.util.errorToast(this.util.getString('Something went wrong'));
    });
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }

  

  open(type) {
    if (type === 'eula') {
    //  this.iab.create('https://shoproz.in/privacy-policy');
    } else {
      //this.iab.create('https://shoproz.in/privacy-policy');
    }
  }
}
