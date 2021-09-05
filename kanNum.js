/*
 * kan-suuzi
 */

const zenkakuNumChars = '０１２３４５６７８９';
//const kanziNumChars = '〇一二三四五六七八九';
//const kanziKetaChars = '万千百十';

function cZenkaku2Int(cZenkaku)
{
	return zenkakuNumChars.indexOf(cZenkaku);
}

function convZenkakuStr2Int(sZenkaku)
{
	let num = 0;
	for(let i = 0; i < sZenkaku.length; i++){
		const res = cZenkaku2Int(sZenkaku[i])
		if(-1 == res){
			// 変換を打ち切って結果を返す
			return num;
		}
		num *= 10;
		num += res
	}

	return num;
}
