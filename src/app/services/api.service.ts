import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { HTTP } from '@ionic-native/http/ngx';
@Injectable({
	providedIn: 'root'
})
export class ApiService {

	baseUrl: string = environment.baseURL;
	constructor(public http: HttpClient,
		private nativeHttp: HTTP) {
	}


	post(url, body) {
		return this.http.post(this.baseUrl + url, JSON.stringify(body), { headers: new HttpHeaders({ "Content-Type": "application/json; charset=UTF-8" }) });
	}

	get(url) {
		const header = {
			headers: new HttpHeaders()
				.set('Content-Type', 'application/x-www-form-urlencoded')
		};
		return this.http.get(this.baseUrl + url, header);

	}
	nativePost(url, post) {
		this.nativeHttp.setHeader('*', String("Content-Type"), String("application/json"));
		this.nativeHttp.setHeader('*', String("Accept"), String("application/json"));
		this.nativeHttp.setDataSerializer('multipart')
		return this.nativeHttp.post(this.baseUrl + url, post, { headers: new HttpHeaders({ "Content-Type": "application/json; charset=UTF-8" }) });
	}
	getserver_url() {
		return this.baseUrl;
	}
	uploadFile_user(files: File[],myDate) {
		const formData = new FormData();
		Array.from(files).forEach(f => formData.append('userfile', f));
		return this.http.post(this.baseUrl + 'Android/upload_user_image',formData);
	  }
}


