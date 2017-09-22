import { Component, OnInit, OnDestroy } from '@angular/core';
import { Http, Headers, RequestOptions, RequestOptionsArgs } from '@angular/http';
import * as _ from 'lodash';
import * as d3 from 'd3';
import { AuthService } from 'app/auth.service';
import { RecordPresupuesto } from "app/interfaces/interfaces";

@Component({
  selector: 'app-presupuesto',
  templateUrl: './presupuesto.component.html',
  styleUrls: ['./presupuesto.component.css']
})
export class PresupuestoComponent implements OnInit, OnDestroy {
  [x: string]: any;
  partidasPrioridad_Pinera_SI_Bachelet_NO: any;
  partidasPrioridad_Piñera_NO_Bachelet_SI: any;
  partidasPrioridad_Piñera_SI_Bachelet_NO: any;
  partidasPrioridadSiPiñeraNoBachelet: any;
  options2: { chart: { type: string; plotBorderWidth: number; zoomType: string; }; legend: { enabled: boolean; }; title: { text: string; }; subtitle: { text: string; }; xAxis: { gridLineWidth: number; title: { text: string; }; labels: { format: string; }; plotLines: { color: string; dashStyle: string; width: number; value: number; label: { rotation: number; y: number; style: { fontStyle: string; }; text: string; }; zIndex: number; }[]; }; yAxis: { startOnTick: boolean; endOnTick: boolean; title: { text: string; }; labels: { format: string; }; maxPadding: number; plotLines: { color: string; dashStyle: string; width: number; value: number; label: { align: string; style: { fontStyle: string; }; text: string; x: number; }; zIndex: number; }[]; }; tooltip: { useHTML: boolean; headerFormat: string; pointFormat: string; footerFormat: string; followPointer: boolean; }; plotOptions: { series: { dataLabels: { enabled: boolean; format: string; }; }; }; series: { data: { x: number; y: number; z: number; name: string; country: string; }[]; }[]; };
  options: { title: { text: string; }; series: { data: number[]; }[]; };
  options3: any;
  public nav: any;
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
  chartData;

