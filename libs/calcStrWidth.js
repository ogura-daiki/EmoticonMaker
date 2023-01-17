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

const calcStrWidth = (str, style) => {
  const cache = getStyledCache(style);
  if(cache.has(str)){
    return cache.get(str);
  }
  const ctx = canvas.getContext("2d");
  ctx.font = style;
  const result = ctx.measureText(str).width;
  cache.set(str, result);
  return result;
}

const findFitStrWidth = (width, str, style, max=width) => {
  let before = max;
  const history = new Set();
  let count = 1000;
  while(count > 0){
    let sizedStyle = `${before}px ${style}`;
    const calcedWidth = calcStrWidth(str, sizedStyle);
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

export {calcStrWidth, findFitStrWidth};