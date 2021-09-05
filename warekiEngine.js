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
	regexs.set(word, new RegExp(`${word}\s*(元年|\\d+)年?`, 'gi'));
}

const convWareki = (content) => {
	for (let [word, wareki] of warekiMap) {
		const regex = regexs.get(word);
		content = content.replace(regex, (match, sNum) => {
				if('' === sNum){
					return match;
				}
				let num = 0;
				if('元年' === sNum){
					num = 1;
				}else{
					num = parseInt(sNum, 10);
					if(isNaN(num)){
						// Warn: can not convert.
						return match + `<?'${sNum}'>`;
					}
				}
				const seireki = wareki.conv(num);
				return match + `<${seireki}>`;
			});
	}

	return content;
};
