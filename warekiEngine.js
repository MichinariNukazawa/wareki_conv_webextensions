/*
 * wareki to seireki engine.
 */

let dictionary = new Map();
dictionary.set('明治', {'conv':(num)=>{return num - 33 + 1900;}});
dictionary.set('大正', {'conv':(num)=>{return num + 11 + 1900;}});
dictionary.set('昭和', {'conv':(num)=>{return num + 25 + 1900;}});
dictionary.set('平成', {'conv':(num)=>{return num - 12 + 2000;}});
dictionary.set('令和', {'conv':(num)=>{return num + 18 + 2000;}});
dictionary.set('皇紀', {'conv':(num)=>{return num - 660;}});

const warekiMap = dictionary;

const rsRekiStrNum = `元年|\\d+年?|[${wideNumAllChars}]+年?`;
let regexs = new Map();
for (let word of warekiMap.keys()) {
	regexs.set(word, new RegExp(`(${word}\s*)(${rsRekiStrNum})(.{0,10})?`, 'gi'));
}

function genPrintString(wareki, sHead, sNum, sExt){
	let num = 0;
	if('元年' === sNum){
		num = 1;
	}else if(-1 !== zenkakuArabicNumChars.indexOf(sNum[0])){
		num = convZenkakuStr2Int(sNum);
		if(isNaN(num)){
			// Warn: can not convert.
			return `${sHead}<?'${sNum}'>${sExt}`;
		}
	}else if(-1 !== kanSuuziAllChars.indexOf(sNum[0])){
		if(rKanSuuziKeta.test(sNum)){
			num = convKanSuuziWithKetaStr2Int(sNum);
		}else{
			num = convKanSuuziStr2Int(sNum);
		}
		if(isNaN(num)){
			// Warn: can not convert.
			return `${sHead}<?'${sNum}'>${sExt}`;
		}
	}else{
		num = parseInt(sNum, 10);
		if(isNaN(num)){
			// Warn: can not convert.
			return `${sHead}<?'${sNum}'>${sExt}`;
		}
	}
	const seireki = wareki.conv(num);
	let sSeireki = `${seireki}`;
	if(0 >= seireki){
		// https://ja.wikipedia.org/wiki/西暦#0と負の西暦
		sSeireki = `BCE${Math.abs(seireki) + 1}`;
	}
	return `${sHead}${sNum}<${sSeireki}>${sExt}`;
}

function getLastPrevText(node)
{
	if(null === node){
		return '';
	}

	const prevNode = node.previousSibling;
	if(null === prevNode){
		return getLastPrevText(node.parentNode);
	}
	if(null === prevNode.textContent){
		return getLastPrevText(prevNode);
	}
	if(/^\s*$/.test(prevNode.textContent)){ // 必要なのかわからないがとりあえず
		return getLastPrevText(prevNode);
	}
	return prevNode.textContent;
}

const convWareki = (node) => {
	let content = node.textContent;
	for (let [word, wareki] of warekiMap) {
		// 直前のnodeの末尾と現在のnodeの先頭を連結して、和暦になるようであれば変換を行う
		const prevText = getLastPrevText(node);
		if(prevText.endsWith(word)){
			const rRekiStrNum = new RegExp(`^(${rsRekiStrNum})`);
			content = content.replace(rRekiStrNum, (match, sNum) => {
				return genPrintString(wareki, '', sNum, '');
			});
		}

		// node内の和暦に対して変換を行う
		const regex = regexs.get(word);
		content = content.replace(regex, (match, sHead, sNum, sExt) => {
			// TODO can not able check splited text other node(prev node).
			// ex:`皇紀2587年（西暦1927年・昭和2年<1927>）`

			// skip if already exist Western calender
			// ex:`皇紀2601年（<a>1941年</a>`
			// 末尾に西暦を検出した場合に、変換をキャンセルする
			if(undefined !== sExt){
				// 後文字列がnextNodeに続いていそうであれば連結して判定
				let nextText = '';
				if(10 > sExt.length){
					const nextNode = node.nextSibling;
					if(null !== nextNode && null !== nextNode.textContent){
						nextText = nextNode.textContent;
					}
				}
				const sCheck = sExt + nextText;
				//onsole.log(`Check ext: ${sHead}-${sNum}-${sExt}-${sCheck}-`);

				const srSeireki = '^\\s*[（(<](西暦)?\\d{4}年?';
				const rSeireki = new RegExp(srSeireki);
				if(rSeireki.test(sCheck)){
					return `${sHead}${sNum}${sExt}`; // no changed
				}
			}

			sExt = (sExt)? sExt : '';
			return genPrintString(wareki, sHead, sNum, sExt);
		});
	}

	return content;
};
