import { html } from 'https://cdn.jsdelivr.net/gh/lit/dist@2/all/lit-all.min.js';
import { RecyclerView } from "../RecyclerView.js/RecyclerView.js";

class EmoticonPartsHolder extends RecyclerView.ViewHolder {

    static _template = html`
        <div class="col previewItem">
            <span class="centering grow">
                <span class="content"></span>
            </span>
            <span class="name"></span>
        </div>
    `;

    constructor(view) {
        super(view);
        this.name = view.querySelector(".name");
        this.content = view.querySelector(".content");
    }
}

export { EmoticonPartsHolder };