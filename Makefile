
# usage
dependency:
	npm ci

# dev
serve:
	npm run build -- --watch

lint:
	npx eslint .

build:
	npm run build
