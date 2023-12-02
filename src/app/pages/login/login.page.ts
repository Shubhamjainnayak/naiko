
import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { UtilService } from 'src/app/services/util.service';
import { Router, NavigationExtras } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  email: any = '';
  password: any = '';
  loggedIn: boolean;
  passwordType: string = 'password';
  passwordIcon: string = 'eye-off';
 
  constructor(
    private router: Router,
    public util: UtilService,
    private navCtrl: NavController,
    private api: ApiService
  ) { }

  ngOnInit() {
  }

  hideShowPassword() {
    this.passwordType = this.passwordType === 'text' ? 'password' : 'text';
    this.passwordIcon = this.passwordIcon === 'eye-off' ? 'eye' : 'eye-off';
}
  login() {
    console.log('login');
    if (!this.email || !this.password) {
      this.util.showToast(this.util.getString('All Fields are required'), 'dark', 'bottom');
      return false;
    }
    var uname = new String(this.email);
   
    if (uname.length!=10) {
      this.util.showToast(this.util.getString('Please enter valid Phone No'), 'dark', 'bottom');
      return false;
    }
    this.loggedIn = true;
    const param = {
      email: this.email,
      password: this.password,
      fcm_token: localStorage.getItem('fcm') ? localStorage.getItem('fcm') : 'NA',
    };
    this.api.post('Android/login', param).subscribe((data: any) => {
      this.loggedIn = false;
      console.log(data);
      if (data && data.status === 200) {
        if (data && data.data) {
          if (data.data.active_flag === 'c') {
            localStorage.setItem('uid', data.data.u_id);
            this.util.userInfo = data.data;
            this.navCtrl.navigateRoot(['']);
          } else {
            console.log('not valid');
            Swal.fire({
              title: this.util.getString('Error'),
              text: this.util.getString('Your are blocked please contact administrator'),
              icon: 'error',
              showConfirmButton: true,
              showCancelButton: true,
              confirmButtonText: this.util.getString('Need Help?'),
              backdrop: false,
              background: 'white'
            }).then(status => {
              if (status && status.value) {
                const inboxParam: NavigationExtras = {
                  queryParams: {
                    id: 0,
                    name: 'Support',
                    uid: data.data.id
                  }
                };
                this.router.navigate(['inbox'], inboxParam);
              }
            });
          }
        } else {
          this.util.errorToast(this.util.getString('Username and password not matched'));
          this.email = '';
          this.password = '';
        }
      } else if (data && data.status === 500) {
        this.util.errorToast(data.data.message);
      } else {
        this.util.errorToast(this.util.getString('Username and password not matched'));
      }
    }, error => {
      console.log(error);
      this.loggedIn = false;
      this.util.errorToast(this.util.getString('Username and password not matched'));
    });

  }

  ionViewDidEnter() {
    console.log('enter');
  }

  create() {
    this.router.navigate(['register']);
  }

  reset() {
    this.router.navigate(['reset-password']);
  }
}
