import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { API_ENDPOINT_CONFIG, ApiModule } from '@arxis/api';
//from 'projects/arxis/api/src/public-api';

import { HttpClientModule } from '@angular/common/http';
// import { API_ENDPOINT_CONFIG, ApiModule } from 'projects/arxis/api/src/public-api';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    HttpClientModule,
    ApiModule.forRoot({ url: 'http://examplex2.com' })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
