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

let regexs = new Map();
for (let word of warekiMap.keys()) {
	regexs.set(word, new RegExp(`(${word}\s*)(元年|\\d+年?|[${wideNumAllChars}]+年?)(.{0,10})?`, 'gi'));
}

const convWareki = (node) => {
	let content = node.textContent;
	for (let [word, wareki] of warekiMap) {
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
				if(null !== sCheck.match(new RegExp(srSeireki, 'i'))){
					return `${sHead}${sNum}${sExt}`; // no changed
				}
			}

			sExt = (sExt)? sExt : '';
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
			return `${sHead}${sNum}<${seireki}>${sExt}`;
		});
	}

	return content;
};
