import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { environment } from '../environment/environment';

@Injectable({
  providedIn: 'root',
})
export class YoutubeService {
  private apiKey = environment.youtubeApiKey || 'AIzaSyADneGosKDYJYeRXQTc8yV_ZDsGAXARgCo';
  private channelId = 'UCU6JmBJ7J8WeuwBOrJmeMKA';

  constructor(private http: HttpClient) {}

  getChannelVideos(): Observable<any[]> {
    // Usar el proxy local en lugar de la URL directa
    const url = `/api/youtube/search?key=${this.apiKey}&channelId=${this.channelId}&part=snippet&type=video&order=date&maxResults=10`;

    console.log('🚀 Llamando a YouTube API via proxy:', url);

    const headers = new HttpHeaders({
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    });

    return this.http.get<any>(url, { headers, responseType: 'json' }).pipe(
      map((response: any) => {
        console.log('📡 Respuesta de YouTube API:', response);

        if (response && response.items && response.items.length > 0) {
          console.log('✅ Videos encontrados:', response.items.length);

          // Filtrar y procesar videos
          const videos = response.items
            .filter((video: any) => video.id && video.id.videoId && video.snippet)
            .map((video: any) => ({
              id: { videoId: video.id.videoId },
              snippet: {
                title: video.snippet.title,
                description: video.snippet.description || '',
                thumbnails: video.snippet.thumbnails,
                publishedAt: video.snippet.publishedAt
              }
            }))
            .slice(0, 6);

          console.log('🎯 Videos procesados:', videos);
          return videos;
        } else {
          console.warn('⚠️ No se encontraron videos');
          return [];
        }
      }),
      catchError((error) => {
        console.error('❌ Error en YouTube API:', error);
        console.error('Estado del error:', error.status);
        console.error('Mensaje:', error.message);
        console.error('Respuesta completa:', error.error);
        console.error('URL que falló:', error.url);

        if (error.status === 403) {
          console.error('🔑 Error 403: Problema con la API Key o cuota excedida');
        } else if (error.status === 400) {
          console.error('📺 Error 400: Parámetros incorrectos');
        } else if (error.status === 200 && error.name === 'HttpErrorResponse') {
          console.error('🔍 Error 200: Problema de parsing JSON - respuesta no es JSON válido');
          console.log('Tipo de contenido recibido:', error.headers?.get('content-type'));
        }

        return of([]);
      })
    );
  }
}