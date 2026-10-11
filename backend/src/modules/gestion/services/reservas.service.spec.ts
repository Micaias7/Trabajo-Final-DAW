import { BadRequestException } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Test } from '@nestjs/testing';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { Usuario } from '../../auth/entities/usuario.entity.js';
import { EstadosReservasEnum } from '../enums/estados-reservas.enum.js';
import { Reserva } from '../entities/reserva.entity.js';
import { MedicosService } from './medicos.service.js';
import { ReservasService } from './reservas.service.js';
import { RolesUsuariosEnum } from '../../auth/enums/roles-usuarios.enum.js';

describe('ReservasService.cancelarReserva', () => {
    const ahora = new Date(2030, 0, 1, 12);
    const repository = { findOne: vi.fn(), save: vi.fn() };
    let service: ReservasService;

    beforeEach(async () => {
        vi.useFakeTimers();
        vi.setSystemTime(ahora);

        const module = await Test.createTestingModule({
            providers: [
                ReservasService,
                { provide: getRepositoryToken(Reserva), useValue: repository },
                { provide: getRepositoryToken(Usuario), useValue: {} },
                { provide: MedicosService, useValue: {} }
            ]
        }).compile();

        service = module.get(ReservasService);
        repository.findOne.mockReset();
        repository.save.mockReset();
    });

    afterEach(() => vi.useRealTimers());

    it.each([
        { rol: RolesUsuariosEnum.PACIENTE, fecha: new Date(2030, 0, 2, 9), permite: true },
        { rol: RolesUsuariosEnum.PACIENTE, fecha: new Date(2030, 0, 1, 18), permite: false },
        { rol: RolesUsuariosEnum.ADMINISTRADOR, fecha: new Date(ahora.getTime() + 1), permite: true },
        { rol: RolesUsuariosEnum.ADMINISTRADOR, fecha: ahora, permite: false }
    ])('aplica la regla de cancelación para $rol', async ({ rol, fecha, permite }) => {
        const reserva = {
            id: 42,
            fecha_hora: fecha.toISOString(),
            estado: EstadosReservasEnum.ACTIVO
        } as Reserva;
        repository.findOne.mockResolvedValue(reserva);

        const resultado = service.cancelarReserva(7, 42, rol);

        if (permite) {
            await expect(resultado).resolves.toEqual({ id: 42 });
            expect(repository.save).toHaveBeenCalledWith(reserva);
        } else {
            await expect(resultado).rejects.toThrow(BadRequestException);
            expect(repository.save).not.toHaveBeenCalled();
        }
    });
});
