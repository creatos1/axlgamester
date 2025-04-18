import { Component, inject, OnInit } from '@angular/core';
import { AuthService } from '../auth/auth.service'; 
import { Router } from '@angular/router';
import { UserService } from '../auth/user.service';
declare var particlesJS: any; // Declaración de la función particlesJS
import { CardService } from '../services/card.service'; // Asegúrate de importar tu servicio
import { Observable } from 'rxjs';  // Para manejar observables
@Component({
  selector: 'app-es',
  templateUrl: './es.component.html',
  styleUrls: ['./es.component.scss']
})

export class EsComponent implements OnInit {
  public cards$: Observable<any[]> | undefined; // Declaración opcional
  public slickConfig: any; // Definición de slickConfig

  public userService = inject(UserService); 
  isVertical: boolean = false;
  audio = new Audio();
  audioIconSrc = '../../assets/img/sound.png'; // Cambia la ruta al icono de audio activado
  email: string = ''; // Inicializa como una cadena vacía
  password: string = ''; // Agrega la propiedad password
  isDropdownOpen: boolean = false; // Estado del menú desplegable

  constructor(
    private authService: AuthService,
    private router: Router,
    private cardService: CardService // Inyecta el servicio de tarjetas
  ) {}

  ngOnInit(): void {
    this.initializeSlickConfig(); // Inicializa la configuración de slick

    this.cargarTarjetas(); // Carga las tarjetas al iniciar

    this.configurarParticulas(); // Configurar partículas al inicializar
    const storedEmail = this.userService.getUserEmail(); // Obtener el correo del usuario
    this.email = storedEmail ? storedEmail : ''; // Asignar el correo si no es null

    // Agregar evento de clic al botón para enviar correo
    const botonEnviarCorreo = document.getElementById('enviarCorreo') as HTMLButtonElement;
    botonEnviarCorreo.addEventListener('click', () => this.redirigirCorreo());

    this.configurarAudio(); // Configurar audio al inicializar
  }
  cargarTarjetas() {
    this.cards$ = this.cardService.getCards(); // Llama a tu servicio para obtener las tarjetas
  }
  initializeSlickConfig() {
    this.slickConfig = {
      slidesToShow: 3,
      slidesToScroll: 1,
      dots: true,
      infinite: true,
      arrows: true,
      responsive: [
        {
          breakpoint: 768,
          settings: {
            slidesToShow: 2,
            slidesToScroll: 1,
          },
        },
        {
          breakpoint: 480,
          settings: {
            slidesToShow: 1,
            slidesToScroll: 1,
          },
        },
      ],
    };
  }
  login() {
    this.authService.login(this.email, this.password).then(() => {
      this.router.navigate(['/home']);
      this.userService.setUserEmail(this.email); // Asegúrate de guardar el email aquí
    }).catch(error => {
      console.error('Error al iniciar sesión:', error);
    });
  }

  toggleVertical() {
    this.isVertical = !this.isVertical;
  }
  toggleDropdown(event: MouseEvent) {
    event.stopPropagation(); // Previene que el clic se propague a otros elementos
    this.isDropdownOpen = !this.isDropdownOpen; // Alterna la visibilidad del menú desplegable
  }
  
  

  

  logout() {
    this.authService.logout().then(() => {
      this.userService.clearUser(); // Limpia el usuario del servicio
      this.email = ''; // Limpia el correo localmente
      this.router.navigate(['/home']); // Redirige a la página de inicio
    });
  }

  redirigirCorreo() {
    // Verificar si es un dispositivo móvil
    const esDispositivoMovil = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

    // URL del correo electrónico
    let correoURL: string;

    if (esDispositivoMovil) {
      // Redirigir a un enlace mailto:
      correoURL = 'mailto:www.gamercracks@gmail.com';
    } else {
      // Redirigir al cliente de correo de Gmail
      correoURL = 'https://mail.google.com/mail/?view=cm&fs=1&to=www.gamercracks@gmail.com';
    }

    // Redirigir
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
  
}
