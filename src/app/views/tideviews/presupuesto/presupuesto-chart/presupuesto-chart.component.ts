import { Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { window } from 'rxjs/operator/window';
import { any } from 'codelyzer/util/function';
import * as d3 from 'd3';
import * as _ from 'lodash';

@Component({
  selector: 'app-presupuesto-chart',
  templateUrl: './presupuesto-chart.component.html',
  styleUrls: ['./presupuesto-chart.component.css']
})
export class PresupuestoChartComponent implements OnInit, OnChanges {
  yAxis: any;
  xAxis: any;
  zoom: any;
  color: any;
  yAxisElem: any;
  xAxisElem: any;
  sizeScale: any;
  yScale: any;
  xScale: any;

  @Output() selectItem = new EventEmitter();

  @Input()
  data;

  @Input()
  margin = {
    left: 50,
    right: 10,
    top: 10,
    bottom: 50
  };
  // Explicitly define height for our content (svg element height addstop/bottom margins)
  @Input()
  height = 500;

  width = 500; // Width will be adjusted to the parents width

  myId; // Random ID used to uniquely identify this object (used in resize event handler)

  svgContainer: d3.Selection<d3.BaseType, {}, null, undefined>;  // <svg>
  mainContainer: d3.Selection<d3.BaseType, {}, null, undefined>; // Root <g> element within <svg>

  initialised = false;

  constructor(
    protected elementRef: ElementRef
  ) { }

  ngOnInit() {
    this.d3Init();
    this.initialised = true;
    this.render();
  }

  /**
   * Initializes / creates main svg containers and resizing logic
   *
   *
   * @memberOf D3MasterComponent
   */
  d3Init() {
    this.margin.right = this.margin.right || 10;
    this.margin.left = this.margin.left || 10;
    this.margin.top = this.margin.top || 10;
    this.margin.bottom = this.margin.bottom ||10;

    this.zoom = d3.zoom()
    .scaleExtent([1, 40])
    .translateExtent([[-100, -100], [this.width + 90, this.height + 100]])
    .on('zoom', this.zoomed.bind(this));

    this.myId = this.guidGenerator();
    this.svgContainer = d3.select(this.elementRef.nativeElement).append('svg');
    this.svgContainer
      .attr('width', this.width + this.margin.left + this.margin.right)
      .attr('height', this.height + this.margin.top + this.margin.bottom)
      .call(this.zoom)

    this.mainContainer = this.svgContainer.append('g')
      .attr('transform', `translate(${this.margin.left},${this.margin.top})`);

    this.xScale = d3.scaleLinear();
    this.yScale = d3.scaleLinear();
    this.sizeScale = d3.scaleLinear();

    this.xAxis = d3.axisBottom(this.xScale);
    this.yAxis = d3.axisLeft(this.yScale);

    this.xAxisElem = this.mainContainer.append('g')
      .attr('class', 'xAxis');

    this.yAxisElem = this.mainContainer.append('g')
      .attr('class', 'yAxis');

    this.updateContainerSize();

    this.color = d3.scaleOrdinal(d3.schemeCategory10);



    // Adjust element size on window resize
    /*d3.select(window)
    .on('resize.d3element' + this.myId, () => {
      this.updateContainerSize();
      this.render();
    });
    */
  }

  guidGenerator() {
      const S4 = function() {
        // tslint:disable-next-line:no-bitwise
        return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
      };
      return (S4() + S4() + '-' + S4() + '-' + S4() + '-' + S4() + '-' + S4() + S4() + S4());
  }

  updateContainerSize() {
    // Get the actual width of the parent Node
    const myNode: HTMLElement = <HTMLElement>this.svgContainer.node();
    const parentNode: HTMLElement = <HTMLElement>myNode.parentNode.parentNode;
    const parentStyle = getComputedStyle(parentNode);
    const paddingLeft = parseFloat(parentStyle.paddingLeft);
    const paddingRight = parseFloat(parentStyle.paddingRight);

    const width = parentNode.getBoundingClientRect().width - paddingLeft - paddingRight;

    this.width =  width - this.margin.left - this.margin.right;
    this.svgContainer
      .attr('width', this.width + this.margin.left + this.margin.right)
      .attr('height', this.height + this.margin.top + this.margin.bottom);

    this.mainContainer
      .attr('transfrom', `translate(${this.margin.left},${this.margin.top})`);

  }

  ngOnChanges(changes: SimpleChanges) {
    if (this.svgContainer) { this.updateContainerSize();}
    this.render();
  }

  /**
   * Modifies the svg margins after the element has been instnatiated
   *
   * e.g. this.setMargin({top:50})
   *
   * @param {any} margin
   *
   * @memberOf D3MasterComponent
   */
  setMargin(margin) {
    if (margin.top) { this.margin.top = margin.top; };
    if (margin.bottom) { this.margin.bottom = margin.bottom; };
    if (margin.left) { this.margin.left = margin.left; };
    if (margin.right) { this.margin.right = margin.right; };

    this.updateContainerSize();
    this.render();
  }


  /**
   * Does the actual rendering of the DOM elements, assuming the existance of this.mainContainer
   *
   * @abstract
   *
   * @memberOf D3MasterComponent
   */
  render() {
    if (this.data && this.initialised) {
      // Exclude 500101 (Tesoro Publico)
      const data = _.filter(this.data, (d) => d.codInstit !== '500101');

      const yExtent = d3.extent(data, (d) => d['tasa_piñera_relativa']);
      const xExtent = d3.extent(data, (d) => d['tasa_bachelet_relativa']);
      const sizeExtent = d3.extent(data, (d) => d['montoPesos_2017']);

      this.xScale.domain(xExtent).range([0, this.width]);
      this.yScale.domain(yExtent).range([this.height, 0]);
      this.sizeScale.domain(sizeExtent).range([3, 20]);


      this.xAxis.scale(this.xScale);
      this.yAxis.scale(this.yScale);

      let bubbles = this.mainContainer.selectAll('.bubble')
      .data(data);

      const newBubbles = bubbles.enter()
      .append('g');

      newBubbles.append('circle');

      bubbles = newBubbles
      .merge(bubbles);

      bubbles
        .attr('transform', (d) => `translate(${this.xScale(d['tasa_bachelet_relativa'])}, ${this.yScale(d['tasa_piñera_relativa'])})`);

      bubbles.selectAll('circle')
      .attr('r', (d) => this.sizeScale(d['montoPesos_2017']))
      .attr('cx', 0)
      .attr('cy', 0)
      .attr('opacity', 0.5)
      .attr('stroke-width', 1)
      .attr('stroke', 'grey')
      .attr('fill', d => this.color(d['partida']))
      .append('title')
        .text( d => d['programa']);

      this.xAxisElem
      .attr('transform', 'translate(0,' + this.yScale(1) + ')')
      .call(this.xAxis);


      // Add the Y Axis
      this.yAxisElem
      .attr('transform', 'translate(' + this.xScale(1) + ',0)')
      .call(this.yAxis);

    }

  }

  zoomed() {
    this.mainContainer.attr("transform", d3.event.transform);
    //this.xAxisElem.call(this.xAxis.scale(d3.event.transform.rescaleX(this.xScale)));
    //this.yAxisElem.call(this.yAxis.scale(d3.event.transform.rescaleY(this.yScale)));
  }

}

