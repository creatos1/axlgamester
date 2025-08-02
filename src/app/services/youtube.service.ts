import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class YoutubeService {
  private apiKey = 'AIzaSyADneGosKDYJYeRXQTc8yV_ZDsGAXARgCo'; // 🔁 reemplaza con tu API Key
  private channelId = 'UCU6JmBJ7J8WeuwBOrJmeMKA'; // 🔁 reemplaza con tu ID de canal

  constructor(private http: HttpClient) {}

  getLatestVideos(): Observable<any> {
    const url = `https://www.googleapis.com/youtube/v3/search?key=${this.apiKey}&channelId=${this.channelId}&part=snippet&type=video&order=date&maxResults=6`;
    return this.http.get(url);
  }
}
