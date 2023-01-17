import { genPreview, InsertParser, InsertTarget, LeftRight, simplePartsList } from "./core.js";

const SimpleParts = (input, {option:optionModifier, partsList=simplePartsList, highlights}) => {
  return (name, ...parts) => {
    const data = input(...parts);
    return {
      ...data,
      name,
      content:(options) => genPreview(partsList, optionModifier(options, data), highlights),
    };
  }
}

const dataTo = name=>(options, data)=>({...options, [name]:data});

const Eye = SimpleParts(
  LeftRight,
  {
    option:dataTo("eye"),
    highlights:[InsertTarget.eye.left, InsertTarget.eye.right],
  }
);
const Mouth = SimpleParts(
  value=>({value}),
  {
    option:dataTo("mouth"),
    highlights:[InsertTarget.mouth],
  }
);
const Outline = SimpleParts(
  LeftRight,
  {
    option:dataTo("outline"),
    highlights:[InsertTarget.outline.left, InsertTarget.outline.right],
  }
);
const Cheek = SimpleParts(
  LeftRight,
  {
    option:dataTo("cheek"),
    highlights:[InsertTarget.cheek.left, InsertTarget.cheek.right],
  }
);

const InjectorParts = (partsName, previewPartsList=simplePartsList) => (name, inserts=[]) => {
  const data = {name};

  const {props, listKeys, list} = InsertParser(partsName, previewPartsList, inserts);
  data.content = (options) => {
    return genPreview(list, {...options, body:props}, listKeys);
  };
  return data;
}
/*
const Body = (name, inserts=[]) => {
  const body = {name};

  const {props, listKeys, list} = InsertParser("body", simplePartsList, inserts);

  body.content = (options) => {
    return genPreview(list, {...options, body:props}, listKeys);
  };
  return body;
}
*/
const Body = InjectorParts("body");

export {Eye, Mouth, Cheek, Outline, Body};