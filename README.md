# DevXKit - React atomic component generator

A basic yeoman based generator to create atomic components for react.

* atomic design
* react
* react-native
* styled-components
* jest

## Install

`yarn global add @devxkit/generator-atomic`

`npm -g install @devxkit/generator-atomic`

## Config

<figure>
  <figcaption>File: .yo-rc.json</figcaption>

```json
{
  "@devxkit/dxkit-atomic": {
    "createIndex": true,
    "functional": true,
    "basePath": "src/ui/components",
    "withClassnameInterfaceImportPath": "@devxkit/react-ui-baseline", 
    "withStyleInterfaceImportPath": "@devxkit/react-ui-baseline",
    "tests": true,
    "stories": true,
    "styledComponents": true,
    "useNative":false, // native and macro can't be used together
    "useMacro": false
  }
}
```

</figure>

## Related projects

* devxkit/react-ui-baseline
