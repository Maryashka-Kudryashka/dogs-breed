import { csv } from "d3";
import { withProps, withState, renderComponent, branch } from "recompose";
import { compose, flatten } from "ramda";

const withProcessedData = compose(
  withState("data", "setData"),
  withProps({
    filenames: [
      "data/2007.csv",
      "data/2008.csv",
      "data/2009.csv",
      "data/2010.csv",
      "data/2011.csv",
      "data/2012.csv",
      "data/2013.csv",
      "data/2014.csv",
      "data/2015.csv",
      "data/2016.csv",
      "data/2017.csv"
    ]
  }),
  withProps(async ({ data, setData, filenames }) => {
    if (!data) {
      let initialData = flatten(await Promise.all(filenames.map(path => csv(path))))
      let res = {}
      initialData.forEach(el => {
        const breed = el.Breed
        const year = el.ExpYear

        res[breed] = res[breed] || {}
        res[breed][year] = (res[breed][year] || 0) + 1
      })
    
      res = Object.entries(res).reduce((o, [key, val]) => {
        if (key.includes('MIX')) return {...o};
        if (key.includes('TAG')) return {...o};
        const newVal = Object.entries(val).map(([k, v]) => ({year: k, value: v}));
        return {
          ...o,
          [key]: newVal
        }
      }, {});
      setData(res)
    }
  }),
  branch(({ data }) => !data, renderComponent(() => "Loading data...")),
  withProps(({ data }) => {
    console.log(data);
  })
);

export default withProcessedData;
