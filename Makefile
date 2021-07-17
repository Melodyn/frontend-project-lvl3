
# usage
dependency:
	npm ci

# dev
serve:
	NODE_ENV=development npm run build -- --watch

lint:
	npx eslint .

build:
	npm run build
