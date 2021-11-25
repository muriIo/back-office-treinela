import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { readCookie } from './services/helpers';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  constructor(private router: Router) { }

  logged: boolean = false;

  ngOnInit() {
    const token = readCookie("token");
    if (token != '') {
      this.logged = true;
      this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
        this.router.navigate(['/cursos']);
      });
    } else {
      this.logged = false;
      this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
        this.router.navigate(['/login']);
      });
    }
  }
}
