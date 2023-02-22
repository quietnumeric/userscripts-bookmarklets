/* async/awaitをbabel7.4以降で使うためのcore-jsとregenerator-runtimeのセット
使う場合は
yarn add -D core-js@3 regenerator-runtime
但し、ブラウザごとに文字数上限のあるブックマークレットでは
トランスパイル後のコードにこれらが含まれることで一気に上限を突破してしまうので
試行ログとして残すだけにとどめてPromiseでがんばる
*/
import 'core-js/stable';
import 'regenerator-runtime/runtime';