  constructor(
    private http: Http,
    private authService: AuthService,
  ) {
    this.nav = document.querySelector('nav.navbar');
    this.wrapper = document.getElementById('page-wrapper');
    this.options = {
      title : { text : 'simple chart' },
      series: [{
          data: [29.9, 71.5, 106.4, 129.2],
      }]
    };

    this.options3 = {
      title : { text : 'simple chart' },

      chart: {
        type: 'bubble'
      },
      series: [{
        data: [
            { x: 95, y: 95, z: 13.8, name: 'BE', country: 'Belgium' },
            { x: 86.5, y: 102.9, z: 14.7, name: 'DE', country: 'Germany' },
            { x: 80.8, y: 91.5, z: 15.8, name: 'FI', country: 'Finland' },
            { x: 80.4, y: 102.5, z: 12, name: 'NL', country: 'Netherlands' },
            { x: 80.3, y: 86.1, z: 11.8, name: 'SE', country: 'Sweden' },
            { x: 78.4, y: 70.1, z: 16.6, name: 'ES', country: 'Spain' },
            { x: 74.2, y: 68.5, z: 14.5, name: 'FR', country: 'France' },
            { x: 73.5, y: 83.1, z: 10, name: 'NO', country: 'Norway' },
            { x: 71, y: 93.2, z: 24.7, name: 'UK', country: 'United Kingdom' },
            { x: 69.2, y: 57.6, z: 10.4, name: 'IT', country: 'Italy' },
            { x: 68.6, y: 20, z: 16, name: 'RU', country: 'Russia' },
            { x: 65.5, y: 126.4, z: 35.3, name: 'US', country: 'United States' },
            { x: 65.4, y: 50.8, z: 28.5, name: 'HU', country: 'Hungary' },
            { x: 63.4, y: 51.8, z: 15.4, name: 'PT', country: 'Portugal' },
            { x: 64, y: 82.9, z: 31.3, name: 'NZ', country: 'New Zealand' }
        ]
    }]
    };

    this.options2 = {

          chart: {
              type: 'bubble',
              plotBorderWidth: 1,
              zoomType: 'xy'
          },

          legend: {
              enabled: false
          },

          title: {
              text: 'Sugar and fat intake per country'
          },

          subtitle: {
              text: 'Source: <a href="http://www.euromonitor.com/">Euromonitor</a> and <a href="https://data.oecd.org/">OECD</a>'
          },

          xAxis: {
              gridLineWidth: 1,
              title: {
                  text: 'Daily fat intake'
              },
              labels: {
                  format: '{value} gr'
              },
              plotLines: [{
                  color: 'black',
                  dashStyle: 'dot',
                  width: 2,
                  value: 65,
                  label: {
                      rotation: 0,
                      y: 15,
                      style: {
                          fontStyle: 'italic'
                      },
                      text: 'Safe fat intake 65g/day'
                  },
                  zIndex: 3
              }]
          },

          yAxis: {
              startOnTick: false,
              endOnTick: false,
              title: {
                  text: 'Daily sugar intake'
              },
              labels: {
                  format: '{value} gr'
              },
              maxPadding: 0.2,
              plotLines: [{
                  color: 'black',
                  dashStyle: 'dot',
                  width: 2,
                  value: 50,
                  label: {
                      align: 'right',
                      style: {
                          fontStyle: 'italic'
                      },
                      text: 'Safe sugar intake 50g/day',
                      x: -10
                  },
                  zIndex: 3
              }]
          },

          tooltip: {
              useHTML: true,
              headerFormat: '<table>',
              pointFormat: '<tr><th colspan="2"><h3>{point.country}</h3></th></tr>' +
                  '<tr><th>Fat intake:</th><td>{point.x}g</td></tr>' +
                  '<tr><th>Sugar intake:</th><td>{point.y}g</td></tr>' +
                  '<tr><th>Obesity (adults):</th><td>{point.z}%</td></tr>',
              footerFormat: '</table>',
              followPointer: true
          },

          plotOptions: {
              series: {
                  dataLabels: {
                      enabled: true,
                      format: '{point.name}'
                  }
              }
          },

          series: [{
              data: [
                  { x: 95, y: 95, z: 13.8, name: 'BE', country: 'Belgium' },
                  { x: 86.5, y: 102.9, z: 14.7, name: 'DE', country: 'Germany' },
                  { x: 80.8, y: 91.5, z: 15.8, name: 'FI', country: 'Finland' },
                  { x: 80.4, y: 102.5, z: 12, name: 'NL', country: 'Netherlands' },
                  { x: 80.3, y: 86.1, z: 11.8, name: 'SE', country: 'Sweden' },
                  { x: 78.4, y: 70.1, z: 16.6, name: 'ES', country: 'Spain' },
                  { x: 74.2, y: 68.5, z: 14.5, name: 'FR', country: 'France' },
                  { x: 73.5, y: 83.1, z: 10, name: 'NO', country: 'Norway' },
                  { x: 71, y: 93.2, z: 24.7, name: 'UK', country: 'United Kingdom' },
                  { x: 69.2, y: 57.6, z: 10.4, name: 'IT', country: 'Italy' },
                  { x: 68.6, y: 20, z: 16, name: 'RU', country: 'Russia' },
                  { x: 65.5, y: 126.4, z: 35.3, name: 'US', country: 'United States' },
                  { x: 65.4, y: 50.8, z: 28.5, name: 'HU', country: 'Hungary' },
                  { x: 63.4, y: 51.8, z: 15.4, name: 'PT', country: 'Portugal' },
                  { x: 64, y: 82.9, z: 31.3, name: 'NZ', country: 'New Zealand' }
              ]
          }]

      };
    this.chartData = [{x: 10, y: 10, z: 20}];
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
        .subscribe((data: RecordPresupuesto) => {
          this.message = null;

          this.tesoroPublico = this._tesoroPublico(data);
          this.records = data;
          _.each(this.records, (d) => {
            d.tasaReal_2010_2009 = d.tasa_2010_2009 - this.tesoroPublico['tasa_2010_2009'];
            d.tasa2010_2009_relativa = d.tasa_2010_2009 / this.tesoroPublico['tasa_2010_2009'];
            d.tasa2011_2010_relativa = d.tasa_2011_2010 / this.tesoroPublico['tasa_2011_2010'];
            d.tasa2012_2011_relativa = d.tasa_2012_2011 / this.tesoroPublico['tasa_2012_2011'];
            d.tasa2013_2012_relativa = d.tasa_2013_2012 / this.tesoroPublico['tasa_2013_2012'];
            d.tasa2014_2013_relativa = d.tasa_2014_2013 / this.tesoroPublico['tasa_2014_2013'];
            d.tasa2015_2014_relativa = d.tasa_2015_2014 / this.tesoroPublico['tasa_2015_2014'];
            d.tasa2016_2015_relativa = d.tasa_2016_2015 / this.tesoroPublico['tasa_2016_2015'];
            d.tasa2017_2016_relativa = d.tasa_2017_2016 / this.tesoroPublico['tasa_2017_2016'];
            d.tasa_piñera_relativa = (d.tasa2011_2010_relativa + d.tasa2012_2011_relativa + d.tasa2013_2012_relativa + d.tasa2014_2013_relativa) / 4;
            d.tasa_bachelet_relativa = (d.tasa2010_2009_relativa + d.tasa2015_2014_relativa + d.tasa2016_2015_relativa + d.tasa2017_2016_relativa) / 4;

            d.tasaTesoro_2010_2009 = this.tesoroPublico['tasa_2010_2009'];
            d.tasaTesoro_2011_2010 = this.tesoroPublico['tasa_2011_2010'];
            d.tasaTesoro_2012_2011 = this.tesoroPublico['tasa_2012_2011'];
            d.tasaTesoro_2013_2012 = this.tesoroPublico['tasa_2013_2012'];
            d.tasaTesoro_2014_2013 = this.tesoroPublico['tasa_2014_2013'];
            d.tasaTesoro_2015_2014 = this.tesoroPublico['tasa_2015_2014'];
            d.tasaTesoro_2016_2015 = this.tesoroPublico['tasa_2016_2015'];
            d.tasaTesoro_2017_2016 = this.tesoroPublico['tasa_2017_2016'];

          });
          this.records = _.sortBy(this.records, (d) => -d.montoPesos_2017);

          this.partidasPrioridad_Pinera_SI_Bachelet_NO = _.sortBy(_.filter(this.records, (d) =>
          d.tasa_piñera_relativa > 1 && d.tasa_bachelet_relativa < 1), d => -d.montoPesos_2017);

          this.partidasPrioridad_Pinera_NO_Bachelet_SI = _.sortBy(_.filter(this.records, (d) =>
          d.tasa_piñera_relativa < 1 && d.tasa_bachelet_relativa > 1), d => -d.montoPesos_2017);

          console.log(this.tesoroPublico);

          /*
          Uncomment to update records in dynamoDb
          data.forEach(element => {
            this.putToDynamo(element);
          });
          */
        });

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
