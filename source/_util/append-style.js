// css定義(多階層)文字列をrule配列に分割
const splitCssDefine = (source) => {
  if (!source) return [];
  const plainSource = source.trim();
  if (plainSource === '') return [];
  // 戻り値
  const splittedArray = [];
  // 下った階層数(0 = 切り出すべきトップ階層)
  let downedStairCount = 0;
  // 再帰で配列に切り出し
  (function recurse(splittingSource, searchStartIndex = 0) {
    // インデックスから分割中文字列の終わりまでが検索対象
    const searchingSource = splittingSource.slice(searchStartIndex);
    // 検索開始から最短位置の括弧を取得
    const bracketIndexFromSearchStart = searchingSource.search(/[{}]/);
    const bracket = searchingSource.charAt(bracketIndexFromSearchStart);
    // 開き括弧であれば階層を下り、閉じ括弧であれば階層を上る
    downedStairCount += bracket === '{' ? 1 : -1;
    // 最適化目的の末尾再帰のため、先行代入
    let remainsSource = splittingSource;
    // 次の要素(分割抽出する場合は残る文字列、しない場合は検索の)開始位置
    let nextElementStartIndex = searchStartIndex + bracketIndexFromSearchStart + 1;
    // トップ階層に戻っていれば分割抽出
    if (downedStairCount === 0) {
      // 先頭から次の要素の開始位置前までを抽出
      splittedArray.push(
        splittingSource.slice(0, nextElementStartIndex).trim(),
      );
      // 次の要素の開始位置以降が残りの分割中文字列
      remainsSource = splittingSource.slice(nextElementStartIndex);
      // 残っていなければ再帰終了
      if (remainsSource.trim().length === 0) return;
      // 残っていればその先頭から括弧を検索
      nextElementStartIndex = 0;
    }
    // 残りの分割中文字列から次の括弧を検索
    recurse(remainsSource, nextElementStartIndex);
  })(plainSource);
  return splittedArray;
};

const createStyleSheet = () => {
  const style = document.createElement('style');
  document.head.appendChild(style);
  return style.sheet;
};

export const appendStyle = (define, sheet = createStyleSheet()) => {
  // 記述順どおりにinsertRuleしようと思ったらindexを管理するかsplit結果をreverseするべき
  splitCssDefine(define)
    .reverse()
    .forEach((rule) => {
      if (rule.trim().length === 0) return;
      sheet.insertRule(`${rule}`, 0);
    });
};

// css定義をstylesheetに適用
export default appendStyle;
