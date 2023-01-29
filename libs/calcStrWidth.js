const canvas = document.createElement("canvas");
document.body.append(canvas);
canvas.style = `
width:0px;
height:0px;
position:fixed;
display:none;
`;

const widthCache = new Map();
const getStyledCache = (style) => {
  if(widthCache.has(style)){
    return widthCache.get(style);
  }
  const result = new Map();
  widthCache.set(style, result);
  return result;
}

const calcStrSize = (str, style) => {
  const cache = getStyledCache(style);
  if(cache.has(str)){
    return cache.get(str);
  }
  const ctx = canvas.getContext("2d");
  ctx.font = style;
  const result = ctx.measureText(str);
  cache.set(str, result);
  return result;
}

const findFitStrWidth = (width, str, style, max=width) => {
  let before = max;
  const history = new Set();
  let count = 1000;
  while(count > 0){
    let sizedStyle = `${before}px ${style}`;
    const calcedWidth = calcStrSize(str, sizedStyle).width;
    if(calcedWidth === width) return before;
    if(history.has(before)){
      if(calcedWidth > width) return before-1;
      return before;
    }
    history.add(before);
    before = Math.floor(before * (width / calcedWidth));
    count--;
  }
}

const findFitStrRect = (str, {width, height, font}) => {
  const widthFit = findFitStrWidth(width, str, font, width);
  let before = widthFit;
  let count = 1000;
  while(count > 0){
    let sizedStyle = `${before}px ${font.replace(/\d+px/, "")}`;
    const rect = calcStrSize(str, sizedStyle);
    const calcedHeight = rect.actualBoundingBoxAscent + rect.actualBoundingBoxDescent;
    if(calcedHeight <= height){
      return before;
    }
    before--;
    count--;
  }
}

export {calcStrSize, findFitStrWidth, findFitStrRect};