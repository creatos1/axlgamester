
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../environment/environment';

export interface YouTubeVideo {
  id: {
    videoId: string;
  };
  snippet: {
    title: string;
    description: string;
    thumbnails: {
      medium: {
        url: string;
      };
      high: {
        url: string;
      };
    };
    publishedAt: string;
  };
}

export interface YouTubeResponse {
  items: YouTubeVideo[];
}

@Injectable({
  providedIn: 'root'
})
export class YoutubeService {
  private apiKey = environment.youtubeApiKey || 'AIzaSyADneGosKDYJYeRXQTc8yV_ZDsGAXARgCo';
  private channelId = environment.youtubeChannelId || 'UCU6JmBJ7J8WeuwBOrJmeMKA';

  constructor(private http: HttpClient) {}

  getChannelVideos(maxResults: number = 12): Observable<YouTubeVideo[]> {
    const url = `/api/youtube/search`;
    
    const params = {
      key: this.apiKey,
      channelId: this.channelId,
      part: 'snippet',
      type: 'video',
      order: 'date',
      maxResults: maxResults.toString()
    };

    return this.http.get<YouTubeResponse>(url, { params }).pipe(
      map(response => this.shuffleArray(response.items))
    );
  }

  private shuffleArray(array: YouTubeVideo[]): YouTubeVideo[] {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

  getVideoUrl(videoId: string): string {
    return `https://www.youtube.com/watch?v=${videoId}`;
  }

  getEmbedUrl(videoId: string): string {
    return `https://www.youtube.com/embed/${videoId}`;
  }
}
