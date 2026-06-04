.PHONY: build dist

build: dist
	node alignVersion.js

dist:
	npx vite build && npx vite build --config vite.main.config.js & wait
