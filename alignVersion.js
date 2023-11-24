const fs = require("fs");

fs.readFile("package.json", (error, packageJson) => {
	if (error) {
		console.error(error);
		throw err;
	}
	var package = JSON.parse(packageJson);
	fs.readFile("src/scripts/manifest.json", (error, manifestJson) => {
		if (error) {
			console.error(error);
			throw err;
		}
		var manifest = JSON.parse(manifestJson);
		manifest.version = package.version;
		const manifestAligned = JSON.stringify(manifest);
		fs.writeFile("src/scripts/manifest.json", manifestAligned, (error) => {
			if (error) {
				throw error;
			}
		});
	});
});
