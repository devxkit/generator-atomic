'use strict';
const Generator = require('yeoman-generator');
const yosay     = require('yosay');
const rename    = require('gulp-rename');
const camelCase = require('camelcase');

module.exports = class extends Generator {
  getConfigValue(name, value, check, trueValue) {
    const config = this.config.getAll();

    if (config[name] === undefined) {
      return value;
    }

    if (check === undefined) {
      check = function(config) {
        return config[name] !== undefined;
      };
    }

    if (check(config)) {
      if (trueValue !== undefined) {
        return trueValue;
      }

      return config[name];
    }

    return value;
  }

  constructor(args, opts) {
    super(args, opts);

    this.answers = {};

    const choices = ['Atom', 'Molecule', 'Organism', 'Template', 'Page'];
    this.argument('type', {
      type: String,
      required: false,
      desc: `Type of new the component: ${ JSON.stringify(choices) }`,
    });
    this.argument('name', {
      type: String,
      required: false,
      desc: 'Name of the new component',
    });
  }

  prompting() {
    this.log(
      yosay(`Welcome to the DXKit react atomic generator!`),
    );

    const choices = ['Atom', 'Molecule', 'Organism', 'Template', 'Page'];
    const prompts = [];

    if (choices.indexOf(this.options.type) === -1) {
      prompts.push({
        type: 'list',
        name: 'type',
        message: 'Which type should your component be?',
        choices,
      });
    } else {
      this.answers.type = this.options.type;
    }

    if (this.options.name === undefined) {
      prompts.push({
        type: 'input',
        name: 'name',
        message: 'Which name should your component have?',
      });
    } else {
      this.answers.name = this.options.name;
    }

    return this.prompt(prompts).then(props => {
      // To access props later use this.props.someAnswer;
      this.answers = { ...this.answers, ...props };
    });
  }

  writing() {
    const config = this.config.getAll();

    const IS_NATIVE    = config.useNative === true;
    const CREATE_INDEX = config.createIndex !== false;

    const BASE_PATH = this.getConfigValue('basePath', 'src/ui/components');

    // TODO: replace with @devxkit/react-ui-baseline
    const WITH_CLASSNAME_INTERFACE_IMPORT_PATH = this.getConfigValue(
      'withClassnameInterfaceImportPath',
      '@Framework/ui',
    );

    // TODO: replace with @devxkit/react-ui-baseline
    const WITH_STYLE_INTERFACE_IMPORT_PATH = this.getConfigValue(
      'withStyleInterfaceImportPath',
      '@Framework/ui',
    );

    const COMPONENT_TYPE = this.getConfigValue(
      'functional',
      'class_based_components',
      function(config) {
        return config.functional === true;
      },
      'functional',
    );

    const IS_FUNCTIONAL = COMPONENT_TYPE === 'functional';

    const WITH_STYLED_COMPONENTS = this.getConfigValue(
      'styledComponents',
      true,
      function(config) {
        return config.styledComponents !== true;
      },
      false,
    );

    let name = camelCase(this.answers.name, {pascalCase: true});

    if (this.answers.type.toLowerCase() === 'template') {
      name += 'Template';
    }

    if (this.answers.type.toLowerCase() === 'page') {
      name += 'Page';
    }

    this.registerTransformStream(
      rename(function(path) {
        path.basename = path.basename.replace(/(__REPLACE_THAT__)/g, name);
        path.dirname  = path.dirname.replace(/(__REPLACE_THAT__)/g, name);
      }),
    );

    let path = `${ BASE_PATH }/${ this.answers.type.toLowerCase() }s/${
      camelCase(this.answers.name, {pascalCase: true})
    }`;

    if (this.answers.type.toLowerCase() === 'template') {
      path += 'Template';
    }

    if (this.answers.type.toLowerCase() === 'page') {
      path += 'Page';
    }

    let styledComponentsType   = 'styled-components';
    let baseComponent          = 'div';
    let withClassNameClassName = `className={${
      IS_FUNCTIONAL ? '' : 'this.'
    }props.className} `;
    let withClassNameProps     = 'interface Props extends PropsWithClassName';
    let withClassNameImport    = `import {PropsWithClassName} from "${ WITH_CLASSNAME_INTERFACE_IMPORT_PATH }";\n`;

    if (config.useMacro === true) {
      styledComponentsType = 'styled-components/macro';
    }

    if (IS_NATIVE === true) {
      styledComponentsType   = 'styled-components/native';
      baseComponent          = 'Text';
      withClassNameClassName = `style={${
        IS_FUNCTIONAL ? '' : 'this.'
      }props.style} `;
      withClassNameProps     = 'interface Props extends PropsWithStyle';
      withClassNameImport    = `import {PropsWithNativeStyle} from "${ WITH_STYLE_INTERFACE_IMPORT_PATH }";\n`;
    }

    let styleImport           = `import {Root} from './${ name }.styles';`;
    let templateBaseComponent = 'Root';

    if (!WITH_STYLED_COMPONENTS) {
      styleImport           = '';
      templateBaseComponent = 'div';
      if (IS_NATIVE) {
        templateBaseComponent = 'Text';
      }
    }

    const filesToCopy = ['__REPLACE_THAT__.tsx'];

    if (config.tests !== false) {
      filesToCopy.push('__REPLACE_THAT__.test.tsx');
    }

    if (config.stories !== false) {
      filesToCopy.push('__REPLACE_THAT__.stories.tsx');
    }

    if (WITH_STYLED_COMPONENTS) {
      filesToCopy.push('__REPLACE_THAT__.style.ts');
    }

    let componentImport = `import {${ name }} from "./${ name }";\n`;
    if (CREATE_INDEX) {
      filesToCopy.push('index.tsx');
      componentImport = `import ${ name } from "./";`;
    }

    this.fs.copyTpl(
      filesToCopy.map(
        f => `${ this.templatePath(`${ COMPONENT_TYPE }/${ f }`) }`),
      this.destinationPath(path),
      {
        name,
        type: this.answers.type,
        componentImport,
        styledComponentsType,
        baseComponent,
        templateBaseComponent,
        withClassNameClassName,
        withClassNameProps,
        withClassNameImport,
        styleImport,
      },
    );
  }

  install() {}
};
