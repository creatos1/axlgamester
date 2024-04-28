import { Component, OnInit } from '@angular/core';
import { LanguageService } from '../../app/services/languageservice'; // Ajusta la ruta al servicio
import { Router } from '@angular/router';
declare var particlesJS: any; // Declaración de la función particlesJS

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.scss']
})
export class InicioComponent implements OnInit {
  constructor(private languageService: LanguageService, private router: Router) {}

  ngOnInit():void {
    this.reproducirAudio();
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
          "value": "#FF0000" // Color rojo para simular el fuego
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
            "speed": 3,
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
          "speed":15, // Aumenta la velocidad de movimiento
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
  }

  saveLanguage(event: Event) {
    const selectedLanguage = (event.target as HTMLSelectElement)?.value;
    if (selectedLanguage) {
      this.languageService.setLanguage(selectedLanguage);
    }
  }

  checkLanguage() {
    const selectedLanguage = this.languageService.getSelectedLanguage();
    if (selectedLanguage === 'es') {
      window.location.href = '/home.es';
    } else if (selectedLanguage === 'en') {
      alert('Coming soon!');
    } else {
      alert('Select a language first!');
    }
  }
  reproducirAudio() {
    const audio = new Audio('../../assets/sound/soundmenu.mp3'); // Ruta al archivo de audio
    audio.play()
      .then(() => {
        console.log('Audio reproduciéndose...');
      })
      .catch(error => {
        console.log('Error al reproducir el audio:', error);
      });
  }


}