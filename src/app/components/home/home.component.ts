import { Component, OnInit } from '@angular/core';
import { Http, Headers, RequestOptions, RequestOptionsArgs } from '@angular/http';
import * as _ from 'lodash';
import * as d3 from 'd3';
import { AuthService } from 'app/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  lambdamsg: any;
  message;
  tesoroPublico;
  records;
  currencyFormatter = d3.format('$,');
  token;

  constructor(
    private http: Http,
    private authService: AuthService,
  ) { }

  ngOnInit() {



    this.authService.token.subscribe((token) => {
      if (token) {
        this.token = token;
        this.message = 'Registrando usuario';

        const myParams = new URLSearchParams();
        myParams.append('id', '123');
        const myHeaders = new Headers({'Content-Type':'application/json', 'Authorization':'Bearer ' + token});
        const myHeaders2 = new Headers({'Content-Type':'application/json', 'Authorization':'Bearer ' + 'allow'});
        const options = new RequestOptions(<any>{ headers: myHeaders, params: myParams });
        const options2 = new RequestOptions(<any>{ headers: myHeaders2, params: myParams });

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

          /*
          Uncomment to update records in dynamoDb
          data.forEach(element => {
            this.putToDynamo(element);
          });
          */
        });

        this.http.get('https://j3qmx8agh1.execute-api.us-east-1.amazonaws.com/development/hello', options)
        .map(res => res.json())
        .subscribe(data => {
          this.lambdamsg = data;
        },
        (err) => {
          console.error(err);
        }
        );


      }
    });

  }

  _tesoroPublico(data) {
    return _.find(data, (d) => d.codInstit === '500101');
  }

  putToDynamo(d) {
    const codInstit = d.codInstit;
    const headers = new Headers();
    headers.append('Authorization', 'Bearer ' + this.token);
    const options: RequestOptionsArgs = {
      headers: headers
    };
    const item = _.omit(d, '_id');

    this.http.put(`https://j3qmx8agh1.execute-api.us-east-1.amazonaws.com/development/presupuesto/${codInstit}`,
      item,
      options
    )
    .map(res => res.json())
    .subscribe(res => {
      console.log(res);
    },
    (err) => {
      console.error(err);
    }
    );

  }

}
