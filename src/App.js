import React from "react";
import { compose } from "ramda";
import { withProps, withState } from "recompose";

import Bar from "./Bar";
import Chart from "./Chart";
import withProcessedData from "./withProcessedData";
import "./App.css";

const colors = [
  "#8dd3c7",
  "#bebada",
  "#fb8072",
  "#80b1d3",
  "#fdb462",
  "#b3de69",
  "#fccde5",
  "#d9d9d9",
  "#bc80bd",
  "#ccebc5",
  "#ffed6f"
];

const App = ({
  breeds,
  setActiveBreeds,
  activeBreeds,
  selectedData,
  yearsMaxData,
  valuesMaxData,
  breedColors
}) => (
  <div className="App">
    <h1 className={"header"}>TOP-50 dog breeds in USA</h1>
    <Bar
      breeds={breeds}
      setActiveBreeds={setActiveBreeds}
      activeBreeds={activeBreeds}
      breedColors={breedColors}
    />
    <Chart
      data={selectedData}
      yearsMaxData={yearsMaxData}
      valuesMaxData={valuesMaxData}
    />
  </div>
);

const enhancer = compose(
  withProcessedData,
  withState("activeBreeds", "setActiveBreeds", []),
  withProps(({ data, activeBreeds, breedColors }) => ({
    breeds: Object.keys(data).sort(
      (a, b) =>
        Math.max(...data[b].map(o => o.value)) -
        Math.max(...data[a].map(o => o.value))
    ).slice(0, 50),
    yearsMaxData: Object.values(data).sort((a, b) => b.length - a.length)[0],
    valuesMaxData: activeBreeds.map(e => data[e]).sort(
      (a, b) =>
        Math.max(...b.map(o => o.value)) - Math.max(...a.map(o => o.value))
    )[0] || 10
  })),
  withProps(({ breeds }) => ({
    breedColors: breeds.reduce((o, k, i) => ({
      ...o,
      [k]: colors[i % colors.length]
    }), {}),
  })),
  withProps(({ activeBreeds, data, breedColors }) => ({
    selectedData: activeBreeds.map(breed => ({
      color: breedColors[breed],
      data: data[breed],
      breed
    })),
  })),
  withProps(({ breedColors }) => console.log(breedColors, "ACT"))
);

export default enhancer(App);
