import { Component, OnInit } from '@angular/core';
import { Observable} from 'rxjs';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit{
  estaColapsada: boolean = true
  
  constructor() {}

  ngOnInit(): void { }
}