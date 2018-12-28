import React from "react";
import { withHandlers } from "recompose";
import "./Bar.css"

const Bar = ({ breeds, toggle, breedColors, activeBreeds }) => (
  <div className={"breed-container"}>
    {breeds.map(breed => (
      <div className={"breed"} style={{background: activeBreeds.includes(breed) ? breedColors[breed] : ""}} onClick={() => toggle(breed)}>{breed}</div>
    ))}
  </div>
)

const enhancer = withHandlers({
    toggle: ({activeBreeds, setActiveBreeds}) => breed => {
        console.log(breed);
        let index = activeBreeds.indexOf(breed)
        let res = [...activeBreeds]
        if (index !== -1) {
            res.splice(index, 1)
        } else {
            res.push(breed)
        }
        setActiveBreeds(res);
    }
})

export default enhancer(Bar)
