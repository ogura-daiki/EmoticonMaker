import BaseElement from "./BaseElement.js";
import { css, html, when } from "./Lit.js";


const simplePartsList = ["outline.left", "cheek.left", "eye.left", "mouth.value", "eye.right", "cheek.right", "outline.right"];

const LeftRight = (...v)=>{
  let [left, right] = v;
  if(!right){
    right = left;
  }
  return {left, right};
}
const Eye = (name, ...parts)=>{
  const lr = LeftRight(...parts);
  const eye = {...lr};
  eye.name = name;
  eye.content = (options) => genPreview(
    simplePartsList,
    {...options, eye:lr},
    [InsertTarget.eye.left, InsertTarget.eye.right]
  );
  return eye;
}
const Mouth = (name, value)=>{
  const mouth = {value};
  mouth.name = name;
  mouth.content = (options) => genPreview(
    simplePartsList,
    {...options, mouth:{value}},
    [InsertTarget.mouth]
  );
  return mouth;
}
const Outline = (name, ...parts) =>{
  const lr = LeftRight(...parts);
  const outline = {...lr};
  outline.name = name;
  outline.content = (options) => genPreview(
    simplePartsList,
    {...options, outline:lr},
    [InsertTarget.outline.left, InsertTarget.outline.right]
  );
  return outline;
}
const NamedTarget = name => ({target:name, name(){return this.target}});
const InsertTarget = {
  outline:{
    left:NamedTarget("outline.left"),
    right:NamedTarget("outline.right"),
  },
  cheek:{
    left:NamedTarget("cheek.left"),
    right:NamedTarget("cheek.right"),
  },
  eye:{
    left:NamedTarget("eye.left"),
    right:NamedTarget("eye.right"),
  },
  mouth:NamedTarget("mouth.value"),
}
const Insert = {
  Before:(value, target) => ({...target, position:"before", value}),
  After:(value, target) => ({...target, position:"after", value}),
};

const genPreview = (list, parts, lighlights=[]) => {
  const lighlightsSet = new Set(lighlights.map(nt=>nt.name()));
  const values = list.map(query=>{
    if(typeof query === "string"){
      const path = query.split(".").filter(v=>v);
      let partObj = parts;
      for(const pathPart of path){
        partObj = partObj[pathPart];
      }
      return lighlightsSet.has(query)?hl(partObj):ll(partObj);
    }
    
    throw new Error("胴体データの解析に失敗");
  });

  const strs = [...Array(values.length+1)].map(()=>"");
  strs.raw = [...strs];

  return html(strs, ...values);
}

const InsertParser = (groupName, list, inserts) => {
  list = [...list];
  const props = {};
  const listKeys = [];
  let propCount = 0;
  for(const insert of inserts){
    const index = list.findIndex(target => insert.target === target);
    if(index < 0){
      throw new Error(`挿入先が存在しません：${insert.target}`);
    }
    
    //挿入する値リストに追加
    const propName = "v"+propCount++;
    props[propName] = insert.value;
    //挿入先を生成
    const insertIndex = index + (insert.position==="before"?0:1);
    //挿入
    const listKey = `${groupName}.${propName}`;
    listKeys.push(NamedTarget(listKey));
    list.splice(insertIndex, 0, listKey);
  }
  return {list, listKeys, props}
}

const Body = (name, inserts=[]) => {
  const body = {name};

  const {props, listKeys, list} = InsertParser("body", simplePartsList, inserts);

  body.content = (options) => {
    return genPreview(list, {...options, body:props}, listKeys);
  };
  return body;
}
const Cheek = (name, ...parts) => {
  const lr = LeftRight(...(parts||[""]));
  const cheek = {name, ...lr};
  cheek.content = (options) => genPreview(
    simplePartsList,
    {...options, cheek:lr},
    [InsertTarget.cheek.left, InsertTarget.cheek.right]
  );
  return cheek;
}

