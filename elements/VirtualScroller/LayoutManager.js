/**
 * LayoutManager アイテムを配置する。
 */
class LayoutManager {

  /** @member {RecyclerView} */
  #view;

  constructor() {

  }

  /**
   * 
   * @param {RecyclerView} recyclerView 
   */
  attachedRecyclerView(recyclerView) {
    //Viewを設定
    this.#view = recyclerView;
  }

  /**
   * 設定されている表示先Viewへの表示を解除する
   */
  detachedRecyclerView(recyclerView) {
    //Viewをnullに設定
    this.#view = null;
  }

  /**
   * 紐づけられているRecyclerViewを返す
   * @returns {RecyclerView}
   */
  getView() {
    return this.#view;
  }

  _calcSize(view) {
    return this.#view._calcSize(view);
  }

  _items=[];
  set items(items){
    if(this._items !== items){
      this._items = items;
      this._calcAll();
    }
  }

  _calcAll() {

  }

  renderSlot(item, key, index){

  }

  getHeight(){
    
  }
}

export default LayoutManager;