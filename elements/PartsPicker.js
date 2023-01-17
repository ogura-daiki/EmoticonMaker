import Bodies from "../parts/Bodies.js";
import Cheeks from "../parts/Cheeks.js";
import Eyes from "../parts/Eyes.js";
import Mouths from "../parts/Mouths.js";
import Outlines from "../parts/Outlines.js";
import BaseElement from "./BaseElement.js";
import { css, html, when } from "./Lit.js";

const defaultOptions = {
  body:Bodies.items[0],
  outline:Outlines.items[0],
  cheek:Cheeks.items[0],
  eye:Eyes.items[0],
  mouth:Mouths.items[0],
};

const style = css`
:host{
  display:flex;
  flex-flow:column;
}
.previewList{
  padding:8px;
  gap:8px;
  user-select:none;
  overflow-y:scroll;
  align-items:start;

  display:grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  place-content:start;
}

.previewItem{
  border-radius:4px;
  border:1px solid lightgray;
  width:100%;
  height:min(40vmin, 100px);
  overflow:hidden;
  white-space:nowrap;
}
.previewItem .content{
  color:lightgray;
}
.previewItem .content>.highlight{
  color:black;
}
.previewItem .content>.lowlight{
  color:black;
  opacity:0.2;
}
.previewItem>.name{
  padding:2px 8px;
  border-top:1px solid lightgray;
  background:white;
  font-size:0.8rem;
}
`;



class PartsPicker extends BaseElement {
  static get styles(){
    return [super.styles, style];
  }
  static get properties(){
    return {
      partsGroups:{type:Array},
      selection:{type:Number},
    };
  }
  #selectionParts;
  constructor(){
    super();
    this.partsGroups = [
      Outlines,
      Cheeks,
      Eyes,
      Mouths,
      Bodies,
    ];
    this.selection=this.partsGroups[0].id;
    this.#selectionParts = {...defaultOptions};
  }
  render(){
    return html`
    <div class="fill col">
      <div class="row" style="gap:4px;padding:4px;border-bottom:lightgray 1px solid;background:white;">
        ${this.partsGroups.map(({id, label})=>html`
          <button
            @click=${e=>{
              this.selection = id; 
            }}
          >${label}</button>
        `)}
      </div>
      <div class="grow row wrap previewList">
      ${when(this.selection!=undefined, ()=>{
        const partsGroup = this.partsGroups.find(i=>i.id === this.selection);
        return partsGroup.items.map(item=>html`
          <div class="col previewItem" @click=${e=>{
            this.#selectionParts[partsGroup.id] = item;
            this.emit("change", {selectionParts:this.#selectionParts});
          }}>
            <span class="centering grow">
              <span class="content">${item.content(this.#selectionParts)}</span>
            </span>
            <span class="name">${item.name}</span>
          </div>
        `)
      })}
      </div>
    </div>
    `;
  }
}
customElements.define("parts-picker", PartsPicker);