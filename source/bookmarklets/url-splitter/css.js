const separatorDefine = `
width: 1em;
margin: 0 1em;
`;
const closeButtonColor = '#6609cf';
const closeButtonColorHover = '#bca8ff';
const fontFamilyMonospace = 'Consolas, \'Courier New\', Courier, Monaco, monospace';
// classes.textのpadding-horとfont-sizeから
const toFomulaTextKeyValueSpanWidth = () => '(100% - 3em) / 2';
const toFormulaTextWidth = (basis) => `(${basis}) - 2.75em`;

export const Css = (appClass, apprefix, classes, states, intervals) => `
.${appClass} {
  font-family:
    "Montserrat","游ゴシック",YuGothic,
    "ヒラギノ角ゴ ProN W3","Hiragino Kaku Gothic ProN",
    "メイリオ",Meiryo,sans-serif;
  z-index: 2147483647;
  position: fixed;
  top: 5px;
  left: 5px;
  overflow: auto;
  max-height: calc(100% - 5px);
  max-width: calc(100% - 5px - 5px);
  background: #281f3e;
  color: #ccc;
  padding: 1em;
  font-size: 20px;
  box-shadow: 3px 3px 5px rgba(0, 0, 0, 0.5);
  transform-origin: top;
  transform: scale(1, 0);
  opacity: 0;
  transition:
    box-shadow 0.2s ease-out,
    transform ${intervals.outer.open}ms ease-out,
    opacity ${intervals.outer.open}ms ease-out
  ;
  user-select: none;
}
.${appClass} {
  box-sizing: border-box;
}
.${classes.close} {
  box-sizing: content-box;
}
.${appClass}:hover {
  box-shadow: 5px 5px 15px rgba(0, 0, 0, 0.75);
  transition:
    box-shadow 0.3s ease-out,
    transform ${intervals.outer.close}ms ease-out,
    opacity ${intervals.outer.close}ms ease-out
  ;
}
.${appClass}.${states.active} {
  transform: scale(1, 1);
  opacity: 1;
}
@keyframes ${apprefix(`fade-in-${appClass}`)} {
  from {
    transform: scale(1, 0);
    opacity: 0;
  }
  to {
    transform: scale(1, 1);
    opacity: 1;
  }
}
.${classes.head} {
  display: flex;
  justify-content: space-between;
  opacity: 0;
  height: 1.6em;
  overflow-y: hidden;
}
.${classes.head}.${states.active} {
  opacity: 1;
  transition: opacity ${intervals.head}ms ease-out;
}
.${classes.title} {

}
.${classes.copiedMessage} {
  border-radius: 0.5em;
  position: absolute;
  color: #000;
  background: #ccc;
  padding: 0.3em 0.75em;
  font-size: 0.5em;
  font-family: ${fontFamilyMonospace};
  overflow: hidden;
  max-width: calc(${toFormulaTextWidth('80%')});
  white-space: nowrap;
  text-overflow: ellipsis;
  pointer-events: none;

  transform-origin: bottom;
  transform: translateY(100%);
  opacity: 0;
  transition:
    transform ${intervals.copied.remove}ms ease-out,
    opacity ${intervals.copied.remove / 2}ms ease-out;
}
.${classes.copiedMessage}.${states.active} {
  transform: translateY(0);
  opacity: 1;
  transition:
    transform ${intervals.copied.add}ms ease-out,
    opacity ${intervals.copied.add}ms ease-out;
}
.${classes.close} {
  cursor: pointer;
  position: relative;
  width: 1.4em;
  height: 1.4em;
  border: 0.1em solid ${closeButtonColor};
  border-radius: 100%;
  opacity: 0;
  transition:
    border 0.2s ease-out;
}
.${classes.close}::before,
.${classes.close}::after {
  position: absolute;
  content: '';
  background: ${closeButtonColor};
  opacity: 0;
  transition:
    background 0.2s ease-out;
}
.${classes.close}.${states.active} {
  opacity: 1;
  animation: ${apprefix(`fade-in-${classes.close}`)} 1s ease-out;
}
@keyframes ${apprefix(`fade-in-${classes.close}`)} {
  0% {
    opacity: 0;
    border-color: ${closeButtonColorHover};
  }
  75% {
    opacity: 1;
    border-color: ${closeButtonColorHover};
  }
  100% {
    border-color: ${closeButtonColor};
  }
}
.${classes.close}.${states.active}::before,
.${classes.close}.${states.active}::after {
  opacity: 1;
  /* forwardsで終わらせないために静的にopacity:1を書く必要があるけど
     animation-delay使うとdelay終わるまで静的定義が露見してしまうので
     範囲で制御
   */
}
.${classes.close}.${states.active}::before {
  animation:
    ${apprefix(`fade-in-${classes.close}-pseudo`)} 1.5s ease-out,
    ${apprefix(`fade-in-${classes.close}-spin-before`)} 0.5s linear 3
  ;
}
.${classes.close}.${states.active}::after {
  animation:
    ${apprefix(`fade-in-${classes.close}-pseudo`)} 1.5s ease-out,
    ${apprefix(`fade-in-${classes.close}-spin-after`)} 0.5s linear 3
  ;
}
@keyframes ${apprefix(`fade-in-${classes.close}-pseudo`)} {
  0% {
    opacity: 0;
  }
  33% {
    opacity: 0;
    background: ${closeButtonColorHover};
  }
  50% {
    opacity: 1;
    background: ${closeButtonColorHover};
  }
  100% {
    background: ${closeButtonColor};
  }
}
@keyframes ${apprefix(`fade-in-${classes.close}-spin-before`)} {
  0% {
    transform: rotate(45deg);
  }
  25% {
    transform: rotate(135deg);
  }
  50% {
    transform: rotate(225deg);
  }
  75% {
    transform: rotate(315deg);
  }
  100% {
    transform: rotate(405deg);
  }
}
@keyframes ${apprefix(`fade-in-${classes.close}-spin-after`)} {
  0% {
    transform: rotate(225deg);
  }
  25% {
    transform: rotate(315deg);
  }
  50% {
    transform: rotate(405deg);
  }
  75% {
    transform: rotate(495deg);
  }
  100% {
    transform: rotate(585deg);
  }
}
.${classes.close}::before {
  top: 0.2em;
  left: 0.6em;
  width: 0.2em;
  height: 1em;
  transform: rotate(45deg);
}
.${classes.close}::after {
  top: 0.6em;
  left: 0.2em;
  width: 1em;
  height: 0.2em;
  transform: rotate(225deg);
}
.${classes.close}:hover {
  border-color: ${closeButtonColorHover};
  transition: border 0.3s ease-out;
}
.${classes.close}:hover::before,
.${classes.close}:hover::after {
  background: ${closeButtonColorHover};
  transition: background 0.3s ease-out;
}
.${classes.close}:active {
  transform-origin: center;
  transform: scale(0.9);
}
.${classes.ul} {
  overflow: hidden;
  list-style-type: none;
  padding: 0;
  margin: 0;
}
.${classes.ul} > li {
  margin: 1em 0 0 0;
  display: flex;
  position: relative;
}
.${classes.ul} > li:not(:last-child) {
  margin-top: 1em;
}
.${classes.ul} > li.${classes.categoryTop} {
  padding-top: 0;
}
.${classes.ul} > li.${states.active}.${classes.categoryTop} {
  padding-top: 1em;
  transition:
    border ${intervals.valueColumn.fadeIn}ms ease-out ${
  intervals.valueColumn.fadeIn
}ms,
    padding ${intervals.valueColumn.fadeIn}ms ease-out ${
  intervals.valueColumn.fadeIn
}ms
    ;
}
.${classes.ul} > li.${classes.categoryTop}::before {
  position: absolute;
  content: '';
  width: 100%;
  top: 0;
  left: 0;
  border: solid 1px #ccc;
  transform-origin: left;
  transform: translateX(150%) scaleX(1.1);
}
.${classes.ul} > li.${states.active}.${classes.categoryTop}::before {
  animation:
  ${apprefix(`fade-in-${classes.categoryTop}-border`)} ${intervals.valueColumn
  .fadeIn + 500}ms ease-out ${intervals.valueColumn.fadeIn}ms
forwards;
}
@keyframes ${apprefix(`fade-in-${classes.categoryTop}-border`)} {
  0% {
    transform: translateX(150%) scaleX(1.1);
  }
  50% {
    transform: translateX(0) scaleX(1.1);
  }
  100% {
    transform: translateX(0) scaleX(1);
  }
}
.${classes.ul} > li > .${classes.nameColumn}{
  opacity: 0;
}
.${classes.ul} > li.${states.active} > .${classes.nameColumn}{
  opacity: 1;
  transition: opacity ${intervals.valueColumn.fadeIn}ms ease-out ${intervals
  .valueColumn.fadeIn
  + intervals.valueColumn.fadeIn
  + 200}ms;
}
.${classes.ul} > li > .${classes.valueColumn}{
  opacity: 0;
  transform: translateX(-200%);
}
.${classes.ul} > li.${states.active} > .${classes.valueColumn}{
  animation: ${apprefix(`fade-in-${classes.valueColumn}`)} ${
  intervals.valueColumn.fadeIn
}ms ease-out forwards;
}
@keyframes ${apprefix(`fade-in-${classes.valueColumn}`)} {
  from {
    opacity: 0;
    transform: translateX(-200%);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}
.${classes.nameColumn} {
  display: flex;
  align-items: center;
  width: 4em;
}
.${classes.valueColumn} {
  width: 33em;
  display: flex;
  text-align: center;
  position: relative;
}
.${classes.valueColumn}::before {
  position: absolute;
  content: '';
  z-index: 100;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: #eee;
  transform-origin: right;
  transform: scaleX(1);
  border-radius: 0 10em 10em 0;
  opacity:1;
}
.${classes.ul} > li.${states.active} > .${classes.valueColumn}::before {
  transform: scaleX(0);
  border-radius: 0 0 0 0;
  opacity: 0;
  transition:
    transform 500ms ease-out ${intervals.valueColumn.fadeIn}ms,
    border-radius 500ms ease-out ${intervals.valueColumn.fadeIn}ms,
    opacity 1000ms ease-out ${intervals.valueColumn.fadeIn}ms
    ;
}
.${classes.text} {
  font-family: ${fontFamilyMonospace};
  font-size: 0.75em;
  color: #eee;
  width: calc(${toFormulaTextWidth('100%')});
  padding: 0.5em 1em;
  outline: none;
  background: transparent;
  border: none;
  user-select: text;
  cursor: pointer;
  transition: background 0.2s ease-out;
}
.${classes.text}::selection {
  background: #7b3fa1;
  color: #fff;
}
.${classes.text}:hover {
  background: #000;
  color: #fff;
  transition: background 0.3s ease-out;
}
.${classes.text}:active {
  color: transparent;
  text-shadow: 1px 1px #ccc;
}
.${classes.text}:active::selection {
  color: transparent;
}
.${classes.textHost} {
  position: relative;
  width: 100%;
}
.${classes.textPath} {
  position: relative;
  width: 100%;
}
.${classes.textQueryKey} {
  position: relative;
  width: calc(${toFomulaTextKeyValueSpanWidth()});
}
.${classes.textQuerySeparator} {
  ${separatorDefine}
}
.${classes.textQueryValue} {
  position: relative;
  width: calc(${toFomulaTextKeyValueSpanWidth()});
}
.${classes.textHash} {
  position: relative;
  width: calc(${toFomulaTextKeyValueSpanWidth()});
}
.${classes.textHashSeparator} {
  ${separatorDefine}
  transform-origin: center;
  transform: rotateZ(-45deg);
}
.${classes.textHashPlain} {
  position: relative;
  width: calc(${toFomulaTextKeyValueSpanWidth()});
}
`;

export default Css;
