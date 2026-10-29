export interface ReservaAdministrador {
  id: number;
  idMedico: number;
  fechaHora: string;
  estado: string;
  medico: string;
  paciente: string;
  valorConsulta: number;
}