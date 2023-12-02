import { Component } from '@angular/core';
import {  MenuController, NavController, Platform,AlertController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { OneSignal } from '@ionic-native/onesignal/ngx';
import { environment } from 'src/environments/environment';
import { UtilService } from './services/util.service';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import * as moment from 'moment';
import { Router } from '@angular/router';
import { NativeGeocoder, NativeGeocoderOptions, NativeGeocoderResult } from '@ionic-native/native-geocoder/ngx';

import { NativeAudio } from '@ionic-native/native-audio/ngx';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  public appPages: any[] = [];
  selectedIndex: any;
  geoencoderOptions: NativeGeocoderOptions = {
    useLocale: true,
    maxResults: 5
  };
  flag = 0;
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private navCtrl: NavController,
    private oneSignal: OneSignal,
    private geolocation: Geolocation,
    private alertCtrl: AlertController,
    public util: UtilService,
    private router: Router,
    private nativeAudio: NativeAudio,
    private menuCtrl: MenuController,
    private nativeGeocoder: NativeGeocoder,
  ) {
    this.selectedIndex = 0;
    this.initializeApp();
    this.menuCtrl.enable(false, 'menu1');
    console.log(moment().format('lll'));

  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.backgroundColorByHexString('#45C261');
      this.splashScreen.hide();
      this.appPages = this.util.appPage;
      this.set_push();
      this.getGeolocation();
      
     

      this.platform.backButton.subscribe(async () => {
        
        if (this.router.url === '/tabs/orders' || this.router.url === '/tabs/account') {
          console.log('can close');
          this.navCtrl.navigateRoot(['/tabs/home']);
        } else if (this.router.url === '/login') {
          navigator['app'].exitApp();
        }else if (this.router.url === '/tabs/home') {
          if (this.flag == 0) {
            this.flag = 1;
            this.prensentalert();
          }
        }else
        {
          this.navCtrl.back();
        }
      });
    });
  }



  
  set_push() {
    
    if (this.platform.is('cordova')) {
      console.log('platform is okk');
      setTimeout(async () => {
          await this.oneSignal.startInit(environment.onesignal.appId, environment.onesignal.googleProjectNumber);
          this.oneSignal.getIds().then((data) => {
              localStorage.setItem('fcm', data.userId);
              
          });
          this.oneSignal.enableSound(true);
          await this.oneSignal.endInit();
      }, 1000);

      this.nativeAudio.preloadSimple('audio', 'assets/alert.mp3').then((data: any) => {
          console.log('dupletx', data);
      }, error => {
          console.log(error);
      }).catch(error => {
          console.log(error);
      });
     
      this.oneSignal.handleNotificationReceived().subscribe(data => {
          console.log('got order', data);
          this.nativeAudio.play('audio', () => console.log('audio is done playing')).catch(error => console.log(error));
          this.nativeAudio.setVolumeForComplexAsset('audio', 1);
       
      });
      this.oneSignal.inFocusDisplaying(2);
  }

  }
  logout() {
    localStorage.clear();
    this.navCtrl.navigateRoot(['/login']);
  }

  getTranslate(str) {
    return this.util.getString(str);
  }

  async prensentalert() {
    let alert = await this.alertCtrl.create({
      header: 'Exit Application?',
      message: 'Do you want to exit the application?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            this.flag = 0;
          }
        },
        {
          text: 'Exit',
          handler: () => {
            this.flag = 0;
            navigator['app'].exitApp();
          }
        }
      ]
    });
    alert.present();
  }

  getGeolocation() {
    this.geolocation.getCurrentPosition().then((resp) => {
      localStorage.setItem('latitude', resp.coords.latitude.toString()); 
      localStorage.setItem('longitude',resp.coords.longitude.toString()); 
      this.getGeoencoder(resp.coords.latitude, resp.coords.longitude);
    }).catch((error) => {
      console.log('Error getting location' + JSON.stringify(error));
    });
  }
  getGeoencoder(latitude, longitude) {
    this.nativeGeocoder.reverseGeocode(latitude, longitude, this.geoencoderOptions)
      .then((result: NativeGeocoderResult[]) => {
       console.log(result);
      })
      .catch((error: any) => {
        console.log('Error getting location' + JSON.stringify(error));
      });
  }
}
