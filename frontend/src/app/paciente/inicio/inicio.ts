import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Template } from '../../template/template';

@Component({
  selector: 'app-inicio-paciente',
  imports: [RouterLink, Template],
  templateUrl: './inicio.html',
  styleUrl: './inicio.css',
})
export class Inicio {
  
}