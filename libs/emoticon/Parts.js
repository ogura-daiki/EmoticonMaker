import { genPreview, Insert, InsertParser, InsertTarget, LeftRight, simplePartsList } from "./core.js";

const SimpleParts = (input, {groupId, option:optionModifier, partsList=simplePartsList, highlights}) => {
  return (name, ...parts) => {
    const data = input(...parts);
    return {
      groupId,
      ...data,
      name,
      builder:({list, options})=>({list,options:optionModifier(options, data)}),
      content:(options) => genPreview(partsList, optionModifier(options, data), highlights),
    };
  }
}

const dataTo = name=>(options, data)=>({...options, [name]:data});

const Eye = SimpleParts(
  LeftRight,
  {
    groupId:"eye",
    option:dataTo("eye"),
    highlights:[InsertTarget.eye.left, InsertTarget.eye.right],
  }
);
const Mouth = SimpleParts(
  value=>({value}),
  {
    groupId:"mouth",
    option:dataTo("mouth"),
    highlights:[InsertTarget.mouth],
  }
);
const Outline = SimpleParts(
  LeftRight,
  {
    groupId:"outline",
    option:dataTo("outline"),
    highlights:[InsertTarget.outline.left, InsertTarget.outline.right],
  }
);
const Cheek = SimpleParts(
  LeftRight,
  {
    groupId:"cheek",
    option:dataTo("cheek"),
    highlights:[InsertTarget.cheek.left, InsertTarget.cheek.right],
  }
);

const InjectorParts = (partsName, previewPartsList=simplePartsList) => (name, inserts=[]) => {
  const data = {groupId:partsName, name};

  const {props, listKeys, list} = InsertParser(partsName, previewPartsList, inserts);
  data.content = (options) => {
    return genPreview(list, {...options, [partsName]:props}, listKeys);
  };
  data.builder = ({list, options})=>{
    const {props, list:appended} = InsertParser(partsName, [...list], inserts);
    return {list:appended, options:{...options, [partsName]:props}};
  }
  return data;
}
const Body = InjectorParts("body");
const Eyebrow = (()=>{
  return (name, {ll, lr, rl, rr}) => {
    const fn = InjectorParts("eyebrow");
    const pairs = [
      [
        [ll, ["left", "Before"]],
        [lr, ["left", "After"]],
      ],
      [
        [rl, ["right", "Before"]],
        [rr, ["right", "After"]],
      ],
    ];
    const inserts = pairs.map(
      a=>(
        ([value, [lr, ba]])=>Insert[ba](value, InsertTarget.eye[lr])
      )(
        typeof a[0][0]==="string"?a[0]:a[1]
      )
    );
    const result = fn(name, inserts);
    return result;
  }
})();

const sortedGroupNames = [
  "outline", "eye", "mouth", "cheek", "eyebrow", "body"
];

const buildResult = (selected) => {
  console.log(selected);
  const {list, options} = sortedGroupNames.reduce((c, name)=>{
    return selected[name].builder(c);
  }, {list:[...simplePartsList], options:{}});
  console.log({list, options})
  return genPreview(list, options);
};

export {Eye, Mouth, Cheek, Outline, Eyebrow, Body, sortedGroupNames, buildResult};