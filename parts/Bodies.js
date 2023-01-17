import { Insert, InsertTarget } from "../libs/emoticon/core.js";
import { Body } from "../libs/emoticon/Parts.js";

export default {
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