'use strict'

import path from 'path';

import chalk from 'chalk';
import chip from 'chip';
import colors from 'colors';

import readConfig from '../tasks/read-config';
import serializeBlueprints from './tasks/serialize-blueprints';
import buildBoilerplate from './tasks/build-boilerplate';

const log = chip();

// Some example commands
//
// bluprint generate [component] [TodosList]
// The first argument is __blueprintType__
// The second argument is __templateName__
// The output is  __root__/__bluePrintTypePlur__/__templateName__
// or             __root__/components/TodosList
//
// bluprint generate [component] [todos/list] --pod
// The first argument is __blueprintType__
// The second argument is __templateDirectory__
// The output is  __root__/__podsRoot__/__templateDirectory__/__blueprintType__
// or             __root__/__podsRoot__/todos/list/component
//
// bluprint generate [component] [todos] [List] --pod
// The first argument is __blueprintType__
// The second argument is __templateDirectory__
// The third argument is __templateName__
// The output is  __root__/__podsRoot__/__templateDirectory__/__blueprintTypePlur__/__templateName__
// or             __root__/__podsRoot__/todos/components/List
//

export default function generate(args, podsFlag, globalConfigOptions) {
  // Computed __blueprintRoot__ using config
  const __blueprintRoot__ = globalConfigOptions.blueprintsDirectory;

  // First argument is the type of blueprint we're generating
  const __blueprintType__ = args[0];
  const __blueprintTypePlur__ = __blueprintType__.plural()

  readConfig(path.join(__blueprintRoot__, __blueprintType__, 'config.json'), blueprintConfigOptions => {
    const usePods = blueprintConfigOptions.forcePods || podsFlag;

    // Computed __destinationRoot__ using config
    const __destinationRoot__ = usePods && globalConfigOptions.podsDirectory ?
        path.join(globalConfigOptions.rootDirectory, globalConfigOptions.podsDirectory) :
        globalConfigOptions.rootDirectory;

    // If using types layout the second argument is the template name
    // Is using pods layout the second argument is the target directory

    // If using pods we accept template name as the third arguments
    // This allows us to create typed folders inside pods directories
    // i.e. todos/components
    const __templateName__ = usePods ? args[2] : args[1];
    const __templateDirectory__ = usePods ? args[1] : __blueprintTypePlur__;


    // Construct the destination directory
    // If using pods and supplied a template name we must include the typed
    // folder name in the structure
    const __destinationDirectory__ = usePods && __templateName__ ?
        path.join(__destinationRoot__, __templateDirectory__, __blueprintTypePlur__) :
        path.join(__destinationRoot__, __templateDirectory__);

    const __logPath__ = usePods && __templateName__ ?
        `${__templateDirectory__} ${ __templateName__}` :
        __templateName__ || __templateDirectory__;
    log('  installing ' + chalk.white(`${__blueprintType__} ${__logPath__}`));

    // Task flow
    serializeBlueprints(__blueprintRoot__, __blueprintType__, (blueprints) =>
      buildBoilerplate(blueprints, __destinationDirectory__, __templateDirectory__, __templateName__)
    );
  });
};
