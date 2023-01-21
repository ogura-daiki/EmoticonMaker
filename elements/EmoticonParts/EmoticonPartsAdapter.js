import { render } from 'https://cdn.jsdelivr.net/gh/lit/dist@2/all/lit-all.min.js';
import { RecyclerView } from "../RecyclerView.js/RecyclerView.js";
import { EmoticonPartsHolder } from "./EmoticonPartsHolder.js";

const _container = document.createElement("div");
const renderResult = (template) => {
    render(template, _container);
    return _container.firstElementChild.cloneNode(true);
}

const EmoticonPartsAdapter = class extends RecyclerView.Adapter {

    constructor(itemList, ctx) {
        super(itemList);
        this.ctx = ctx;
    }

    onCreateViewHolder(parent, position) {
        return new EmoticonPartsHolder(renderResult(EmoticonPartsHolder._template));
    }

    onBindViewHolder(holder, position) {
        const item = this._itemList[position];

        holder.itemView.addEventListener("click", e=>{
            console.log(item);
        })
        holder.name.textContent = item.name;
        render(item.content(this.ctx.selectionParts), holder.content);
    }

    getItemType(){
        return 0;
    }

    //アイテムの表示サイズが同じになるか
    sizeEquals(p1, p2) {
        return true;
    }
}

export { EmoticonPartsAdapter };