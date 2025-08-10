import { Component, inject, OnInit } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { Router } from '@angular/router';
import { UserService } from '../auth/user.service';
import { CardService } from '../services/card.service';
import { YoutubeService } from '../services/youtube.service';
import { Observable } from 'rxjs';

declare var particlesJS: any;

@Component({
  selector: 'app-es',
  templateUrl: './es.component.html',
  styleUrls: ['./es.component.scss']
})

export class EsComponent implements OnInit {
  public cards$: Observable<any[]> | undefined;
  public slickConfig: any;
  public userService = inject(UserService);

  videos: any[] = [];

  isVertical: boolean = false;
  isDropdownOpen: boolean = false;
  email: string = '';
  password: string = '';
  audio = new Audio();
  audioIconSrc = '../../assets/img/sound.png';

  constructor(
    private authService: AuthService,
    private router: Router,
    private cardService: CardService,
    private youtubeService: YoutubeService
  ) {}

  ngOnInit(): void {
    this.initializeSlickConfig();
    this.cargarTarjetas();
    this.configurarParticulas();
    this.configurarAudio();

    const storedEmail = this.userService.getUserEmail();
    this.email = storedEmail ? storedEmail : '';

    const botonEnviarCorreo = document.getElementById('enviarCorreo') as HTMLButtonElement;
    if (botonEnviarCorreo) {
      botonEnviarCorreo.addEventListener('click', () => this.redirigirCorreo());
    }

    // Cargar videos de YouTube
    this.loadYouTubeVideos();

  }

  cargarTarjetas() {
    this.cards$ = this.cardService.getCards();
  }

  initializeSlickConfig() {
    this.slickConfig = {
      slidesToShow: 3,
      slidesToScroll: 1,
      dots: true,
      infinite: true,
      arrows: true,
      responsive: [
        { breakpoint: 768, settings: { slidesToShow: 2, slidesToScroll: 1 } },
        { breakpoint: 480, settings: { slidesToShow: 1, slidesToScroll: 1 } }
      ]
    };
  }

  login() {
    this.authService.login(this.email, this.password).then(() => {
      this.router.navigate(['/home']);
      this.userService.setUserEmail(this.email);
    }).catch(error => {
      console.error('Error al iniciar sesión:', error);
    });
  }

  logout() {
    this.authService.logout().then(() => {
      this.userService.clearUser();
      this.email = '';
      this.router.navigate(['/home']);
    });
  }

  toggleVertical() {
    this.isVertical = !this.isVertical;
  }

  toggleDropdown(event: MouseEvent) {
    event.stopPropagation();
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  redirigirCorreo() {
    const esDispositivoMovil = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    const correoURL = esDispositivoMovil
      ? 'mailto:www.gamercracks@gmail.com'
      : 'https://mail.google.com/mail/?view=cm&fs=1&to=www.gamercracks@gmail.com';
    window.location.href = correoURL;
  }
  configurarParticulas() {
    particlesJS('particles-js', {
      "particles": {
        "number": {
          "value": 80, // Aumenta el número de partículas
          "density": {
            "enable": true,
            "value_area": 900// Ajusta el área donde se distribuyen las partículas
          }
        },
        "color": {
          "value": "#ff8000" // Color rojo para simular el fuego
        },
        "shape": {
          "type": "circle",
          "stroke": {
            "width": 0,
            "color": "#000000"
          },
          "polygon": {
            "nb_sides": 5
          }
        },
        "opacity": {
          "value": 0.8,
          "random": true,
          "anim": {
            "enable": false,
            "speed": 1,
            "opacity_min": 0.1,
            "sync": false
          }
        },
        "size": {
          "value": 2,
          "random": true,
          "anim": {
            "enable": true,
            "speed": 10,
            "size_min": 1,
            "sync": false
          }
        },
        "line_linked": {
          "enable": false
        },
        "move": {
          "enable": true,
          "speed": 10, // Aumenta la velocidad de movimiento
          "direction": "top-right", // Dirección de movimiento
          "random": true, // Movimiento aleatorio
          "straight": false,
          "out_mode": "out",
          "bounce": false,
          "attract": {
            "enable": false,
            "rotateX": 600,
            "rotateY": 1200
          }
        }
      },
      "interactivity": {
        "detect_on": "canvas",
        "events": {
          "onhover": {
            "enable": false,
            "mode": "grab"
          },
          "onclick": {
            "enable": false,
            "mode": "push"
          },
          "resize": true
        },
        "modes": {
          "grab": {
            "distance": 140,
            "line_linked": {
              "opacity": 1
            }
          },
          "bubble": {
            "distance": 400,
            "size": 40,
            "duration": 2,
            "opacity": 8,
            "speed": 3
          },
          "repulse": {
            "distance": 200,
            "duration": 0.4
          },
          "push": {
            "particles_nb": 4
          },
          "remove": {
            "particles_nb": 2
          }
        }
      },
      "retina_detect": true
    });
    this.audio.src = '../../assets/sound/sound.mp3'; // Cambia la ruta al archivo de audio
    this.audio.load();
    this.audio.loop = true; // Establece el audio en bucle
    this.audio.play(); // Reproduce automáticamente el audio al cargar la página
  }
  toggleAudio() {
    if (this.audio.paused) {
      this.audio.play();
      this.audioIconSrc = '../../assets/img/sound.png'; // Cambia la ruta al icono de audio activado
    } else {
      this.audio.pause();
      this.audioIconSrc = '../../assets/img/nosound.png'; // Cambia la ruta al icono de audio desactivado
    }
  }
  configurarAudio() {
    this.audio.src = '../../assets/sound/sound.mp3'; // Cambia la ruta al archivo de audio
    this.audio.load();
    this.audio.loop = true; // Establece el audio en bucle
    this.audio.play(); // Reproduce automáticamente el audio al cargar la página
  }

  // Helper function to shuffle an array
  shuffleArray(array: any[]): any[] {
    let currentIndex = array.length, randomIndex;

    // While there remain elements to shuffle.
    while (currentIndex !== 0) {

      // Pick a remaining element.
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;

      // And swap it with the current element.
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex], array[currentIndex]];
    }

    return array;
  }

  loadYouTubeVideos() {
    console.log('🚀 Iniciando carga de videos de YouTube...');
    
    this.youtubeService.getChannelVideos().subscribe({
      next: (videos) => {
        console.log('✅ Videos recibidos en el componente:', videos);
        console.log('📊 Número de videos:', videos.length);
        
        this.videos = videos;
        
        if (videos.length === 0) {
          console.warn('⚠️ No se cargaron videos - Array vacío');
        } else {
          console.log('🎉 Videos cargados exitosamente');
          videos.forEach((video, index) => {
            console.log(`Video ${index + 1}:`, video.snippet?.title);
          });
        }
      },
      error: (error) => {
        console.error('❌ Error completo en el componente:', error);
        this.videos = [];
      }
    });
  }

  // TrackBy function for better performance
  trackByVideoId(index: number, video: any): string {
    return video.id?.videoId || index;
  }
}