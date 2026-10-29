import { Component, inject , signal , OnInit} from '@angular/core';
import { ReservarTurnoApiClient } from './reservar-turno-api-client';
import { ButtonModule } from 'primeng/button';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { MedicosApiClient } from '../../administrador/medicos/medicos-api-client';
import { MedicoListadoDto } from '../../administrador/medicos/medico-listado-dto';
import { MessageService } from 'primeng/api';


@Component({
  selector: 'app-reservar-turno',
  imports: [ButtonModule ,  FormsModule , RouterLink],
  templateUrl: './reservar-turno.html',
  styleUrl: './reservar-turno.css',
})
export class ReservarTurno  implements OnInit{
  private readonly reservarTurnoApi = inject(ReservarTurnoApiClient);
  private readonly medicosApi = inject(MedicosApiClient);
  private readonly messageService = inject(MessageService);

  idMedico: number | null = null;
  fechaHora: string = '';
  fecha: string = '';
hora: string = '';
  horarios: string[] = [
  '08:00',
  '09:00',
  '10:00',
  '11:00',
  '12:00',
  '13:00',
  '14:00',
  '15:00'
];
fechaMinima: string = '';
fechaMaxima: string = '';
  medicos = signal<MedicoListadoDto[]>([]);
ngOnInit(): void {
  this.cargarMedicos();

  const hoy = new Date();

  const fechaLimite = new Date();
  fechaLimite.setDate(hoy.getDate() + 30);

  const formatearFecha = (fecha: Date): string => {
    const anio = fecha.getFullYear();
    const mes = String(fecha.getMonth() + 1).padStart(2, '0');
    const dia = String(fecha.getDate()).padStart(2, '0');

    return `${anio}-${mes}-${dia}`;
  };

  this.fechaMinima = formatearFecha(hoy);
  this.fechaMaxima = formatearFecha(fechaLimite);
}
cargarMedicos(): void {
  this.medicosApi.obtenerMedicos().subscribe({
    next: (datos) => {
      this.medicos.set(datos);
    },
    error: (error) => {
      console.error('Error al cargar médicos:', error);
      alert('No se pudo obtener la lista de médicos.');
    },
  });
}
reservarTurno(): void {

  
if (this.idMedico === null || !this.fecha || !this.hora) {
  this.messageService.add({
    severity: 'warn',
    summary: 'Campos incompletos',
    detail: 'Por favor, seleccioná un médico, una fecha y un horario.',
  });
  return;
}

 
  this.fechaHora = `${this.fecha}T${this.hora}`;

  this.reservarTurnoApi.reservarTurno(
    this.idMedico,
    this.fechaHora
  ).subscribe({
    next: () => {
  this.messageService.add({
    severity: 'success',
    summary: 'Éxito',
    detail: '¡Turno reservado correctamente!',
  });
},
error: (error) => {
  console.error('Error al reservar turno:', error);

  const mensaje = error.error?.message;

 if (
  error.status === 400 &&
  String(mensaje).includes('El médico ya tiene un turno reservado')
){
    this.messageService.add({
      severity: 'warn',
      summary: 'Horario ocupado',
      detail: 'Este horario ya está reservado. Por favor, seleccioná otro.',
    });
   } else {
    this.messageService.add({
      severity: 'error',
      summary: 'Error',
      detail: 'No se pudo reservar el turno.',
    });
  }
}
});
}
}