const Outlines = {
  id:"outline",
  label:"輪郭",
  items:[
    Outline("かっこ1", ..."()"),
    Outline("なし", ""),
    Outline("スペース", " "),
    Outline("スペース", "　"),
    Outline("かっこ2", ..."（）"),
    Outline("かっこ3", ..."[]"),
    Outline("かっこ4", ..."［］"),
    Outline("かっこ4", ..."〚〛"),
    Outline("かっこ4", ..."〈〉"),
    Outline("かっこ4", ..."【】"),
    Outline("かっこ4", ..."{}"),
    Outline("かっこ4", ..."<>"),
    Outline("かっこ4", ..."＜＞"),
    Outline("かっこ4", ..."≪≫"),
    Outline("かっこ4", ..."⁅⁆"),
    Outline("かっこ4", ..."〖〗"),
    Outline("かっこ4", ..."⦋⦌"),
    Outline("げっそり1", ...")("),
    Outline("げっそり2", ..."）（"),
    Outline("げっそり3", ..."]["),
    Outline("げっそり4", ..."］［"),
    Outline("いきもの", ..."ʕʔ"),
    Outline("ふっくら", ..."⟅⟆"),
    Outline("はてな", ..."⸮?"),
    Outline("ひれ1", ..."꒰꒱"),
    Outline("ひれ2", ..."ᚮᚭ"),
    Outline("ひれ3", ..."⧽⧼"),
    Outline("ひれ4", ..."⚞⚟"),
    Outline("ひれ5", ..."꧁꧂"),
    Outline("波線", "⸾"),
    Outline("たれ耳", ..."૮ა"),
    Outline("耳", ..."ርጋ"),
    Outline("耳", ..."ϹϽ"),
    Outline("耳", "👂"),
    Outline("さんかく", ..."◤◥"),
    Outline("さんかく", ..."◣◢"),
    Outline("さんかく", ..."◥◤"),
    Outline("さんかく", ..."◢◣"),
  ]
};
const Eyes = {
  id:"eye",
  label:"両目",
  items:[
    Eye("ニコニコ1", "◠"),
    Eye("なし", ""),
    Eye("スペース", " "),
    Eye("スペース", "　"),
    Eye("ニコニコ2", "𐡉"),
    Eye("ニコニコ3", "^"),
    Eye("ニコニコ4", "⌅"),
    Eye("きゃぴ1", ..."><"),
    Eye("きゃぴ2", ..."＞＜"),
    Eye("きゃぴ3", ..."≥≤"),
    Eye("きゃぴ4", ..."≧≦"),
    Eye("きゃぴ5", ..."≩≨"),
    Eye("きゃぴ6", ..."⚞⚟"),
    Eye("きゃぴ7", ..."≫≪"),
    Eye("点1", "・"),
    Eye("点2", "･"),
    Eye("点3", "·"),
    Eye("点4", "𐩐"),
    Eye("点5", "ꔷ"),
    Eye("点6", "⦁"),
    Eye("点7", "•"),
    Eye("点8", "𖧹"),
    Eye("点9", "𖧹"),
    Eye("点10", "●"),
    Eye("点11", "⬬"),
    Eye("点12", "⬮"),
    Eye("丸1", "◦"),
    Eye("丸2", "°"),
    Eye("丸3", "○"),
    Eye("丸4", "〇"),
    Eye("丸5", "◎"),
    Eye("丸6", "⦿"),
    Eye("丸7", "◑"),
    Eye("丸8", "◐"),
    Eye("丸9", ..."◐◑"),
    Eye("丸10", ..."◑◐"),
    Eye("丸11", "◒"),
    Eye("丸12", "◓"),
    Eye("丸13", ..."◓◒"),
    Eye("丸14", ..."◒◓"),
    Eye("丸15", "◍"),
    Eye("丸16", "◉"),
    Eye("丸17", "◌"),
    Eye("丸18", "❍"),
    Eye("丸19", "◔"),
    Eye("丸20", "◕"),
    Eye("丸21", "◖"),
    Eye("丸22", "◗"),
    Eye("丸23", ..."◗◖"),
    Eye("丸24", ..."◖◗"),
    Eye("丸25", "🔴"),
    Eye("丸26", "🔵"),
    Eye("丸27", "ዐ"),
    Eye("四角1", "꤀"),
    Eye("四角2", "口"),
    Eye("四角3", "■"),
    Eye("四角4", "◇"),
    Eye("四角5", "◆"),
    Eye("四角6", "⊡"),
    Eye("四角7", "▣"),
    Eye("四角8", "▤"),
    Eye("四角9", "▥"),
    Eye("四角10", "▦"),
    Eye("四角11", "▧"),
    Eye("四角12", "▨"),
    Eye("四角13", "▩"),
    Eye("四角14", "▫"),
    Eye("四角15", "❖"),
    Eye("四角16", "🔲"),
    Eye("四角17", "🔳"),
    Eye("四角18", "▬"),
    Eye("四角19", "▭"),
    Eye("四角20", "▮"),
    Eye("四角21", "▯"),
    Eye("四角22", "▰"),
    Eye("四角23", "▱"),
    Eye("四角24", "◈"),
    Eye("四角25", "☐"),
    Eye("四角26", "◊"),
    Eye("四角27", "◘"),
    Eye("四角28", "◙"),
    Eye("四角29", "◚"),
    Eye("四角30", "◛"),
    Eye("四角31", "◧"),
    Eye("四角32", "◨"),
    Eye("四角33", ..."◨◧"),
    Eye("四角34", ..."◧◨"),
    Eye("四角35", "◩"),
    Eye("四角36", "◪"),
    Eye("四角37", ..."◪◩"),
    Eye("四角38", ..."◩◪"),
    Eye("四角39", "◫"),
    Eye("四角40", "❏"),
    Eye("四角41", "❐"),
    Eye("四角42", "❑"),
    Eye("四角43", "❒"),
    Eye("喜び1", ..."><"),
    Eye("喜び2", ..."＞＜"),
    Eye("喜び3", ..."≧≦"),
    Eye("泣き1", ";"),
    Eye("泣き2", "；"),
    Eye("泣き3", "╥"),
    Eye("泣き4", "╥╯", "╰╥"),
    Eye("泣き5", "T"),
    Eye("泣き6", "t"),
    Eye("泣き7", "𖡊"),
    Eye("泣き8", "༎ຶ "),
    Eye("泣き9", "ཀ"),
    Eye("泣き10", "𖣶"),
    Eye("まつげ1", "ơ"),
    Eye("まつげ2", "⥁"),
    Eye("まつげ3", "⥀"),
    Eye("まつげ4", "𖣗"),
    Eye("まつげ5", "𝌁"),
    Eye("まつげ6", "𝌂"),
    Eye("まつげ7", "𖠘"),
    Eye("まつげ8", "𖠶"),
    Eye("まつげ9", "𖤫"),
    Eye("まつげ10", "光"),
    Eye("まつげ11", "当"),
    Eye("まつげ12", "癶"),
    Eye("まゆげ", "𖧼"),
    Eye("まめ", "𖠗"),
    Eye("血走り1", "𖥕"),
    Eye("血走り2", "𖡨"),
    Eye("つぶら", "꧞"),
    Eye("げっそり", ..."╯╰"),
    Eye("ダメ1", "*"),
    Eye("ダメ2", "＊"),
    Eye("ダメ3", "×"),
    Eye("ダメ4", "✖"),
    Eye("ダメ5", "☓"),
    Eye("ダメ6", "☒"),
    Eye("ダメ7", "✗"),
    Eye("ダメ8", "✘"),
    Eye("ダメ9", "༝"),
    Eye("うに", "✹"),
    Eye("縦長1", "l"),
    Eye("縦長2", "ｌ"),
    Eye("縦長3", "|"),
    Eye("縦長4", "｜"),
    Eye("縦長1", "‾"),
    Eye("縦長2", "￣"),
    Eye("横長3", "ﾠ​̅ﾠ"),
    Eye("キョトン1", "'"),
    Eye("キョトン2", "╹"),
    Eye("キョトン3", "ᛌ"),
    Eye("キョトン3", "𐄇"),
    Eye("けげん1", "ರ"),
    Eye("けげん2", "ಠ"),
    Eye("うっとり", "˘"),
    Eye("ボヤボヤ1", "\""),
    Eye("ボヤボヤ2", "\"\""),
    Eye("うるうる", "◕"),
    Eye("ネコ目1", "Φ"),
    Eye("ネコ目2", "ↀ"),
    Eye("ハート1", "♥"),
    Eye("ハート2", "♡"),
    Eye("ハート3", "❤"),
    Eye("ハート4", "❥"),
    Eye("ハート5", "💓"),
    Eye("ハート6", "💔"),
    Eye("ハート7", "💕"),
    Eye("ハート8", "💖"),
    Eye("ハート9", "💗"),
    Eye("ハート10", "💘"),
    Eye("ハート11", "💛"),
    Eye("ハート12", "💙"),
    Eye("ハート13", "💚"),
    Eye("ハート14", "💜"),
    Eye("ハート15", "💝"),
    Eye("ハート16", "💞"),
    Eye("ハート17", "💟"),
    Eye("ジト目1", "ᯉ"),
    Eye("ジト目2", "፬"),
    Eye("ジト目3", "ꗞ"),
    Eye("ジト目4", "ᯙ"),
    Eye("ジト目5", "𐡝"),
    Eye("ジト目6", "旬"),
    Eye("ジト目7", "ㅎ"),
    Eye("ジト目8", "ㆆ"),
    Eye("ジト目9", "승"),
    Eye("ジト目10", "⸟"),
    Eye("ジト目11", "⫟"),
    Eye("ジト目12", "᠇"),
    Eye("ジト目13", "≖"),
    Eye("ジト目14", "⩍"),
    Eye("ジト目15", "⩌"),
    Eye("ジト目16", "ꌩ"),
    Eye("ジト目17", "𖨦"),
    Eye("ジト目18", "눈"),
    Eye("ジト目19", "Ծ"),
    Eye("ジト目20", "常"),
    Eye("ジト目21", "ꛓ"),
    Eye("ジト目22", "유"),
    Eye("ジト目23", "𖠂"),
    Eye("ジト目24", "ᯣ"),
    Eye("ジト目25", "ᯞ"),
    Eye("ジト目26", "ᯎ"),
    Eye("ジト目27", ..."ᯎᯞ"),
    Eye("ジト目28", ..."ᯞᯎ"),
    Eye("ジト目29", "ب"),
    Eye("白目", "՞"),
    Eye("ヌベスコ", ..."՞◔"),
    Eye("おだやか", ..."´`"),
    Eye("ｺﾗｺﾗｺﾗ~!!!", ..."`´"),
    Eye("土曜日ど", ..."‘’"),
    Eye("上目遣い", ..."ᕦᕤ"),
    Eye("めそらし1", "ᕦ"),
    Eye("めそらし2", "ᕤ"),
    Eye("ぐるぐる1", ..."ᕤᕦ"),
    Eye("ぐるぐる2", "@"),
    Eye("ぐるぐる3", "＠"),
    Eye("ぐるぐる4", "🌀"),
    Eye("ぐるぐる5", "𐂲"),
    Eye("ぐるぐる6", "𖦹"),
    Eye("ぐるぐる7", "꩜"),
    Eye("ぐるぐる8", "𖡎"),
    Eye("曇った目", ..."圝"),
    Eye("ぽやぽや1", "ᚮᚭ"),
    Eye("ぽやぽや2", "非"),
  ],
};
const Mouths = {
  id:"mouth",
  label:"口",
  items:[
    Mouth("ニコニコ1", "ᴗ"),
    Mouth("なし", ""),
    Mouth("スペース", " "),
    Mouth("スペース", "　"),
    Mouth("ニコニコ2", "◡"),
    Mouth("ニコニコ3", "‿"),
    Mouth("ニコニコ4", " ͜　"),
    Mouth("ニコニコ5", "∨"),
    Mouth("ニコニコ6", "𐃬"),
    Mouth("ニコニコ7", "𓎟"),
    Mouth("ニコニコ8", "╰╯"),
    Mouth("ニコニコ（ずれ）", " ͜"),
    Mouth("ニヤニヤ1", "∀"),
    Mouth("ニヤニヤ2", "𐃔"),
    Mouth("ニヤニヤ3", "𖧗"),
    Mouth("ニヤニヤ4", "𖡜"),
    Mouth("しょぼん", "ω"),
    Mouth("棒1", "_"),
    Mouth("点1", "."),
    Mouth("点2", "．"),
    Mouth("丸1", "｡"),
    Mouth("丸2", "。"),
    Mouth("丸3", "o"),
    Mouth("丸4", "ｏ"),
    Mouth("丸5", "O"),
    Mouth("丸6", "Ｏ"),
    Mouth("丸7", "0"),
    Mouth("丸8", "０"),
    Mouth("丸9", "۝"),
    Mouth("バツ1", "*"),
    Mouth("バツ2", "＊"),
    Mouth("バツ3", "×"),
    Mouth("バツ4", "✖"),
    Mouth("バツ5", "☓"),
    Mouth("バツ6", "☒"),
    Mouth("バツ7", "✗"),
    Mouth("バツ8", "✘"),
    Mouth("バツ9", "༝"),
    Mouth("への字1", "へ"),
    Mouth("への字2", "︵"),
    Mouth("への字3", "𖤋"),
    Mouth("への字4", "∧"),
    Mouth("への字5", "ᯅ"),
    Mouth("への字6", "ᯙ"),
    Mouth("ボカーン1", "Д"),
    Mouth("ボカーン2", "ﾛ"),
    Mouth("波線1", "~"),
    Mouth("波線2", "～"),
    Mouth("波線3", "〰"),
    Mouth("波線4", "﹏"),
    Mouth("いきもの1", "ᴥ"),
    Mouth("いきもの2", "ᵜ"),
    Mouth("いきもの3", "ܫ"),
    Mouth("いきもの4", "ﻌ"),
    Mouth("いきもの5", "ꈊ"),
    Mouth("いきもの6", "꒳"),
    Mouth("いきもの7", "ꀾ"),
    Mouth("いきもの8", "𖢇"),
    Mouth("いきもの9", "오"),
    Mouth("いきもの9", "௰"),
    Mouth("ふんす1", "ᆺ"),
    Mouth("ふんす2", "ㅅ"),
    Mouth("ふんす3", "人"),
    Mouth("ふんす4", "亠"),
    Mouth("ふんす5", "𖥦"),
    Mouth("ふんす6", "ꕁ"),
    Mouth("ペロリ1", "⩌"),
    Mouth("ペロリ2", "ڡ"),
    Mouth("小さい1", "⏒"),
    Mouth("小さい2", "꜀"),
    Mouth("小さい3", "۔"),
    Mouth("しゃくれ1", "𞤖"),
    Mouth("しゃくれ2", "ڪ"),
    Mouth("しゃくれ3", "ܒ"),
    Mouth("さ", "さ"),
    Mouth("ち", "ち"),
    Mouth("歯茎ムキッ", "益"),
    Mouth("くちびる", "ਊ"),
    Mouth("ひげ", "灬"),
    Mouth("鼻つき波線", "·̫"),
    Mouth("オメガ", "Ω"),
    Mouth("上ニコニコ", "⌒"),
    Mouth("ヤンス", "ڼ"),
    Mouth("ヌベスコ", "ةڼ"),
    Mouth("小さい鼻と口", "ة"),
    Mouth("土曜日ど", "j"),
    Mouth("土曜日ど", "ｊ"),
    Mouth("土曜日ど", "J"),
    Mouth("土曜日ど", "Ｊ"),
    Mouth("パァ", "ᐛ"),
  ],
};

