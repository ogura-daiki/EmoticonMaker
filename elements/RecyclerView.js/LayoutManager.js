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

  _relayout() {

  }

  /**
   * 縦スクロール可能かを返す
   * @returns {boolean}
   */
  canScrollVertically() {
    return false;
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

export default LayoutManager;