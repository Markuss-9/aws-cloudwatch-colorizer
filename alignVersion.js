const fs = require('fs').promises;

const updateManifestVersion = async () => {
	try {
		const packageJson = await fs.readFile('package.json', 'utf8');
		const packageParsed = JSON.parse(packageJson);

		const manifestJson = await fs.readFile('dist/manifest.json', 'utf8');
		let manifest = JSON.parse(manifestJson);
		manifest.version = packageParsed.version;

		const manifestAligned = JSON.stringify(manifest, null, 2); // Pretty-print JSON
		await fs.writeFile('dist/manifest.json', manifestAligned);

		console.log('Manifest version updated successfully');
	} catch (error) {
		console.error(error);
	}
};

updateManifestVersion();
