import { findFitStrWidth } from "../libs/calcStrWidth.js";
import BaseElement from "./BaseElement.js";
import { css, html } from "./Lit.js";

const style = css`
#input{
  appearance:none;
  display:block;
  width:100%;
  height:100%;
  padding:0px;
  margin:0px;
  border:none;
  outline:none;
  text-align:center;
}
`;

class FittingInput extends BaseElement {
  static get styles(){
    return [super.styles, style];
  }

  static get properties(){
    return {
      value:{type:String},
    };
  }
  constructor(){
    super();
    this.value = "";
  }
  connectedCallback(){
    super.connectedCallback();
    new ResizeObserver((entries)=>{
      this.requestUpdate();
    }).observe(this);
  }
  render(){
    let input = this.renderRoot.querySelector("#input");
    if(!input){
      input = this;
    }
    const fontSize = findFitStrWidth(this.clientWidth, this.value||"F", getComputedStyle(this).fontFamily);
    return html`
    <input
      id="input"
      style="font-size:${fontSize}px"
      .value=${this.value}
      @input=${e=>this.value = e.target.value}
    >
    `;
  }
  firstUpdated(){
    this.requestUpdate();
  }
}
customElements.define("fit-input", FittingInput);