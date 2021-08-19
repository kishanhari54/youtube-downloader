import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'YoutubeDL';
  videoDetails: any = {};
  videoFormats: any = [];
  loading : boolean = false;
  fetched : boolean = false;
  constructor(private http: HttpClient, private fb: FormBuilder) { }
  youtube = new FormGroup({
    url: new FormControl('https://youtu.be/wzUbzzMw-9E'),
    quality: new FormControl(''),
    format: new FormControl('')
  })
  url = 'https://youtube-downloader-hari.herokuapp.com';

  Fetch() {
    const url=`${this.url}/videoInfo?url=${this.youtube.get('url')?.value}`;
    this.loading = true;

  
      this.http.get(url).subscribe((d: any) => {
        this.loading = false;
        this.fetched = true;
        this.videoDetails = d.videoDetails;
        this.videoFormats = d.formats.map((d: any) => { return { itag: d.itag, quality: d.qualityLabel, format: d.container } })
        this.youtube.patchValue({ quality: this.videoFormats[0].itag , format:  this.videoFormats[0].format  })
      });
   
  
  }

  download() {

    this.loading = true;
    let headers = new HttpHeaders()
  .set('content-type', 'video/mp4')
  .set('Access-Control-Allow-Origin', '*');

    this.http.get(`${this.url}/download`,{
      params: {
          url: this.youtube.get('url')?.value,
          quality: this.youtube.get('quality')?.value,
          format: this.youtube.get('format')?.value
      },
      headers: headers
    }
    )
      .subscribe(   () => { this.loading = false ; this.fetched = false; } )  // (d) => { console.log('Downloading')})
  }
}
