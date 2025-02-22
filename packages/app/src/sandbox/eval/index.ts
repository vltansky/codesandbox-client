/* eslint-disable import/no-named-as-default-member, import/default, import/no-named-as-default */
import {
  react,
  vue,
  parcel,
  svelte,
  preact,
  reactTs,
  angular,
  cxjs,
  babel,
  dojo,
  custom,
  reason,
  esmReact,
} from '@codesandbox/common/lib/templates';

import { isBabel7 } from '@codesandbox/common/lib/utils/is-babel-7';
import { isPreact10 } from '@codesandbox/common/lib/utils/is-preact-10';
import { PackageJSON } from '@codesandbox/common/lib/types';
import {
  reactPresetV1,
  reactPresetV3,
  reactPresetV4,
} from './presets/create-react-app';
import reactTsPreset from './presets/create-react-app-typescript';
import vuePreset from './presets/vue-cli';
import { preactPreset, preactPresetV8 } from './presets/preact-cli';
import sveltePreset from './presets/svelte';
import angularPreset from './presets/angular-cli';
import parcelPreset from './presets/parcel';
import babelPreset from './presets/babel-repl';
import cxjsPreset from './presets/cxjs';
import reasonPreset from './presets/reason';
import dojoPreset from './presets/dojo';
import customPreset from './presets/custom';
import { supportsNewReactTransform } from './presets/create-react-app/utils';

export default async function getPreset(template: string, pkg: PackageJSON) {
  switch (template) {
    case esmReact.name:
    case react.name:
      if (
        await supportsNewReactTransform(pkg.dependencies, pkg.devDependencies)
      ) {
        const preset = reactPresetV4();

        if (template === esmReact.name) {
          preset.experimentalEsmSupport = true;
        }

        return preset;
      }

      if (isBabel7(pkg.dependencies, pkg.devDependencies)) {
        return reactPresetV3();
      }

      return reactPresetV1();

    case preact.name:
      if (isPreact10(pkg.dependencies, pkg.devDependencies)) {
        return preactPreset();
      }

      return preactPresetV8();
    case reactTs.name:
      return reactTsPreset();
    case reason.name:
      return reasonPreset();
    case vue.name:
      return vuePreset();

    case svelte.name:
      return sveltePreset();
    case angular.name:
      return angularPreset();
    case parcel.name:
      return parcelPreset();
    case babel.name:
      return babelPreset();
    case cxjs.name:
      return cxjsPreset();
    case dojo.name:
      return dojoPreset();
    case custom.name:
      return customPreset();
    default:
      return reactPresetV3();
  }
}
