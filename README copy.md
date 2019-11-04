# Bifrost UI

Bifrost UI Framework - Light set of Composable Components that are dependency-free and work out of the box

## Available commands 

#### Compiling SCSS

```sh
    gulp build // to run the css build

```

#### Running Storybook

```sh
    npm run storybook
```

## Build System

Currently we don't package or bundle the components or transpile them to ES6, this component library is meant to be used within such webpack environment and because we dont export bundles together you can leverage tree-splitting to optimize your bundle.
