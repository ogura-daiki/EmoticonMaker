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
  #sizeList;

  #allHeight;
  #calcHolderMap = new Map();

  //表示されているHolderのPosition
  #firstPos = 0;
  #lastPos = 0;
  #bf = 0;
  #bl = 0;

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
  }

  #getRowItems(){
    const {width} = this.#view.contentSize;
    const count = Math.max(1, Math.floor(width/(this.#sizeRange.min||this.#sizeRange.max||width)));
    const size = Math.min(Math.max(this.#sizeRange.min, width/count), this.#sizeRange.max||Math.max(width, this.#sizeRange.min));
    return {count, size};
  }

  _calcAll() {
    const adapter = this.#view.getAdapter();
    this.#calcHolderMap = new Map();
    this.#allHeight = 0;
    let uniqueItem = [];
    const itemCount = adapter.getItemCount();
    this.#sizeList = new Array(adapter.getItemCount());

    const {count:rowItemCount, size:rowItemSize} = this.#getRowItems();
    for (let pos = 0; pos < itemCount; pos++) {
      let sameSize = -1;
      for (const uipos of uniqueItem) {
        if (adapter.sizeEquals(uipos, pos)) {
          sameSize = uipos;
          break;
        }
      }
      let size;
      if (sameSize >= 0) {
        size = { ...this.#sizeList[sameSize] };
      }
      else {
        uniqueItem.push(pos);
        const type = adapter.getItemType(pos);
        let holder = this.#calcHolderMap.get(type);
        if (!holder) {
          holder = adapter.onCreateViewHolder(this, type);
          this.#calcHolderMap.set(type, holder);
        }
        adapter.onBindViewHolder(holder, pos);
        size = this._calcSize(holder.itemView);

      }

      size.width = rowItemSize;
      size.top = Math.floor(pos/rowItemCount) * size.height;
      size.left = pos%rowItemCount * rowItemSize;
      this.#sizeList[pos] = size;
    }
    const last = this.#sizeList[this.#sizeList.length-1];
    this.#allHeight = last.top + last.height;
    this.#view._setScrollerHeight(this.#allHeight);
  }


  _calcSize(view) {
    return this.#view._calcSize(view, {width:this.#sizeRange});
  }

  /**
   * 
   * @param {Number} point 
   * @returns {Array}
   */
  _calcPos(point) {
    let pos;
    let start = 0;
    let end = this.#view.getAdapter().getItemCount() - 1;
    
    const {count:rowItemCount, size:rowItemSize} = this.#getRowItems();

    while (true) {
      if (start >= end) {
        pos = end;
        break;
      }
      pos = Math.round((start + end) / 2);
      const ctop = this.#sizeList[pos].top;
      const cbottom = ctop + this.#sizeList[pos].height;
      if (ctop <= point && point <= cbottom){
        pos = Math.max(0, pos-pos % rowItemCount);
        break;
      }
      else if (point < ctop)
        end = pos - 1;
      else
        start = pos + 1;
    }
    return { pos, top: this.#sizeList[pos].top }
  }

  firstLayout() {
    this._relayout();
  }

  _relayout() {
    //中身を初期化
    this.#view._destroyContents();

    this.#firstPos = 0;
    this.#lastPos = 0;
    this._calcAll();
    this._layoutChildren(0);
  }


  _layoutChildren(dy) {

    let calcedFirst = this._calcPos(this.#view.scrollTop);
    let calcedLast = this._calcPos(this.#view.scrollTop + this.#view.clientHeight);
    calcedLast.pos = Math.min(this.#sizeList.length-1, calcedLast.pos + this.#getRowItems().count);
    calcedLast.top+=this.#sizeList[calcedLast.pos].height;

    let firstTop = this.#sizeList[this.#firstPos].top;
    let lastBottom = this.#sizeList[this.#lastPos].top + this.#sizeList[this.#lastPos].height;

    const adapter = this.#view.getAdapter();

    this.#bf = this.#firstPos;
    this.#bl = this.#lastPos;

    //画面上部にはみ出しているとき
    if (this.#firstPos < calcedFirst.pos) {
      while (this.#firstPos < Math.min(calcedFirst.pos, this.#lastPos + 1)) {
        this.#view._detachHolder(this.#firstPos++);
      }
      if (this.#firstPos === this.#lastPos)
        this.#firstPos = calcedFirst.pos;
    }
    //画面下部にはみ出しているとき
    if (this.#lastPos > calcedLast.pos) {
      while (this.#lastPos > Math.max(calcedLast.pos, this.#firstPos - 1)) {
        this.#view._detachHolder(this.#lastPos--);
      }
      if (this.#firstPos === this.#lastPos)
        this.#lastPos = calcedLast.pos;
    }


    //画面上部に隙間があるとき
    if (this.#firstPos > calcedFirst.pos) {
      if (this.#firstPos > calcedLast.pos) {
        this.#firstPos = calcedLast.pos + 1;
        firstTop = calcedLast.top + this.#sizeList[this.#firstPos - 1].height;
      }

      while (this.#firstPos > calcedFirst.pos) {
        const type = adapter.getItemType(--this.#firstPos);
        const holder = this.#view._getFreeHolder(this, type);
        adapter.onBindViewHolder(holder, this.#firstPos);
        this.#view._attachHolder(this.#firstPos, holder);
        firstTop -= this.#sizeList[this.#firstPos].height;

        const size = this.#sizeList[this.#firstPos];
        holder.slot.style.top = size.top + "px";
        holder.slot.style.left = size.left + "px";
        holder.slot.style.width = size.width+"px";
      }
    }
    //画面下部に隙間があるとき
    if (this.#lastPos < calcedLast.pos) {
      if (this.#lastPos < calcedFirst.pos) {
        this.#lastPos = calcedFirst.pos - 1;
        lastBottom = calcedFirst.top;
      }

      while (this.#lastPos < calcedLast.pos) {
        const type = adapter.getItemType(this.#lastPos);
        const holder = this.#view._getFreeHolder(this, type);
        adapter.onBindViewHolder(holder, this.#lastPos);
        this.#view._attachHolder(this.#lastPos, holder);
        
        const size = this.#sizeList[this.#lastPos];
        holder.slot.style.top = size.top + "px";
        holder.slot.style.left = size.left + "px";
        holder.slot.style.width = size.width+"px";
        lastBottom = size.top + size.height;
        this.#lastPos++;
      }
    }

    this.#firstPos = calcedFirst.pos;
    this.#lastPos = calcedLast.pos;
  }


  /**
   * 縦スクロール可能かを返す
   * @returns {boolean}
   */
  canScrollVertically() {
    return true;
  }

  /**
   * 横
   * スクロール可能かを返す
   * @returns {boolean}
   */
  canScrollHorizontally() {
    return false;
  }
}

export default FlowLayoutManager;