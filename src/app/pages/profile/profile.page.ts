import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { UtilService } from 'src/app/services/util.service';
import { NavController, ActionSheetController } from '@ionic/angular';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer/ngx';
@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  fname: any;
  lname: any;
  mobile: any;
  gender: any;
  email: any;
  image_link_show;
  cover: any = '';
  cover_link: any = '';
  edit_flag: boolean;
  private fileTransfer: FileTransferObject;
  constructor(
    public api: ApiService,
    public util: UtilService,
    private navCtrl: NavController,
    private actionSheetController: ActionSheetController,
    private camera: Camera,
    private transfer: FileTransfer,
  ) {
    this.edit_flag = true;
    console.log(localStorage.getItem('uid'));
    this.getProfile();
  }

  ngOnInit() {
  }

  getProfile() {
    const param = {
      u_id: localStorage.getItem('uid')
    };
    this.util.show();
    this.api.post('Android/get_profile_details', param).subscribe((data: any) => {
      this.util.hide();

      if (data && data.status === 200 && data.data) {

        this.util.userInfo = data.data.profile;
        this.fname = data.data.profile.full_name;
        this.mobile = data.data.profile.mobile_no;
        this.cover_link = data.data.image_link;
        this.cover = data.data.profile.profile_image;
        this.email = data.data.profile.email_id;
        this.image_link_show=this.cover_link+this.cover;
      }
    }, error => {
      console.log(error);
      this.util.hide();
      this.util.errorToast(this.util.getString('Something went wrong'));
    })
  }


  async updateProfile() {
    const actionSheet = await this.actionSheetController.create({
      header: this.util.getString('Choose from'),
      buttons: [{
        text: this.util.getString('Camera'),
        icon: 'camera',
        handler: () => {
          console.log('camera clicked');
          this.upload('camera');
        }
      }, {
        text: this.util.getString('Gallery'),
        icon: 'images',
        handler: () => {
          console.log('gallery clicked');
          this.upload('gallery');
        }
      }, {
        text: this.util.getString('Cancel'),
        icon: 'close',
        role: 'cancel',
        handler: () => {
          console.log('Cancel clicked');
        }
      }]
    });

    await actionSheet.present();
  }

  update() {
    if (!this.fname || this.fname === '' || !this.mobile || this.mobile === '') {
      this.util.errorToast(this.util.getString('All Fields are required'));
      return false;
    }
    const param = {
      first_name: this.fname,
      email: this.email,
      cover: this.cover,
      mobile: this.mobile,
      flag: 1,
      id: localStorage.getItem('uid')
    };
    this.util.show(this.util.getString('updating...'));
    this.api.post('Android/edit_profile', param).subscribe((data: any) => {
      this.util.hide();
      console.log(data);
      this.getProfile();
    }, error => {
      this.util.hide();
      console.log(error);
      this.util.errorToast(this.util.getString('Something went wrong'));
    });
  }

  back() {
    this.navCtrl.back();
  }



  upload_old(type) {
    let imageData_select;
    const options: CameraOptions = {
      quality: 100,
      targetHeight: 800,
      targetWidth: 800,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      correctOrientation: true,
      sourceType: type === 'camera' ? this.camera.PictureSourceType.CAMERA : this.camera.PictureSourceType.PHOTOLIBRARY
    };
    this.camera.getPicture(options).then((imageData) => {
      imageData_select = imageData;
    });
    this.fileTransfer = this.transfer.create();
    let options_tyw: FileUploadOptions = {
      fileKey: 'file',
      chunkedMode: false,
      fileName: 'Downloadimage.png',
      headers: { Connection: "close" },
    }

    this.fileTransfer.upload(imageData_select, this.api.getserver_url + 'Android/upload_file', options_tyw, true).then((data: any) => {
      this.util.hide();
      console.log('data', JSON.parse(data.data));
      const info = JSON.parse(data.data);
      this.cover = info.data;
      console.log('cover image', this.cover);
      const param = {
        cover: this.cover,
        flag: 2,
        id: localStorage.getItem('uid')
      };
      this.util.show(this.util.getString('updating...'));
      this.api.post('Android/edit_profile', param).subscribe((update: any) => {
        this.util.hide();
        console.log(update);
      }, error => {
        this.util.hide();
        console.log(error);
        this.util.errorToast(this.util.getString('Something went wrong'));
      });

    }).catch((error) => {
      console.log(error);
      this.util.hide();
      this.util.errorToast(this.util.getString('Something went wrong'));
    })
  }
  preview_banner(files) {
    console.log('fle', files);
    if (files.length === 0) {
      return;
    
    }

    // const imageFile = files[0];

    // const fileReader = new FileReader();
    // fileReader.onload = () => {
    //  return  this.image_name = fileReader.result;
    // };
    // fileReader.readAsDataURL(imageFile);


    const mimeType = files[0].type;
    if (mimeType.match(/image\/*/) == null) {
      return;
    }
    if (files) {
      this.util.show("upload Image");
      const	myDate = new Date().toISOString();
      this.cover =files[0].name;
    
      this.api.uploadFile_user(files,myDate).subscribe((data: any) => {
        console.log('==>>', data);
        if (data && data.status === 200 && data.data) {
          this.cover = data.data;
          this.image_link_show=this.cover_link+this.cover;
          this.upload_image();
        }
      }, err => {
        console.log(err);
        this.upload_image();
        this.image_link_show=this.cover_link+this.cover;
        this.util.hide();
      });
    } else {
      console.log('no');
    }
  }

upload_image()
{
  const param = {
    cover: this.cover,
    flag: 2,
    id: localStorage.getItem('uid')
  };
  this.util.show(this.util.getString('updating...'));
  this.api.post('Android/edit_profile', param).subscribe((update: any) => {
    this.util.hide();
    console.log(update);
  }, error => {
    this.util.hide();
    console.log(error);
    this.util.errorToast(this.util.getString('Something went wrong'));
  });
}


  upload(type) {
    try {
      const options: CameraOptions = {
        quality: 100,
        targetHeight: 800,
        targetWidth: 800,
        destinationType: this.camera.DestinationType.DATA_URL,
        encodingType: this.camera.EncodingType.JPEG,
        mediaType: this.camera.MediaType.PICTURE,
        correctOrientation: true,
        sourceType: type === 'camera' ? this.camera.PictureSourceType.CAMERA : this.camera.PictureSourceType.PHOTOLIBRARY
      };
      this.camera.getPicture(options).then((url) => {
        console.log('url->', url);
        this.util.show('uploading');
        const alpha = {
          img: url,
          type: 'image/jpeg'
        };
        console.log('parma==>', alpha);
        this.api.nativePost('Android/upload_file', alpha).then((data) => {
          this.util.hide();
          console.log('data', JSON.parse(data.data));
          const info = JSON.parse(data.data);
          this.cover = info.data;
          console.log('cover image', this.cover);
          const param = {
            cover: this.cover,
            flag: 2,
            id: localStorage.getItem('uid')
          };
          this.util.show(this.util.getString('updating...'));
          this.api.post('Android/edit_profile', param).subscribe((update: any) => {
            this.util.hide();
            console.log(update);
          }, error => {
            this.util.hide();
            console.log(error);
            this.util.errorToast(this.util.getString('Something went wrong'));
          });
        }, error => {
          console.log(error);
          this.util.hide();
          this.util.errorToast(this.util.getString('Something went wrong'));
        }).catch(error => {
          console.log(error);
          this.util.hide();
          this.util.errorToast(this.util.getString('Something went wrong'));
        });
      });

    } catch (error) {
      console.log('error', error);
      this.util.errorToast(this.util.getString('Something went wrong'));
    }
  }

}
