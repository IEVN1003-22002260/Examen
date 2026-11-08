import { Component, signal, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { initFlowbite } from 'flowbite';
import { FormsModule } from '@angular/forms';


@Component({
  imports: [RouterOutlet, FormsModule],
  standalone: true,
  selector: 'app-root',
  styleUrl: './app.css',
  templateUrl: './app.html',
})
export class App implements OnInit {

  protected readonly title = signal('Examen');

  ngOnInit(): void {
    initFlowbite();
  }
}
