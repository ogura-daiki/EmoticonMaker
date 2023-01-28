import { html } from "../Lit.js";
import LayoutManager from "./LayoutManager.js";

/**
 * @extends LayoutManager 一直線にViewを並べる
 */
const LinearLayoutManager = class extends LayoutManager {
  constructor() {
    super();
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

    let top = 0;
    for(let index=0; index<itemCount; index+=1){
      const item = this._items[index];
      
      const pos = calcSize(item, index);
      pos.top = top;
      pos.left = 0;
      top += pos.height;
      layouts[index] = pos;
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
    let end = this._items.length-1;
    while (true) {
      if (start >= end) {
        pos = end;
        break;
      }
      pos = Math.round((start + end) / 2);
      const ctop = this.#layouts[pos].top;
      const cbottom = ctop + this.#layouts[pos].height;
      if (ctop <= point && point <= cbottom)
        break;
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

export default LinearLayoutManager;