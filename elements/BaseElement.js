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

.scrollOverlay::-webkit-scrollbar {
  width:4px;
  height:4px;
}
/*スクロールバーの軌道*/
.scrollOverlay::-webkit-scrollbar-track {
  border-radius: 10px;
  box-shadow: inset 0 0 6px rgba(0, 0, 0, .1);
}

/*スクロールバーの動く部分*/
.scrollOverlay::-webkit-scrollbar-thumb {
  background-color: rgba(200,200,200, .5);
  border-radius: 10px;
  box-shadow:0 0 0 1px rgba(255, 255, 255, .3);
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