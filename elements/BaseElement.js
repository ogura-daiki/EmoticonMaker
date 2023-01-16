import { LitElement, css } from "./Lit.js";


const common = css`
:host{
  display:block;
}

.fill{
  box-sizing:border-box;
  width:100%;
  height:100%;
}

.row, .col, .centering{
  display:flex;
}
.row{
  flex-flow:row;
}
.col{
  flex-flow:column;
}
.centering{
  place-items:center;
  place-content:center;
}
.wrap{
  flex-wrap:wrap;
}
.grow{
  flex-basis:0px;
  flex-grow:1;
}
`;

class BaseElement extends LitElement{
  emit(type, detail, composed){
    this.dispatchEvent(new CustomEvent(type, {detail, composed, bubbles:composed}));
  }
  static get styles(){
    return common;
  }
}

export default BaseElement;