import { LitElement, html, css, repeat, render } from 'https://cdn.jsdelivr.net/gh/lit/dist@2/all/lit-all.min.js';

const style = css`
  :host{
    display:block;
    /* background:rgba(0,0,0,.1); */
    position:relative;
    overflow-y:auto;
  }
  #spacer{
    width:100%;
    height:100%;
    /* background:rgba(0,0,0,.2); */
  }
  #contents{
    width:100%;
    height:100%;
    position:absolute;
    top:0px;
    left:0px;
    contain:layout;
  }
`;

class LinearLayout {
  constructor({vertical=true}={}){
    this.vertical = vertical;
  }

  getSumSize(items, calcItem){
    const length = items.length;
    let sum = 0;
    for(let index=0;index<length;index+=1){
      sum += calcItem(items[index], index);
    }
    return {height:sum, width:this.#scroller.clientWidth};
  }

  #scroller;
  #beforeFirstItem;
  #beforeScrollTop = 0;
  setScroller(scroller){
    if(this.#scroller === scroller) return;
    this.#scroller = scroller;
    this.#beforeFirstItem=undefined;
    this.#beforeScrollTop=scroller?.scrollTop || 0;
  }

  getFirstItem(items, calcItem){
    const scrollTop = this.#scroller.scrollTop;
    const scrollAmount = scrollTop - this.#beforeScrollTop;
    this.#beforeScrollTop = scrollTop;

    let currentTop = 0;
    let index = 0;
    if(this.#beforeFirstItem){
      //前回の結果からforループを削減できる。
      currentTop = this.#beforeFirstItem.top;
      index = this.#beforeFirstItem.index;
      //上方向を表示するようにスクロールをした場合、前回の結果からさかのぼる。
      if(scrollAmount < 0){
        for (; index > 0; index -= 1) {
          const item = items[index - 1];
          const size = calcItem(item, index - 1);
          if (currentTop <= scrollTop - 20) {
            break;
          }
          currentTop -= size;
        }
        const result = {top:currentTop, index};
        this.#beforeFirstItem = result;
        return result;
      }
    }

    //前回から下方向を表示するスクロールなので下方向に探索
    for (; index < items.length; index += 1) {
      const item = items[index];
      const size = calcItem(item, index);
      const nextTop = currentTop + size;
      //表示領域の上端から2上に20pxの位置にアイテムの最下部（次のアイテムの最上部）がある場合
      if (scrollTop - 20 <= nextTop) {
        break;
      }
      currentTop = nextTop;
    }

    const result = {top:currentTop, index};
    this.#beforeFirstItem = result;
    return result;
  }
  
  getItemRange(items, calcItem){
    let {top:currentTop, index} = this.getFirstItem(items, calcItem);
    
    const firstTop = currentTop;
    const firstIndex = index;
    
    const scrollTop = this.#scroller.scrollTop;
    const clientHeight = this.#scroller.clientHeight;
    const scrollAreaBottom = scrollTop + clientHeight;

    for (; index < items.length; index += 1) {
      if (scrollAreaBottom + 20 < currentTop) {
        break;
      }
      const item = items[index];
      const size = calcItem(item, index, items);
      currentTop += size;
    }
    const lastIndex = index;
    const lastTop = currentTop;
    const result = { firstIndex, lastIndex, firstTop, lastTop };
    return result;
  }

  layout(items, key, itemRange, createView, calcItem){

    const displayItems = items.slice(itemRange.firstIndex, itemRange.lastIndex + 1);
    const keyWrapper = (item, index) => key(item, index + itemRange.firstIndex);
    render(html`
    ${repeat(displayItems, keyWrapper, (item, index) => {
      const itemView = createView(item, index + itemRange.firstIndex);
      const holder = html`<div slot=${keyWrapper(item, index)}>${itemView}</div>`;
      return holder;
    })}
    `, this.#scroller);

    let top=itemRange.firstTop;
    const result = html`
    ${repeat(displayItems, keyWrapper, (item, index) => {
      const holder = html`
      <slot
        style="display:block;position:absolute;width:100%;top:${top}px"
        name=${keyWrapper(item, index)}></slot>
      `;
      top+=calcItem(item, index+itemRange.firstIndex);
      return holder;
    })}
    `;

    return result;
  }
}

class VirtualScroller extends LitElement {
  static get styles() {
    return [style];
  }

  #items;
  #layout;
  static get properties() {
    return {
      "#items": { type: Array },
      createView: { type: Function },
      "#layout": { type:Object },
    };
  }

  set layout(layout){
    this.#layout?.setScroller(undefined);
    this.#layout = layout;
    this.#layout?.setScroller(this);
  }

  constructor() {
    super();
    this.#items = [
      ..."a".repeat(1000000)
    ];
    this.key = (item, i) => i;
    this.createView = (item, i) => html`
          <span style="overflow-wrap:none;">item${i}:${item}</span>
      `;

    let timerId;
    this.addEventListener("scroll", e => {
      this.requestUpdate();
      //clearTimeout(timerId);
      //timerId = requestAnimationFrame(()=>this.requestUpdate());
    });
    this.calcItem = (item, index) => {
      return 24;
    }
    this.layout = new LinearLayout();
  }

  #sizes = new Map();
  #calcAll() {
    const sum = this.#items.reduce((sum, item, index) => {
      const size = this.calcItem(item, index);
      return sum + size;
    }, 0);
    return sum;
  }
  #hasChanged = true;
  updateSize(key) {
    this.#hasChanged = true;
    this.#sizes.delete(key);
    this.requestUpdate();
  }
  set items(value){
    this.#hasChanged = true;
    this.#sizes = new Map();
    this.#items = value;
  }

  render() {
    const size = this.#layout.getSumSize(this.#items, this.calcItem);

    //アイテムの変更により表示中の領域がアイテムの合計高さよりも下になった場合、スクロール位置をアイテムの下端に合わせる。
    if(size.height < this.scrollTop+this.clientHeight){
      this.scrollTo(0,size.height-this.clientHeight);
    }
    //アイテムの変更により表示中の領域がアイテムの合計幅よりも下になった場合、スクロール位置をアイテムの右端に合わせる。
    if(size.width < this.scrollLeft+this.clientWidth){
      this.scrollTo(0,size.width-this.clientWidth);
    }

    const itemRange = this.#layout.getItemRange(this.#items, this.calcItem);
    const contents = this.#layout.layout(this.#items, this.key, itemRange, this.createView, this.calcItem);
    return html`
    <div id="spacer" style="height:${size.height}px;width:${size.width}"></div>
    ${contents}
    `;
  }
}
customElements.define("virtual-scroller", VirtualScroller);