const Cheeks = {
  id:"cheek",
  label:"ほお",
  items:[
    Cheek("なし"),
    Cheek("スペース", " "),
    Cheek("スペース", "　"),
    Cheek("ほお1", "#"),
    Cheek("ほお1", "◎"),
    Cheek("ほお1", "○"),
    Cheek("ほお1", "〇"),
    Cheek("ほお1", "◍"),
    Cheek("ほお1", "•̤"),
    Cheek("ほお1", "◌"),
    Cheek("ほお1", "⸗"),
    Cheek("ほお1", "⸝⸝"),
    Cheek("ほお1", "⸝"),
    Cheek("ほお1", "…"),
    Cheek("ほお1", "･･"),
    Cheek("ほお1", "･･･"),
    Cheek("ほお1", "∴"),
    Cheek("ほお1", "∵"),
    Cheek("ほお1", "๑"),
    Cheek("ほお1", "∅"),
    Cheek("ほお1", "="),
    Cheek("ほお1", "三"),
    Cheek("ほお1", "═"),
    Cheek("ほお1", "*"),
    Cheek("ほお1", "＊"),
    Cheek("ほお1", "+"),
    Cheek("ほお1", "＋"),
    Cheek("ほお1", "†"),
    Cheek("ほお1", "‡"),
    Cheek("ほお1", "O"),
    Cheek("ほお1", "｡"),
    Cheek("ほお1", "。"),
    Cheek("ほお1", "."),
    Cheek("ほお1", ".."),
    Cheek("ほお1", "..."),
    Cheek("ほお1", "​̤ "),
    Cheek("ほお1", "灬"),
    Cheek("ほお1", "⺌"),
    Cheek("ほお1", ..."⊱⊰"),
    Cheek("ほお1", ..."≫≪"),
    Cheek("ほお1", ..."><"),
    Cheek("ほお1", ..."＞＜"),
    Cheek("ほお1", ..."⚞⚟"),
    Cheek("ほお1", " )", "( "),
    Cheek("ほお1", " ）", "（ "),
    Cheek("ほお1", "▒"),
    Cheek("ほお1", "▓"),
  ],
};

