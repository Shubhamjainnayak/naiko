import { Component, OnInit } from '@angular/core';
import { ModalController, NavController, NavParams } from '@ionic/angular';
import { ApiService } from 'src/app/services/api.service';
import { UtilService } from 'src/app/services/util.service';

@Component({
  selector: 'app-verify',
  templateUrl: './verify.page.html',
  styleUrls: ['./verify.page.scss'],
})
export class VerifyPage implements OnInit {

  resendCode: boolean;
  textCode = '';
  mobile: any;
  id: any;
  userCode: any = "";
  uid: any;
  constructor(
    private api: ApiService,
    public util: UtilService,
    private navParam: NavParams,
    private navCtrl: NavController,
    private modalCtrl: ModalController
  ) {
    this.resendCode = false;
    this.uid = this.navParam.get('uid');
    console.log('uid-->>', this.uid);
    this.mobile = localStorage.getItem('uMobile');
    console.log(this.mobile);
    this.sendOTP();
    setTimeout(() => {
      this.resendCode = true;
    }, 30000);
  }

  sendOTP() {
    this.mobile = localStorage.getItem('uMobile');
    const param = {
      to: this.mobile
    };
    console.log(param);
    this.util.show();
    this.api.post('Android/send_otp', param).subscribe((data: any) => {
      console.log(data.data.last_id);
      this.id = data.data.last_id;
     /// this.userCode== data.data.otp;
      this.util.hide();
    }, error => {
      console.log(error);
      this.util.hide();
      this.util.errorToast(this.util.getString('Something went wrong'));
    });
  }

  ngOnInit() {
  }
  // onOtpChange(event) {
  //   console.log(event);
  //   this.userCode = event;
  // }

  resend() {
    this.sendOTP();
  }
  continue() {
    console.log('uid-->>', this.uid);
    if (this.userCode === '' || !this.userCode) {
      this.util.errorToast(this.util.getString('Not valid code'));
      return false;
    }
    if (this.userCode) {
      const param = {
        id: this.uid,
        otp: this.userCode
      };
      this.util.show();
      this.api.post('Android/verifyOTP', param).subscribe((data: any) => {
        console.log(data);
        if (data && data.status === 200) {
          this.util.hide();
          this.modalCtrl.dismiss();
          localStorage.setItem('uid', this.uid);
          this.navCtrl.navigateRoot(['']);
        } else {
          this.util.hide();
          if (data && data.status === 500 && data.data && data.data.message) {
            this.util.errorToast(data.data.message);
            return false;
          }
          this.util.errorToast(this.util.getString('Something went wrong'));
          return false;
        }
      }, error => {
        this.util.hide();
        console.log(error);
        this.util.errorToast(this.util.getString('Something went wrong'));
      });
    } else {
      this.util.errorToast(this.util.getString('Not valid code'));
      return false;
    }
  }

  close() {
    this.modalCtrl.dismiss();
  }
}
