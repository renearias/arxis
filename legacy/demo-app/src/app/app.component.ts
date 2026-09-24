import { Component } from '@angular/core';
import { ApiService } from 'projects/arxis/api/src/public-api';
import { ArxisIonicFireStoreAuthService } from 'projects/arxis/fireauth/src/services/user/ionic-firestore-auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'arxis';
  constructor(api: ApiService, arxisFireAuth: ArxisIonicFireStoreAuthService) {
    arxisFireAuth.logout();
    arxisFireAuth
      .login({ email: 'renearias@arxis.la', password: '123456' })
      .then(response => {
        console.log('login esta funcionando', response);
        console.log('login despues', arxisFireAuth.currentUser);
        // arxisFireAuth.logout().then((()=>{
        //   console.log('logout despues', arxisFireAuth.currentUser)
        // }));
      })
      .catch(e => {
        console.log('ocurrio error en auth', e);
      });
  }
}
