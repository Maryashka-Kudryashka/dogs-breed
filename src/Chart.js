import React from "react";
import { withProps, lifecycle } from "recompose";
import { compose } from "ramda";
import * as d3 from "d3";

const Chart = ({ width, height, margin }) => {
  return (
    <svg
      width={width + margin.left + margin.right}
      height={height + margin.bottom + margin.top}
      transform={"translate(" + margin.left + "," + margin.top + ")"}
      style={{ marginLeft: "10px", overflow: "visible" }}
    />
  );
};

const enhancedChart = compose(
  withProps({
    margin: { top: 20, right: 20, bottom: 30, left: 50 }
  }),
  withProps(({ margin }) => ({
    width: 800 - margin.left - margin.right,
    height: 500 - margin.top - margin.bottom
  })),
  withProps(({ width, height, yearsMaxData, valuesMaxData }) => ({
    x: d3
      .scaleLinear()
      .range([0, width])
      .domain(
        d3.extent(yearsMaxData, function(d) {
          return d.year;
        })
      ),
    y: d3
      .scaleLinear()
      .range([height, 0])
      .domain([
        0,
        d3.max(valuesMaxData, function(d) {
          return d.value;
        })
      ])
  })),
  withProps(({ x, y }) => ({
    valueline: d3
      .line()
      .defined(d => !isNaN(d.value))
      .curve(d3.curveMonotoneX)
      .x(function(d) {
        return x(d.year);
      })
      .y(function(d) {
        return y(d.value);
      })
  })),
  lifecycle({
    componentDidMount() {
      d3.selectAll("path").remove();
      d3.selectAll("g").remove();
      d3.selectAll('text').remove();
      this.props.data.forEach(el => {
        d3.select("svg")
          .append("path")
          .datum(el.data)
          .attr("fill", "none")
          .attr("stroke", el.color)
          .attr("stroke-width", 3)
          .attr("stroke-linejoin", "round")
          .attr("stroke-linecap", "round")
          .attr("d", this.props.valueline);

        d3.select('svg')
          // .enter()
          .append("text")
          .html(_ => el.data.breed)
          .attr("fill", _ => el.data.color)
          .attr("alignment-baseline", "middle")
          .attr("x", this.props.width)
          .attr("dx", ".5em")
          .attr("y", d => this.props.y(el.data.value))
          .style("font-size", "12px");
      });

      // Add the X Axis
      d3.select("svg")
        .append("g")
        .attr("transform", "translate(0," + this.props.height + ")")
        .call(d3.axisBottom(this.props.x).tickFormat(d3.format(".10")));

      // Add the Y Axis
      d3.select("svg")
        .append("g")
        .call(d3.axisLeft(this.props.y));
    },
    componentDidUpdate() {
      d3.selectAll("g").remove();
      d3.selectAll("path").remove();
      d3.selectAll("text").remove();
      this.props.data.forEach(el => {

        d3.select("svg")
          .append("path")
          .datum(el.data)
          .attr("fill", "none")
          .attr("stroke", el.color)
          .attr("stroke-width", 3)
          .attr("stroke-linejoin", "round")
          .attr("stroke-linecap", "round")
          .attr("d", this.props.valueline);
        console.log(el.data, '1');
        let y = el.data[el.data.length - 1].value;
        console.log(y, '2')
          d3.select('svg')
          // .enter()
          .append("text")
          .html(_ => el.breed)
          .attr("fill", _ => el.color)
          .attr("alignment-baseline", "middle")
          .attr("x", this.props.width)
          .attr("dx", ".5em")
          .attr("y", d => this.props.y(y))
          .style("font-size", "12px");

      });

      // Add the X Axis
      d3.select("svg")
        .append("g")
        .attr("transform", "translate(0," + this.props.height + ")")
        .call(d3.axisBottom(this.props.x).tickFormat(d3.format(".10")));

      // Add the Y Axis
      d3.select("svg")
        .append("g")
        .call(d3.axisLeft(this.props.y));
    }
  })
)(Chart);

export default enhancedChart;
