import { DatePipe, DecimalPipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DatePicker } from 'primeng/datepicker';
import { TableModule } from 'primeng/table';
import { Tag } from 'primeng/tag';
import { MedicoApiClient } from './medico-api-client';
import { EstadoReserva, TurnoMedico } from './turno-medico-dto';
import { Template } from '../../template/template';

type SeveridadTag = 'success' | 'info' | 'warn' | 'danger' | 'secondary';

@Component({
  selector: 'app-mis-turnos-medico',
  imports: [
    DatePipe,
    DecimalPipe,
    FormsModule,
    RouterLink,
    TableModule,
    ButtonModule,
    DatePicker,
    Tag,
    Template,
  ],
  templateUrl: './mis-turnos.html',
  styleUrl: './mis-turnos.css',
})
export class MisTurnos implements OnInit {
  private readonly medicoApi: MedicoApiClient = inject(MedicoApiClient);
  private readonly messageService: MessageService = inject(MessageService);

  fecha = signal<Date | null>(new Date());
  turnos = signal<TurnoMedico[]>([]);
  cargando = signal<boolean>(false);

  ngOnInit(): void {
    this.cargarTurnos();
  }

  cambiarFecha(nuevaFecha: Date | null): void {
    this.fecha.set(nuevaFecha);
    this.cargarTurnos();
  }

  cargarTurnos(): void {
    const fecha = this.fecha();
    if (!fecha) {
      this.turnos.set([]);
      return;
    }

    this.cargando.set(true);
    this.medicoApi.obtenerTurnos(this.formatearFecha(fecha)).subscribe({
      next: (turnos) => {
        this.turnos.set(
          turnos.map((t) => ({ ...t, valor_consulta: this.aNumero(t.valor_consulta) })),
        );
        this.cargando.set(false);
      },
      error: (error: HttpErrorResponse) => {
        this.cargando.set(false);
        this.turnos.set([]);
        this.mostrarError(error, 'No se pudieron obtener los turnos');
      },
    });
  }

  marcar(turno: TurnoMedico, estado: 'ATENDIDO' | 'AUSENTE'): void {
    this.medicoApi.actualizarEstado(turno.id, estado).subscribe({
      next: (actualizado) => {
        this.turnos.update((lista) =>
          lista.map((t) => (t.id === actualizado.id ? { ...t, estado: actualizado.estado } : t)),
        );
        this.messageService.add({
          severity: 'success',
          summary: 'Turno actualizado',
          detail: `El turno quedó marcado como ${actualizado.estado}`,
        });
      },
      error: (error: HttpErrorResponse) => {
        this.mostrarError(error, 'No se pudo actualizar el turno');
      },
    });
  }

  // Solo se puede marcar un turno ACTIVO cuyo horario ya comenzó
  puedeMarcar(turno: TurnoMedico): boolean {
    return turno.estado === 'ACTIVO' && new Date(turno.fecha_hora).getTime() <= Date.now();
  }

  severidad(estado: EstadoReserva): SeveridadTag {
    switch (estado) {
      case 'ATENDIDO':
        return 'success';
      case 'AUSENTE':
        return 'warn';
      case 'CANCELADO':
        return 'danger';
      default:
        return 'info';
    }
  }

  private aNumero(valor: number | string): number {
    if (typeof valor === 'number') return valor;

    const limpio = String(valor ?? '').replace(/[^\d.,-]/g, '');
    const posSeparador = Math.max(limpio.lastIndexOf('.'), limpio.lastIndexOf(','));

    let texto: string;
    if (posSeparador !== -1 && limpio.length - posSeparador - 1 === 2) {
      // Los dos últimos dígitos son los centavos (formato money)
      const entero = limpio.slice(0, posSeparador).replace(/[.,]/g, '');
      texto = `${entero}.${limpio.slice(posSeparador + 1)}`;
    } else {
      texto = limpio.replace(/[.,]/g, '');
    }

    const numero = Number(texto);
    return Number.isNaN(numero) ? 0 : numero;
  }

  private formatearFecha(fecha: Date): string {
    const anio = fecha.getFullYear();
    const mes = String(fecha.getMonth() + 1).padStart(2, '0');
    const dia = String(fecha.getDate()).padStart(2, '0');
    return `${anio}-${mes}-${dia}`;
  }

  private mostrarError(error: HttpErrorResponse, porDefecto: string): void {
    const mensaje = error.error?.message;
    this.messageService.add({
      severity: 'error',
      summary: 'Error',
      detail: Array.isArray(mensaje) ? mensaje.join('. ') : (mensaje ?? porDefecto),
    });
  }
}
