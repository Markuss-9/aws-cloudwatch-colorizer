const pretty = (e, parent, reg, regInit, spanWordChange) => {
	// const isoPattern = /^\[\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z\]/;

	var content = e.textContent;
	//? not necessary
	// if (isoPattern.test(e.textContent)) {
	//   // content = e.textContent.slice(24);
	//   content.split(reg)[1];
	// }

	const match = content.match(reg);

	if (match)
		e.innerHTML = `${content.split(regInit)[0]}${spanWordChange}${
			// content.split(reg)[1]
			match[2]
		}`;
	if (parent.getAttribute("style")) parent.removeAttribute("style");
};

export default pretty;
