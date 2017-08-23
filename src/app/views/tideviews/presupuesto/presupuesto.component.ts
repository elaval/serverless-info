import { Component, OnInit, OnDestroy } from '@angular/core';
import { Http, Headers, RequestOptions, RequestOptionsArgs } from '@angular/http';
import * as _ from 'lodash';
import * as d3 from 'd3';
import { AuthService } from 'app/auth.service';

@Component({
  selector: 'app-presupuesto',
  templateUrl: './presupuesto.component.html',
  styleUrls: ['./presupuesto.component.css']
})
export class PresupuestoComponent implements OnInit, OnDestroy {
  public nav:any;
  public wrapper:any;

  public lineChartData:Array<any> = [
    {data: [28, 48, 40, 19, 86, 27, 90], label: 'Example data 1'},
    {data: [65, 59, 80, 81, 56, 55, 40], label: 'Example data 2'},
  ];
  public lineChartLabels:Array<any> = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];
  public lineChartType:string = 'line';

  public lineChartColors:Array<any> = [
    {
      backgroundColor: "rgba(26,179,148,0.5)",
      borderColor: "rgba(26,179,148,0.7)",
      pointBackgroundColor: "rgba(26,179,148,1)",
      pointBorderColor: "#fff",
    },
    {
      backgroundColor: "rgba(220,220,220,0.5)",
      borderColor: "rgba(220,220,220,1)",
      pointBackgroundColor: "rgba(220,220,220,1)",
      pointBorderColor: "#fff",
    }
  ];

  public peityType1:string = "bar";
  public peityType2:string = "line";
  public peityOptions1:any = { fill: ["#1ab394", "#d7d7d7"], width:100};
  public peityOptions2:any = { fill: ["#1ab394", "#d7d7d7"]};
  public peityOptions3:any = { fill: '#1ab394', stroke:'#169c81'};

  lambdamsg: any;
  message;
  tesoroPublico;
  records;
  currencyFormatter = d3.format('$,');
  token;

  constructor(
    private http: Http,
    private authService: AuthService,
  ) {
    this.nav = document.querySelector('nav.navbar');
    this.wrapper = document.getElementById('page-wrapper');
  }

  ngOnInit() {

    this.nav.className += ' white-bg';
    this.wrapper.className += ' sidebar-content';


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

  public ngOnDestroy():any {
    this.nav.classList.remove("white-bg");
    this.wrapper.classList.remove("sidebar-content");
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
