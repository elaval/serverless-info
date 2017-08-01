import { Component, OnInit } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import * as _ from 'lodash';
import * as d3 from 'd3';
import { AuthService } from 'app/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  message;
  tesoroPublico;
  records;
  currencyFormatter = d3.format('$,');

  constructor(
    private http: Http,
    private authService: AuthService,
  ) { }

  ngOnInit() {

    this.authService.token.subscribe((token) => {
      if (token) {
        this.message = 'Registrando usuario';

        const myParams = new URLSearchParams();
        myParams.append('id', '123');
        const myHeaders = new Headers({'Content-Type':'application/json', 'Authorization':'Bearer ' + token});
        const options = new RequestOptions(<any>{ headers: myHeaders, params: myParams });

        this.message = 'Obteniendo datos de presupuesto';

        this.http.get('https://wt-867ca35bffcc22ad4896795f6d081535-0.run.webtask.io/presupuesto', options)
        .map(res => res.json())
        .subscribe(data => {
          this.message = null;

          this.tesoroPublico = this._tesoroPublico(data);
          this.records = data;
          _.each(this.records, (d) => d.tasaReal_2010_2009 = d.tasa_2010_2009 - this.tesoroPublico['tasa_2010_2009'])
          this.records = _.sortBy(this.records, (d) => -d.tasaReal_2010_2009);
          console.log(data);
        });
      }
    });

  }

  _tesoroPublico(data) {
    return _.find(data, (d) => d.codInstit === '500101');
  }

}
