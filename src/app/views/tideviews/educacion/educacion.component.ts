import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Http, Headers, RequestOptions, RequestOptionsArgs } from '@angular/http';
import { CompleterService, CompleterData, LocalData } from 'ng2-completer';
import * as _ from 'lodash';
import * as d3 from 'd3';
import { DSVParsedArray, DSVRowString } from 'd3';
import { AuthService } from '../../../auth.service';


@Component({
  selector: 'app-educacion',
  templateUrl: './educacion.component.html',
  styleUrls: ['./educacion.component.css']
})
export class EducacionComponent implements OnInit {
  myrbd: any;
  lambdamsg: any;
  message: string;
  token: any;
  relatedSchools2016: any;
  relatedSchools2008: any;
  schoolData2008: Object;
  directorioService: LocalData;
  directorio: DSVParsedArray<DSVRowString>;
  relatedSchools: any;
  rbd;
  relatedSchoolsYear = 2008;

  schoolData;

  protected searchStr: string;
  protected dataService: CompleterData;


  constructor(
    private http: HttpClient,
    private httpRaw: Http,
    private completerService: CompleterService,
    private authService: AuthService
  ) {
    this.httpRaw.get('assets/data/establecimientos_2012_8.txt')
    .map((d) => {
      return d3.tsvParse(d['_body']);
    })
    .subscribe((d) => {
      this.directorio = d;
      this.directorioService = completerService.local(this.directorio, 'NOM_RBD,RBD,NOM_COM_RBD', 'NOM_RBD,RBD,NOM_COM_RBD');

      this.rbd = _.sample(this.directorio).RBD;
      this.getDataForSchool(this.rbd);
    });
  }

  ngOnInit() {
  }

  getDataForSchool2(rbd) {
    this.schoolData = this.directorio.find(d => +d.RBD === +rbd);
    this.relatedSchools2008 = [];
    this.relatedSchools2016 = [];
    this.http.get(`https://wt-867ca35bffcc22ad4896795f6d081535-0.run.webtask.io/students_flow?rbd=${rbd}&relatedSchoolsYear=2008`)
    .subscribe((data) => {
      this.relatedSchools2008 = _.sortBy(data['RELATED_SCHOOLS'], (d) => -d['NUMERO_ESTUDIANTES']);
      _.each(this.relatedSchools2008, (d) => {
        if (this.directorio.find(e => +e.RBD === +d.RBD)) {
          d.TIENE_8 = true;
        } else {
          d.TIENE_8 = false;
        }
      });
    });
    this.http.get(`https://wt-867ca35bffcc22ad4896795f6d081535-0.run.webtask.io/students_flow?rbd=${rbd}&relatedSchoolsYear=2016`)
    .subscribe((data) => {
      this.relatedSchools2016 = _.sortBy(data['RELATED_SCHOOLS'], (d) => -d['NUMERO_ESTUDIANTES']);
      _.each(this.relatedSchools2016, (d) => {
        if (this.directorio.find(e => +e.RBD === +d.RBD)) {
          d.TIENE_8 = true;
        } else {
          d.TIENE_8 = false;
        }
      });
    });

    this.authService.token.subscribe((token) => {
      if (token) {
        this.token = token;
        this.message = 'Registrando usuario';

        const myParams = new URLSearchParams();
        const myHeaders = new Headers({'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token});
        const options = new RequestOptions(<any>{ headers: myHeaders, params: myParams });

        this.message = 'Obteniendo datos de presupuesto';


        this.httpRaw.get('https://j3qmx8agh1.execute-api.us-east-1.amazonaws.com/development/schoolsflow/5_2012_8/2008', options)
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

  getDataForSchool(rbd) {
    if (this.directorio.find(d => +d.RBD === +rbd)) {
      this.schoolData = this.directorio.find(d => +d.RBD === +rbd);
      this.relatedSchools2008 = [];
      this.relatedSchools2016 = [];

      this.authService.token.subscribe((token) => {
        if (token) {
          this.token = token;
          this.message = 'Registrando usuario';

          const myParams = new URLSearchParams();
          const myHeaders = new Headers({'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token});
          const options = new RequestOptions(<any>{ headers: myHeaders, params: myParams });

          this.message = 'Obteniendo datos de presupuesto';

          this.httpRaw.get(`https://j3qmx8agh1.execute-api.us-east-1.amazonaws.com/development/schoolsflow/${rbd}_2012_8/2008`, options)
          .map(res => res.json())
          .subscribe(data => {
            this.relatedSchools2008 = _.sortBy(data['RELATED_SCHOOLS'], (d) => -d['NUMERO_ESTUDIANTES']);
            _.each(this.relatedSchools2008, (d) => {
              if (this.directorio.find(e => +e.RBD === +d.RBD)) {
                d.TIENE_8 = true;
              } else {
                d.TIENE_8 = false;
              }
            });
          },
          (err) => {
            console.error(err);
          }
          );

          this.httpRaw.get(`https://j3qmx8agh1.execute-api.us-east-1.amazonaws.com/development/schoolsflow/${rbd}_2012_8/2016`, options)
          .map(res => res.json())
          .subscribe(data => {
            this.relatedSchools2016 = _.sortBy(data['RELATED_SCHOOLS'], (d) => -d['NUMERO_ESTUDIANTES']);
            _.each(this.relatedSchools2016, (d) => {
              if (this.directorio.find(e => +e.RBD === +d.RBD)) {
                d.TIENE_8 = true;
              } else {
                d.TIENE_8 = false;
              }
            });
          },
          (err) => {
            console.error(err);
          }
          );

        }
      });
    } else {
      alert('Ese establecimiento no tenía estudiantes en 8º Básico en 2012');
    }
    this.myrbd = null;
  }

  onSelected(evt) {
    this.rbd = evt.originalObject.RBD;
    this.getDataForSchool(this.rbd)
  }

}
