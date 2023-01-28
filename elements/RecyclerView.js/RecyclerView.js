import { LitElement, html, css, repeat, render } from 'https://cdn.jsdelivr.net/gh/lit/dist@2/all/lit-all.min.js';
import BaseElement from '../BaseElement.js';
import LayoutManager from './LayoutManager.js';

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


class RecyclerView extends BaseElement {

  static get styles() {
    return [style];
  }


  /**
   * スクロールする部分。アイテムもこの中に配置する。 
   * @type {HTMLDivElement} 
   */
  #scroller;

  /**
   * アイテムのサイズを計算するのに使用する。
   * @type {HTMLDivElement} 
   */
  #tempContainer;
  #tempSlot;

  /**
   * @type {LayoutManager}
   */
  #layoutManager;

  /**
   * @type {Adapter}
   */
  #adapter;

  #holderPosMap;
  #typedHolderListMap;

  constructor() {
    super();

    this.#holderPosMap = new Map();
    this.#typedHolderListMap = new Map();
  }

  #contentSize;
  get contentSize(){
    return {...this.#contentSize};
  }
  firstUpdated() {
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
      this.#layoutManager._layoutChildren(dy);

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
      console.log();
      this.#tempSlot.style.width = width + "px";
      this.#tempSlot.style.height = height + "px";
      this.#scroller.style.width = width + "px";
      this.#scroller.style.height = height + "px";

      clearTimeout(timerId);
      timerId = requestAnimationFrame(() => {
        if (this.#layoutManager) {
          this.#layoutManager._relayout();
        }
      });

    });
    rObs.observe(this);
  }

  render() {
    return html`
    <div id="dummy">
      <div id="tempContainer">
      </div>
    </div>
    <div id="scroller">
    </div>
    `;
  }

  //holderを取得
  #getHolder(pos) {
    return this.#holderPosMap.get(pos);
  }

  //空いているHolderを取得
  _getFreeHolder(type) {
    //指定TypeのHolderのリストを取得
    let holderList = this.#typedHolderListMap.get(type);
    //リストがないなら作成する
    if (!holderList) {
      holderList = [];
      //Mapに追加
      this.#typedHolderListMap.set(type, holderList);
    }
    //非ActiveなHolderを取得
    let holder = holderList.find(h => !h.active);
    //ないなら新規作成
    if (!holder) {
      holder = this.#adapter.onCreateViewHolder(this, type);
      //リストに追加
      holderList.push(holder);
    }
    return holder;
  }


  
  //HolderをScrollerに追加、追加位置と追加された事を記憶
  _attachHolder(pos, holder) {
    if(this.#getHolder(pos) !== holder){
      this._detachHolder(pos);
    }
    holder.active = true;
    this.append(holder.itemView);
    holder.itemView.slot = holder.__holderID;
    holder.slot.setAttribute("pos", pos);
    holder.itemView.setAttribute("pos", pos);
    this.#scroller.append(holder.slot);
    this.#holderPosMap.set(pos, holder);
  }

  _detachHolder(pos) {
    const holder = this.#getHolder(pos);
    console.log(pos, holder)
    if (holder) {
      holder.itemView?.remove();
      holder.slot?.remove();
      this.#holderPosMap.delete(pos);
      holder.active = false;
    }
  }

  /**
   * LayoutManagerを設定する
   * @param {LayoutManager} manager
   */
  set layoutManager(manager) {
    this.#layoutManager = manager;
    manager.attachedRecyclerView(this);
  }

  /**
   * Adapterを設定する
   * @param {Adapter} adapter 
   */
  set adapter(adapter) {
    if (this.#adapter) {
      this.#adapter.detachedRecyclerView(this);
    }
    this.#adapter = adapter;
    adapter.attachedRecyclerView(this);

    if (this.#layoutManager) {
      this.#layoutManager.firstLayout();
    }
  }

  getAdapter() {
    return this.#adapter;
  }

  /**
   * viewのサイズを計測する
   * @param {HTMLElement} view 
   * @returns {Object}
   */
  _calcSize(view, options) {
    this.append(this.#tempContainer);
    this.renderRoot.append(this.#tempSlot);
    let height = 0, width = 0;
    const flag = view.parentNode === this.#tempContainer;
    if(options){
      if(options.width){
        if(options.width.min){
          this.#tempContainer.style.minWidth = options.width.min+"px";
        }
        if(options.width.max){
          this.#tempContainer.style.maxWidth = options.width.max+"px";
        }
      }
      if(options.height){
        if(options.height.min){
          this.#tempContainer.style.minHeight = options.height.min+"px";
        }
        if(options.height.max){
          this.#tempContainer.style.maxHeight = options.height.max+"px";
        }
      }
    }
    if (!flag) {
      this.#tempContainer.append(view);
    }
    height = this.#tempContainer.offsetHeight;
    width = this.#tempContainer.offsetWidth;
    if (!flag) {
      this.#tempContainer.removeChild(view);
    }
    this.#tempContainer.style.minWidth = "unset";
    this.#tempContainer.style.maxWidth = "unset";
    this.#tempContainer.style.minHeight = "unset";
    this.#tempContainer.style.maxHeight = "unset";
    //console.log(width, height);
    return { height, width };
  }

  _setScrollerHeight(height) {
    this.#scroller.style.height = height + "px";
  }

  _destroyContents() {
    //中身を初期化
    for(const pos of this.#holderPosMap.keys()){
      this._detachHolder(pos);
    }
    return;
    while (this.#scroller.firstChild) {
      this.#scroller.removeChild(this.#scroller.firstChild);
    }
    while (this.firstChild) {
      this.removeChild(this.firstChild);
    }
  }

  /**
   * @typedef Adapter アイテムとRecyclerViewを関連付ける
   */
  static Adapter = class {

    _itemList;

    constructor(itemList) {
      this._itemList = itemList;
    }

    /**
     * AdapterがRecyclerViewに紐づけられた
     * @param {RecyclerView} recyclerView 
     */
    attachedRecyclerView(recyclerView) {

    }

    /**
     * 
     * @param {RecyclerView} recyclerView 
     */
    detachedRecyclerView(recyclerView) {

    }

    /**
     * ViewHolderを生成する
     * @param {RecyclerView} parent 
     * @param {Number} viewType 
     * @returns {ViewHolder}
     */
    onCreateViewHolder(parent, viewType) {

    }

    /**
     * ViewHolderに値をセットする
     * @param {ViewHolder} holder 
     * @param {Number} position 
     */
    onBindViewHolder(holder, position) {

    }

    /**
     * @abstract 現在のアイテムの個数を返す
     * @returns 表示するアイテムの個数
     */
    getItemCount() {
      return this._itemList.length;
    }

    getItemType(position) {
      return 0;
    }

    //アイテムの表示サイズが同じになるか
    sizeEquals(p1, p2) {
      return true;
    }
  }

  /**
   * @typedef Recycler ViewHolderのアイテムのリサイクルを管理する
   */
  static Recycler = class {
    #view;
    constructor(view) {
      this.#view = view;
    }
  }

  static ViewHolder = class {

    static count=0;
    active;
    __holderID;
    #slot;
    constructor(view) {
      this.itemView = view;
      this.__holderID = `${this.constructor.count++}:${+Math.random()}`;
      
      const slot = document.createElement("slot");
      slot.className = "holderSlot";
      slot.name = this.__holderID;
      this.#slot = slot;
    }

    get slot(){
      return this.#slot;
    }
  }
}
customElements.define("recycler-view", RecyclerView);

export { RecyclerView };