import { css, html, when } from "./elements/Lit.js";
import BaseElement from "./elements/BaseElement.js";
import "./elements/Split.js";
import "./elements/PartsPicker.js";
import "./elements/FittingInput.js";

const style = css`
:host{
  width:100%;
  height:100%;
}

split-panel{
  overflow:hidden;
}
.output{
  font-size:64px;
  display:block;
  width:100%;
  height:100%;
  text-align:center;
  border:none;
  padding:0px;
  margin:0px;
  vertical-align:center;
  outline:none;
  font-family: sans-serif;
}
`;

const getTemplateValues = (data) => {
  const {values} = data;
  const v = [...values, ''].map(e => typeof e === 'object' ? getTemplateValues(e) : e )      
  return v.join("");
}

class MyElement extends BaseElement{
  static get styles(){
    return [super.styles, style];
  }

  static get properties(){
    return {
      selectionParts:{type:Object},
    };
  }

  constructor(){
    super();
    this.selectionParts = undefined;
  }

  render(){

    const previewValue = this.selectionParts?getTemplateValues(this.selectionParts.body.content(this.selectionParts)):"";

    return html`
    <split-panel
      class="fill"
      vertical
      .min_weights=${[0.05, 0.05]}
    >
    <div slot=0 class="centering fill">
      ${when(
        this.selectionParts,
        ()=>html`
          <fit-input
            class="fill"
            .value=${previewValue}
          ></fit-input>
        `
      )}
    </div>
    <div slot=1 class="fill">
      <parts-picker
        class=fill
        style="overflow:hidden;"
        @change=${e=>{
          this.selectionParts = {...e.detail.selectionParts};
        }}
      ></parts-picker>
    </div>
    </split-panel>
    `;
  }
}
customElements.define("my-element", MyElement);