
# usage
dependency:
	npm ci

# dev
serve:
	NODE_ENV=development npx webpack serve

lint:
	npx eslint .

build:
	npm run build