const Bodies = {
  id:"body",
  label:"胴体",
  items:[
    Body("なし"),
    Body("右指さし1", [
      Insert.After("☞", InsertTarget.outline.left),
      Insert.After("☞", InsertTarget.outline.right),
    ]),
    Body("右指さし2", [
      Insert.After("☞", InsertTarget.outline.left),
      Insert.Before("☞", InsertTarget.outline.right),
    ]),
    Body("右指さし3", [
      Insert.Before("☞", InsertTarget.outline.left),
      Insert.Before("☞", InsertTarget.outline.right),
    ]),
    Body("右指さし4", [
      Insert.Before("☞", InsertTarget.outline.left),
      Insert.After("☞", InsertTarget.outline.right),
    ]),
    Body("上指さし", [
      Insert.After("☝", InsertTarget.outline.left),
      Insert.After("☝", InsertTarget.outline.right),
    ]),
    Body("ハイタッチ", [
      Insert.After("✋", InsertTarget.outline.left),
      Insert.After("✋", InsertTarget.outline.right),
    ]),
    Body("パァ", [
      Insert.Before("👐", InsertTarget.outline.right),
    ]),
    Body("ちょうちょ", [
      Insert.After("👐", InsertTarget.outline.right),
    ]),
    Body("ダブルピース", [
      Insert.After("✌", InsertTarget.outline.left),
      Insert.Before("✌", InsertTarget.outline.right),
    ]),
    Body("挙手A-1", [
      Insert.After("∩", InsertTarget.outline.left),
      Insert.After("∩", InsertTarget.outline.right),
    ]),
    Body("挙手A-2", [
      Insert.After("∩", InsertTarget.outline.left),
      Insert.Before("∩", InsertTarget.outline.right),
    ]),
    Body("挙手A-3", [
      Insert.Before("∩", InsertTarget.outline.left),
      Insert.Before("∩", InsertTarget.outline.right),
    ]),
    Body("挙手A-4", [
      Insert.Before("∩", InsertTarget.outline.left),
      Insert.After("∩", InsertTarget.outline.right),
    ]),
    Body("挙手B-1", [
      Insert.Before("٩", InsertTarget.outline.left),
      Insert.After("۶", InsertTarget.outline.right),
    ]),
    Body("ダンス1", [
      Insert.Before("ヽ", InsertTarget.outline.left),
      Insert.After("ゝ", InsertTarget.outline.right),
    ]),
    Body("ダンス2", [
      Insert.Before("ヾ", InsertTarget.outline.left),
      Insert.After("ゞ", InsertTarget.outline.right),
    ]),
    Body("ダンス3", [
      Insert.Before("＼", InsertTarget.outline.left),
      Insert.After(">", InsertTarget.outline.right),
    ]),
    Body("ダンス4", [
      Insert.Before("＼", InsertTarget.outline.left),
      Insert.After("＞", InsertTarget.outline.right),
    ]),
    Body("ダンス5", [
      Insert.Before("＜", InsertTarget.outline.left),
      Insert.After("／", InsertTarget.outline.right),
    ]),
    Body("ダンス7", [
      Insert.Before("く", InsertTarget.outline.left),
      Insert.After("ノ", InsertTarget.outline.right),
    ]),
    Body("ダンス7", [
      Insert.Before("<", InsertTarget.outline.left),
      Insert.After("ﾉ", InsertTarget.outline.right),
    ]),
    Body("ぞい1", [
      Insert.Before("ﾠ٩", InsertTarget.outline.right),
      Insert.After("۶ ", InsertTarget.outline.left),
    ]),
    Body("ぞい2", [
      Insert.Before("٩ ", InsertTarget.outline.left),
      Insert.After(" و ", InsertTarget.outline.right),
    ]),
    Body("ぞい3", [
      Insert.After("ง", InsertTarget.outline.left),
      Insert.After("ง", InsertTarget.outline.right),
    ]),
    Body("ずいずい", [
      Insert.Before("ง", InsertTarget.outline.left),
      Insert.After("ว", InsertTarget.outline.right),
    ]),
    Body("はりきり1", [
      Insert.Before("ᕙ", InsertTarget.outline.left),
      Insert.After("ᕗ", InsertTarget.outline.right),
    ]),
    Body("はりきり2", [
      Insert.Before("ᕦ", InsertTarget.outline.left),
      Insert.After("ᕤ", InsertTarget.outline.right),
    ]),
    Body("走る", [
      Insert.Before("ᕕ", InsertTarget.outline.left),
      Insert.After("ᕗ", InsertTarget.outline.right),
    ]),
    Body("うらめしや", [
      Insert.Before("ᕕ", InsertTarget.outline.left),
      Insert.Before("ᕕ", InsertTarget.outline.right),
    ]),
    Body("肉球", [
      Insert.Before("ฅ", InsertTarget.outline.left),
      Insert.After("ฅ", InsertTarget.outline.right),
    ]),
    Body("肉球", [
      Insert.After("ฅ", InsertTarget.outline.left),
      Insert.Before("ฅ", InsertTarget.outline.right),
    ]),
    Body("ｳｰﾊﾟｰﾙｰﾊﾟｰ", [
      Insert.Before("⊱", InsertTarget.outline.left),
      Insert.After("⊰", InsertTarget.outline.right),
    ]),
    Body("手1", [
      Insert.After("﹅", InsertTarget.outline.left),
      Insert.Before("﹅", InsertTarget.outline.right),
    ]),
    Body("手2", [
      Insert.After("ヽ", InsertTarget.outline.left),
      Insert.Before("ヽ", InsertTarget.outline.right),
    ]),
    Body("お手上げ1", [
      Insert.Before("⟅", InsertTarget.outline.left),
      Insert.After("⟆", InsertTarget.outline.right),
    ]),
    Body("お手上げ2", [
      Insert.Before("𐂐", InsertTarget.outline.left),
      Insert.After("𐂐", InsertTarget.outline.right),
    ]),
    Body("ツインテール", [
      Insert.Before("乙", InsertTarget.outline.left),
      Insert.After("乙", InsertTarget.outline.right),
    ]),
    Body("聞かれている", [
      Insert.Before("👂", InsertTarget.outline.left),
      Insert.After("👂", InsertTarget.outline.right),
    ]),
    Body("翼？", [
      Insert.Before("꧁", InsertTarget.outline.left),
      Insert.After("꧂", InsertTarget.outline.right),
    ]),
  ],
};

