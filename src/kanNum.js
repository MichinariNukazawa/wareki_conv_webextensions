/*
 * wide character number
 */

// 全角数字(全角アラビア数字)
const zenkakuArabicNumChars = '０１２３４５６７８９';
// 漢数字
const kanSuuziNumChars = '〇一二三四五六七八九';
const kanSuuziKetaChars = '十百千万';
const kanSuuziOtherChars = '亖廿卄卅丗卌';
const kanSuuziOtherCharPairs = {
	'亖':4,'廿':20,'卄':20,'卅':30,'丗':30,'卌':40,
};
// 大字
const daiziNumChars = '零壱弐参肆伍陸漆捌玖';
const daiziKetaChars = '拾陌阡萬';
const daiziNumOtherChars = '壹弌貳貮弍參弎質柒';
const daiziKetaOtherChars = '什佰仟';
const daiziNumOtherCharPairs = {
	'壹':1,'弌':1,'貳':2,'貮':2,'弍':2,'參':3,'弎':3,'質':7,'柒':7,
};
//
const kanSuuziAllChars = kanSuuziNumChars + kanSuuziKetaChars
	+ kanSuuziOtherChars
	+ daiziNumChars + daiziKetaChars
	+ daiziNumOtherChars + daiziKetaOtherChars;
const wideNumAllChars = `${zenkakuArabicNumChars}${kanSuuziAllChars}`;
const rKanSuuziKeta = new RegExp(`[${kanSuuziKetaChars}${daiziKetaChars}${daiziKetaOtherChars}]`);

// 全角数字
function cZenkaku2Int(cZenkaku)
{
	return zenkakuArabicNumChars.indexOf(cZenkaku);
}
function convZenkakuStr2Int(sZenkaku)
{
	let val = 0;
	for(let i = 0; i < sZenkaku.length; i++){
		const num = cZenkaku2Int(sZenkaku[i]);
		if(-1 == num){
			// 変換を打ち切って結果を返す
			return val;
		}
		val *= 10;
		val += num
	}
	return val;
}

// 漢数字（桁漢字なし）
function cKanSuuzi2Int(cKanSuuzi)
{
	const res0 = kanSuuziNumChars.indexOf(cKanSuuzi);
	if(-1 !== res0){
		return res0;
	}
	const res1 = daiziNumChars.indexOf(cKanSuuzi);
	if(-1 !== res1){
		return res1;
	}
	const res2 = daiziNumOtherCharPairs[cKanSuuzi];
	if(undefined !== res2){
		return res2;
	}
	const res3 = kanSuuziOtherCharPairs[cKanSuuzi];
	if(undefined !== res3){
		return res3;
	}
	return -1;
}
function convKanSuuziStr2Int(sKanSuuzi)
{
	let val = 0;
	for(let i = 0; i < sKanSuuzi.length; i++){
		const num = cKanSuuzi2Int(sKanSuuzi[i]);
		if(-1 === num){
			// 変換を打ち切って結果を返す
			return val;
		}
		val *= 10;
		val += num
	}
	return val;
}

// 漢数字（桁あり）
function cKanSuuziKeta2Int(cKanSuuziKeta)
{
	const res0 = kanSuuziKetaChars.indexOf(cKanSuuziKeta) + 1;
	if(0 !== res0){
		return res0;
	}
	const res1 = daiziKetaChars.indexOf(cKanSuuziKeta) + 1;
	if(0 !== res1){
		return res1;
	}
	return daiziKetaOtherChars.indexOf(cKanSuuziKeta) + 1;
}
function convKanSuuziWithKetaStr2Int(sKanSuuzi)
{
	let val = 0;
	let num = 1;
	let isStackedNum = false;
	for(let i = 0; i < sKanSuuzi.length; i++){
		const keta = cKanSuuziKeta2Int(sKanSuuzi[i]);
		if(0 !== keta){
			val += num * (10 ** keta);
			num = 1;
			isStackedNum = false;
			continue;
		}
		const res = cKanSuuzi2Int(sKanSuuzi[i])
		if(-1 === res){
			// 変換を打ち切って結果を返す
			break;
		}else{
			if(10 <= res){
				// 20などはそのまま加算(20百で2000、などしていない想定)
				val += res;
				continue;
			}
			if(isStackedNum){
				// Warn:数字が連続することはありえない
				break;
			}
			num = res;
			isStackedNum = true;
		}
	}
	if(isStackedNum){
		val += num;
	}
	return val;
}
