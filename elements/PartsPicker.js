import { buildPreview } from "../libs/emoticon/Parts.js";
import Bodies from "../parts/Bodies.js";
import Cheeks from "../parts/Cheeks.js";
import EyeBrows from "../parts/EyeBrows.js";
import Eyes from "../parts/Eyes.js";
import Mouths from "../parts/Mouths.js";
import Outlines from "../parts/Outlines.js";
import BaseElement from "./BaseElement.js";
import { css, html, when, guard } from "./Lit.js";
import "./VirtualScroller/VirtualScroller.js";
import FlowLayoutManager from "./VirtualScroller/FlowLayoutManager.js";


const layoutManager = new FlowLayoutManager({min:150});

const defaultOptions = {
  body:Bodies.items[0],
  eyebrow:EyeBrows.items[0],
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
  padding:4px;
  user-select:none;
  overflow-y:scroll;
}

.previewItem{
  border-radius:4px;
  border:1px solid lightgray;
  width:calc(100% - 8px);
  height:min(40vmin, 100px);
  overflow:hidden;
  white-space:nowrap;

  box-sizing:border-box;
  margin:4px;
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

.partsGroupNameList{
  gap:4px;
  border-bottom:lightgray 1px solid;
  background:white;
  overflow-x:overlay;
}

.partsGroupName{
  appearance:none;
  background:transparent;
  color:black;
  border:none;
  outline:none;
  padding:8px 16px;
  height:100%;
  transition:background .3s ease-out;
  box-sizing:border-box;
  white-space:nowrap;
  user-select:none;
}
.partsGroupName.selection{
  appearance:none;
  background:rgba(0,0,0,.05);
  border-bottom:coral solid 2px;
}
`;

const loopArray = (array, count) => {
  let result = [];
  for(let c=0;c<count;c++){
    result = result.concat(array);
  }
  return result;
}

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
  selectionParts;
  constructor(){
    super();
    this.partsGroups = [
      Outlines,
      Cheeks,
      Eyes,
      Mouths,
      EyeBrows,
      Bodies,
    ];
    this.selection=this.partsGroups[0].id;
    this.selectionParts = {...defaultOptions};
  }
  render(){
    return html`
    <div class="fill col">
      <div class="row partsGroupNameList scrollOverlay">
        ${this.partsGroups.map(({id, label})=>html`
          <button
            class="partsGroupName ${this.selection === id?"selection":""}"
            @click=${e=>{
              this.selection = id; 
            }}
          >${label}</button>
        `)}
      </div>
      ${guard([this.selection], ()=>when(this.selection!= undefined, ()=>{
        const partsGroup = this.partsGroups.find(i=>i.id === this.selection);
        
        return html`
        <virtual-scroller
          class="grow previewList scrollOverlay"
          .layout=${layoutManager}
          .items=${partsGroup.items}
          .key=${(item, index)=>`${item.groupId}:${index}`}
          .renderItem=${(item, index)=>html`
            <div class="col previewItem"
              @click=${e=>{
                this.selectionParts[item.groupId] = item;
                this.emit("change", {selectionParts:this.selectionParts});
              }}
            >
              <span class="centering grow">
                <span class="content">${buildPreview({...this.selectionParts, [item.groupId]:item}, item.groupId)}</span>
              </span>
              <span class="name">${item.name}</span>
            </div>
          `}
        ></virtual-scroller>
        `;
      }))}
    </div>
    `;
  }
}
customElements.define("parts-picker", PartsPicker);