const defaultOptions = {
  body:Bodies.items[0],
  outline:Outlines.items[0],
  cheek:Cheeks.items[0],
  eye:Eyes.items[0],
  mouth:Mouths.items[0],
};

const hl = (val) => html`<span class="highlight">${val}</span>`;
const ll = (val) => html`<span class="lowlight">${val}</span>`;

const style = css`
:host{
  display:flex;
  flex-flow:column;
}
.previewList{
  padding:8px;
  gap:8px;
  user-select:none;
  overflow-y:scroll;
  align-items:start;
}

.previewItem{
  border-radius:4px;
  border:1px solid lightgray;
  width:100px;
  min-height:100px;
  flex-basis:100px;
  overflow:hidden;
  white-space:nowrap;
}
.previewItem .content{
  color:lightgray;
}
.previewItem .content>.highlight{
  color:black;
}
.previewItem .content>.lowlight{
  color:black;
  opacity:0.2;
}
.previewItem>.name{
  padding:2px 8px;
  border-top:1px solid lightgray;
  background:white;
  font-size:0.8rem;
}
`;



class PartsPicker extends BaseElement {
  static get styles(){
    return [super.styles, style];
  }
  static get properties(){
    return {
      partsGroups:{type:Array},
      selection:{type:Number},
    };
  }
  #selectionParts;
  constructor(){
    super();
    this.partsGroups = [
      Outlines,
      Cheeks,
      Eyes,
      Mouths,
      Bodies,
    ];
    this.selection=this.partsGroups[0].id;
    this.#selectionParts = {...defaultOptions};
  }
  render(){
    return html`
    <div class="fill col">
      <div class="row" style="gap:4px;padding:4px;border-bottom:lightgray 1px solid;background:white;">
        ${this.partsGroups.map(({id, label})=>html`
          <button
            @click=${e=>{
              this.selection = id; 
            }}
          >${label}</button>
        `)}
      </div>
      <div class="grow row wrap previewList">
      ${when(this.selection!=undefined, ()=>{
        const partsGroup = this.partsGroups.find(i=>i.id === this.selection);
        return partsGroup.items.map(item=>html`
          <div class="col previewItem" @click=${e=>{
            this.#selectionParts[partsGroup.id] = item;
            this.emit("change", {selectionParts:this.#selectionParts});
          }}>
            <span class="centering grow">
              <span class="content">${item.content(this.#selectionParts)}</span>
            </span>
            <span class="name">${item.name}</span>
          </div>
        `)
      })}
      </div>
    </div>
    `;
  }
}
customElements.define("parts-picker", PartsPicker);