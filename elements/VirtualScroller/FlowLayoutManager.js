import { html } from "../Lit.js";
import LayoutManager from "./LayoutManager.js";

/**
 * @extends LayoutManager 一直線にViewを並べる
 */
const FlowLayoutManager = class extends LayoutManager {

  #sizeRange={};
  constructor({min, max}) {
    super();
    this.#sizeRange = {min, max};
  }

  #view;

  /**
   * アイテムを表示するHTML要素を設定する
   * @param {HTMLElement} recyclerView 
   */
  attachedRecyclerView(recyclerView) {
    super.attachedRecyclerView(recyclerView);
    //Viewを設定
    this.#view = recyclerView;
  }

  /**
   * 設定されている表示先Viewへの表示を解除する
   */
  detachedRecyclerView(recyclerView) {
    super.detachedRecyclerView(recyclerView);
    this.#view = null;
  }
  
  #getRowItems(){
    const {width} = this.#view.contentSize;
    const count = Math.max(1, Math.floor(width/(this.#sizeRange.min||this.#sizeRange.max||width)));
    const size = Math.min(Math.max(this.#sizeRange.min, width/count), this.#sizeRange.max||Math.max(width, this.#sizeRange.min));
    return {count, size};
  }

  #layouts=[];
  _calcAll() {
    const itemCount = this._items.length;
    const layouts = new Array(itemCount);

    const uniqueSizes = new Map();
    const calcSize = (item, index) => {
      //同じサイズのものがないか確認
      for(const [uniqueIndex, uniqueSize] of uniqueSizes.entries()){
        if(this.#view.equalsItemSize({item, index}, {item:this._items[uniqueIndex], index:uniqueIndex})){
          return {...uniqueSize};
        }
      }

      const size = this.#view._calcSize(item, index);
      uniqueSizes.set(index, size);
      return size;
    }

    const {count:rowItemCount, size:itemWidth} = this.#getRowItems();

    let top = 0;
    for(let index=0; index<itemCount; index+=rowItemCount){
      const rowPositions = [];
      let maxHeight = 0;
      for(let rowIdx=0; rowIdx<rowItemCount;rowIdx+=1){
        const item = this._items[index+rowIdx];
        if(!item) break;

        const pos = calcSize(item, index);
        //横幅を上書き
        pos.width = itemWidth;
        pos.top = top;
        pos.left = itemWidth * rowIdx;
        rowPositions.push(pos);

        if(maxHeight < pos.height){
          maxHeight = pos.height;
        }
        
        layouts[index+rowIdx] = pos;
      }
      //高さを一番高いものに揃える
      rowPositions.forEach(pos=>pos.height = maxHeight);
      top += maxHeight;
    }

    this.#layouts = layouts;
  }

  renderSlot(item, key, index){
    const layout = this.#layouts[index];
    return html`
    <slot
      name=${key}
      style="
        display:block;
        position:absolute;
        top:${layout.top}px;
        left:${layout.left}px;
        width:${layout.width}px;
        height:${layout.height}px
      "
    ></slot>`;
  }

  /**
   * 
   * @param {Number} point 
   * @returns {Array}
   */
  _calcIndex(point) {
    let pos;
    let start = 0;
    let end = this._items.length - 1;
    
    const {count:rowItemCount, size:rowItemSize} = this.#getRowItems();

    while (true) {
      if (start >= end) {
        pos = end;
        break;
      }
      pos = Math.round((start + end) / 2);
      const ctop = this.#layouts[pos].top;
      const cbottom = ctop + this.#layouts[pos].height;
      if (ctop <= point && point <= cbottom){
        pos = Math.max(0, pos-(pos % rowItemCount));
        break;
      }
      else if (point < ctop)
        end = pos - 1;
      else
        start = pos + 1;
    }
    return { pos, top: this.#layouts[pos].top }
  }

  getHeight(){
    const last = this.#layouts[this.#layouts.length-1];
    return last.top + last.height;
  }
}

export default FlowLayoutManager;