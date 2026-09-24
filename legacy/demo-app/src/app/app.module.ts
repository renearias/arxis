import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { ApiModule } from 'projects/arxis/api/src/public-api';
import { ArxisFireAuthModule } from 'projects/arxis/fireauth/src/public-api';

import { HttpClientModule } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    HttpClientModule,
    ApiModule.forRoot({ url: 'http://examplex2.com' }),
    ArxisFireAuthModule.forRoot(environment.firebase)
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
