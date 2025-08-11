
import { Component, OnInit, AfterViewInit, OnDestroy, ChangeDetectionStrategy, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-es',
  templateUrl: './es.component.html',
  styleUrls: ['./es.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EsComponent implements OnInit, AfterViewInit, OnDestroy {
  audioIconSrc = '../../assets/img/nosound.webp';
  private audio: HTMLAudioElement | null = null;
  private video: HTMLVideoElement | null = null;
  private subscriptions: Subscription[] = [];
  private particlesLoaded = false;
  private youtubeVideos: any[] = [];

  constructor(
    private router: Router,
    private spinner: NgxSpinnerService,
    private ngZone: NgZone
  ) {}

  ngOnInit(): void {
    this.preloadCriticalAssets();
  }

  ngAfterViewInit(): void {
    this.ngZone.runOutsideAngular(() => {
      this.initializeComponents();
      this.loadParticlesLazily();
    });
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
    this.cleanupResources();
  }

  private preloadCriticalAssets(): void {
    // Precargar solo las imágenes críticas
    const criticalImages = [
      '../../assets/img/nosound.webp',
      '../../assets/img/sound.webp',
      '../../assets/img/lol.webp'
    ];

    criticalImages.forEach(src => {
      const img = new Image();
      img.src = src;
    });
  }

  private initializeComponents(): void {
    setTimeout(() => {
      this.setupAudio();
      this.setupVideo();
    }, 100);
  }

  private setupAudio(): void {
    this.audio = document.getElementById('myAudio') as HTMLAudioElement;
    if (this.audio) {
      this.audio.volume = 0.5;
      this.audio.addEventListener('error', () => {
        console.warn('Audio failed to load');
      });
    }
  }

  private setupVideo(): void {
    this.video = document.getElementById('video') as HTMLVideoElement;
    if (this.video) {
      this.video.addEventListener('loadeddata', () => {
        this.video?.play().catch(() => {
          console.warn('Video autoplay failed');
        });
      });
    }
  }

  private loadParticlesLazily(): void {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !this.particlesLoaded) {
          this.loadParticles();
          this.particlesLoaded = true;
          observer.disconnect();
        }
      });
    });

    const particlesContainer = document.getElementById('particles-js');
    if (particlesContainer) {
      observer.observe(particlesContainer);
    }
  }

  private loadParticles(): void {
    if (typeof (window as any).particlesJS !== 'undefined') {
      this.initParticles();
    } else {
      // Esperar a que se cargue particles.js
      const checkParticles = setInterval(() => {
        if (typeof (window as any).particlesJS !== 'undefined') {
          this.initParticles();
          clearInterval(checkParticles);
        }
      }, 100);
    }
  }

  private initParticles(): void {
    (window as any).particlesJS('particles-js', {
      particles: {
        number: { value: 50, density: { enable: true, value_area: 800 } },
        color: { value: '#ffffff' },
        shape: { type: 'circle' },
        opacity: { value: 0.5, random: false },
        size: { value: 3, random: true },
        line_linked: {
          enable: true,
          distance: 150,
          color: '#ffffff',
          opacity: 0.4,
          width: 1
        },
        move: {
          enable: true,
          speed: 6,
          direction: 'none',
          random: false,
          straight: false,
          out_mode: 'out',
          bounce: false
        }
      },
      interactivity: {
        detect_on: 'canvas',
        events: {
          onhover: { enable: false },
          onclick: { enable: false },
          resize: true
        }
      },
      retina_detect: true
    });
  }



  

  toggleAudio(): void {
    if (!this.audio) return;

    if (this.audio.paused) {
      this.audio.play().then(() => {
        this.audioIconSrc = '../../assets/img/sound.webp';
      }).catch(() => {
        console.warn('Audio play failed');
      });
    } else {
      this.audio.pause();
      this.audioIconSrc = '../../assets/img/nosound.webp';
    }
  }

  private cleanupResources(): void {
    if (this.audio) {
      this.audio.pause();
      this.audio = null;
    }
    if (this.video) {
      this.video.pause();
      this.video = null;
    }
  }
}
