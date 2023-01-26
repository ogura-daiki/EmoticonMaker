import { html } from "../../elements/Lit.js";

const hl = (val) => html`<span class="highlight">${val}</span>`;
const ll = (val) => html`<span class="lowlight">${val}</span>`;

const NamedTarget = name => ({ target: name, name() { return this.target } });

const Insert = {
  Before: (value, target) => ({ ...target, position: "before", value }),
  After: (value, target) => ({ ...target, position: "after", value }),
};

const genPreview = (list, parts, highlights = []) => {
  const highlightsSet = new Set(highlights.map(nt => nt.name()));
  const values = list.map(query => {
    if (typeof query === "string") {
      const path = query.split(".").filter(v => v);
      let partObj = parts;
      for (const pathPart of path) {
        partObj = partObj[pathPart];
      }
      return highlightsSet.has(query) ? hl(partObj) : ll(partObj);
    }

    throw new Error("顔文字構造データの解析に失敗");
  });

  const strs = [...Array(values.length + 1)].map(() => "");
  strs.raw = [...strs];

  return html(strs, ...values);
}

const InsertParser = (groupName, list, inserts) => {
  list = [...list];
  const props = {};
  const listKeys = [];
  let propCount = 0;
  for (const insert of inserts) {
    const index = list.findIndex(target => insert.target === target);
    if (index < 0) {
      throw new Error(`挿入先が存在しません：${insert.target}`);
    }

    //挿入する値リストに追加
    const propName = "v" + propCount++;
    props[propName] = insert.value;
    //挿入先を生成
    const insertIndex = index + (insert.position === "before" ? 0 : 1);
    //挿入
    const listKey = `${groupName}.${propName}`;
    listKeys.push(NamedTarget(listKey));
    list.splice(insertIndex, 0, listKey);
  }
  return { list, listKeys, props }
}

const InsertTarget = {
  outline: {
    left: NamedTarget("outline.left"),
    right: NamedTarget("outline.right"),
  },
  cheek: {
    left: NamedTarget("cheek.left"),
    right: NamedTarget("cheek.right"),
  },
  eye: {
    left: NamedTarget("eye.left"),
    right: NamedTarget("eye.right"),
  },
  mouth: NamedTarget("mouth.value"),
}
const simplePartsList = ["outline.left", "cheek.left", "eye.left", "mouth.value", "eye.right", "cheek.right", "outline.right"];

const LeftRight = (...v) => {
  let [left, right] = v;
  if (!right) {
    right = left;
  }
  return { left, right };
}

export { NamedTarget, LeftRight, simplePartsList, genPreview, InsertTarget, Insert, InsertParser };