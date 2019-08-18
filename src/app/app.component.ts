import { Component } from '@angular/core';
import { ApiService } from 'projects/arxis/api/src/public-api';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'arxis';
  constructor(api: ApiService) {
    console.log('ApiService', api);
  }
}
