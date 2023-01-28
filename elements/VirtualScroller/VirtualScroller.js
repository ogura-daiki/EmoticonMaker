import { LitElement, html, css, repeat, render } from 'https://cdn.jsdelivr.net/gh/lit/dist@2/all/lit-all.min.js';
import BaseElement from '../BaseElement.js';
import LinearLayoutManager from './LinearLayoutManager.js';


const style = css`
:host{
  display: block;
  position: relative;
  contain:layout;
}

#scroller{
  width: 100%;
  height: 100%;
  position: relative;
  overflow: hidden;
  contain: strict;
}
#scroller > *{
  position: absolute;
}

#dummy{
  width: 0px;
  height: 0px;
  position: absolute;
  visibility: hidden;
  overflow: hidden;
  contain: strict;
}
#tempSlot{
  display:block;
  position: absolute;
  top:0px;
  left:0px;
  width: 100%;
  height: 100%;
  overflow: hidden;
  contain: strict;
  pointer-events:none;
}

.holderSlot{
  width:fit-content;
  height:fit-content;
  display:block;
}
`;


class VirtualScroller extends BaseElement {

  static get styles(){
    return [super.styles, style];
  }

  static get properties(){
    return {
      renderItem:{type:Function},
      items:{type:Array},
      key:{type:Function},
      "#layout":{type:Object},
      "#range":{type:Object},
      equalsItemSize:{type:Function},
    }
  }

  #layout;
  #range={first:0, count:0};
  constructor(){
    super();

    this.items = [];
    this.key = (()=>{
      let key = -1;
      const keys = new WeakMap();
      const indexCache = new WeakMap();
      return (item, index)=>{
        if(indexCache.has(item)){
          if(indexCache.get(item) === index){
            return keys.get(item);
          }
        }
        indexCache.set(item, index);
        key+=1;
        keys.set(item, key);
        return key;
      }
    })();
    //this.equalsItemSize = ({item:i1, index:idx1}, {item:i2, index:idx2})=>true;
    this.equalsItemSize = ()=>true;
    this.layout = new LinearLayoutManager();
  }

  set layout(layout){
    if(this.#layout){
      this.#layout.detachedRecyclerView(this);
    }
    this.#layout = layout;
    layout.attachedRecyclerView(this);
  }
  
  /**
   * viewのサイズを計測する
   * @param {HTMLElement} view 
   * @returns {Object}
   */
  _calcSize(item, index, options={}) {
    this.append(this.#tempContainer);
    this.renderRoot.append(this.#tempSlot);

    let {width:{min:minWidth, max:maxWidth}={}, height:{min:minHeight, max:maxHeight}={}} = options;
    
    [minWidth, maxWidth, minHeight, maxHeight] = [minWidth, maxWidth, minHeight, maxHeight].map(v=>v==undefined?"unset":v);

    const sizes = {minWidth, maxWidth, minHeight, maxHeight};
    Object.assign(this.#tempContainer.style, sizes);

    render(this.renderItem(item, index), this.#tempContainer);
    
    const height = this.#tempContainer.offsetHeight;
    const width = this.#tempContainer.offsetWidth;
    
    render(html``, this.#tempContainer);

    Object.assign(this.#tempContainer.style, Object.fromEntries(Object.keys(sizes).map(key=>[key,"unset"])));
    
    return { height, width };
  }

  render(){
    let scrollerHeight = 0;
    if(this.#layout && this.#tempContainer){
      this.#layout.items = this.items;
      const first = this.#layout._calcIndex(this.scrollTop-this.clientHeight).pos;
      const last = this.#layout._calcIndex(this.scrollTop+this.clientHeight*2).pos;
      this.#range = {first, count:last-first+1};
      scrollerHeight = this.#layout.getHeight();
    }
    else{
      this.#range = {first:0, count:0};
    }
    const displayItems = this.items.slice(this.#range.first, this.#range.first+this.#range.count);
    const wrapIndex = func => (v,i) => func(v, i+this.#range.first);
    render(
      html`${displayItems.map(wrapIndex((v,i)=>html`
      <div style="display:contents" slot=${this.key(v, i)}>
        ${this.renderItem(v, i)}
      </div>`))}`,
      this
    );
    return html`
    <div id="dummy">
      <div id="tempContainer">
      </div>
    </div>
    <div id="scroller" style="height:${scrollerHeight}px">
      ${repeat(
        displayItems,
        wrapIndex(this.key),
        wrapIndex((v,i)=>this.#layout.renderSlot(v, this.key(v, i), i))
      )}
    </div>
    `;
  }

  #tempContainer;
  #tempSlot;
  #scroller;
  #contentSize;

  get contentSize(){
    return {...this.#contentSize};
  }
  firstUpdated(){
    const root = this.renderRoot;

    this.#scroller = root.querySelector("#scroller");
    this.#tempContainer = document.createElement("div");
    this.#tempContainer.style = `
      position: relative;
      width: fit-content;
      height: fit-content;
      overflow: hidden;
    `;
    this.#tempContainer.slot="tempContainer";
    this.append(this.#tempContainer);
    this.#tempSlot = document.createElement("slot");
    this.#tempSlot.name = "tempContainer";
    this.#tempSlot.id = "tempSlot";
    this.renderRoot.append(this.#tempSlot);
    //this.shadowRoot.append(content);
    let scrollY = 0;
    this.addEventListener("scroll", (e, a, b, c) => {

      const dy = this.scrollTop - scrollY;
      scrollY = this.scrollTop;
      this.requestUpdate();

    }, true);

    this.style.overflowX = "hidden";
    this.style.overflowY = "scroll";

    this.#tempSlot.style.width = this.clientWidth + "px";
    this.#tempSlot.style.height = this.clientHeight + "px";
    //this.#container.style.width = this.clientWidth+"px";
    let timerId;
    const rObs = new ResizeObserver((entry) => {
      const {width, height} = entry[0].contentRect;
      this.#contentSize = {width, height};

      this.#tempSlot.style.width = width + "px";
      this.#tempSlot.style.height = height + "px";
      this.#scroller.style.width = width + "px";
      this.#scroller.style.height = height + "px";

      clearTimeout(timerId);
      timerId = requestAnimationFrame(() => {
        if (this.#layout) {
          this.#layout._calcAll();
          this.requestUpdate();
        }
      });

    });
    rObs.observe(this);
  }
}

customElements.define("virtual-scroller", VirtualScroller);