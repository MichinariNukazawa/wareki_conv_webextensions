/**
 * Substitutes warekis into text nodes.
 */
function replaceText (node) {
	if (node.nodeType === Node.TEXT_NODE) {
		if (node.parentNode && node.parentNode.nodeName === 'TEXTAREA') {
			return;
		}

		let content = node.textContent;
		content = convWareki(content);
		node.textContent = content;
	}
	else {
		for (let i = 0; i < node.childNodes.length; i++) {
			replaceText(node.childNodes[i]);
		}
	}
}

replaceText(document.body);

// Now monitor the DOM for additions and substitute wareki into new nodes.
// @see https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver.
const observer = new MutationObserver((mutations) => {
	mutations.forEach((mutation) => {
		if (mutation.addedNodes && mutation.addedNodes.length > 0) {
			// This DOM change was new nodes being added. Run our substitution
			// algorithm on each newly added node.
			for (let i = 0; i < mutation.addedNodes.length; i++) {
				const newNode = mutation.addedNodes[i];
				replaceText(newNode);
			}
		}
	});
});
observer.observe(document.body, {
	childList: true,
	subtree: true
});
