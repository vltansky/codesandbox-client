import puppeteer from 'puppeteer';
import { loadSandboxRetry, SECOND } from './utils';

const SANDBOXES = [
  'new',
  // 'preact',
  'vue',
  'svelte',
  'react-ts',
  { id: 'reduxjs-redux-examples-todomvc', threshold: 0.04 },
  'vVoQVk78',
  'faceyspacey-redux-first-router-codesandbox',
  'mZRjw05yp',
  'o29j95wx9',
  'k3q1zjjml5',
  'reduxjs-redux-examples-real-world',
  'CompuIves-codesandbox-presentation',
  'lp5rjr0z4z',
  'nOymMxyY',
  'y26rj99yov', // react transition
  // '6w66jzw3mn', // material-design & preact
  '4j7m47vlm4', // material-ui
  'cssinjs-egghead-templates-and-variables', // postcss egghead
  'xp5qy8r93q', // babel example
  'angular', // angular template
  // Sass importing
  '2ppkvzx570', // nested imports
  'vanilla',
  'n5wy74w8vl', // material-ui generated demo
  'algolia-doc-onboarding-demos-angular-media', // algolia angular demo
  { id: 'ymjwwrw2rj', threshold: 0.05 }, // empty path
  { id: '98o3k45m8p', threshold: 0.05 }, // direct path test
  'pm79km5lmj', // babel macros with styled components
  'j2wpjwqj93', // sandbox with need of transpiling in node_modules
  '1oknw8q8zq', // Parcel with async function (no regeneratorRuntime error)
  '31kn7voz4q', // cxjs
  'zw9zjy0683', // aurelia
  'zx22owojr3', // vue v-slot test
  // '4888omqqz7', // material-ui https://github.com/codesandbox/codesandbox-client/issues/1741,
  'sebn6', // babel plugin dynamically downloaded
  'utmms', // babel plugin pragmatic-jsx which requires other babel plugin
  'circle-svg', // svgs don't render properly if you use document.createElement
  'vue-3-basics-program-easily', // vue w/ custom html
  'scss-mixins',
];

// Logic for parallelizing the tests
const PARALLEL_NODES = Number.parseInt(process.env.CIRCLE_NODE_TOTAL, 10) || 1;
const PARALLEL_INDEX = Number.parseInt(process.env.CIRCLE_NODE_INDEX, 10) || 0;

const batchSize = Math.floor(SANDBOXES.length / PARALLEL_NODES);
const sandboxesToTest = SANDBOXES.slice(
  batchSize * PARALLEL_INDEX,
  batchSize * (PARALLEL_INDEX + 1)
);

describe('sandboxes', () => {
  let browser = puppeteer.launch({
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });
  afterAll(() => {
    browser.close();
  });

  sandboxesToTest.forEach(sandbox => {
    const id = sandbox.id || sandbox;
    const threshold = sandbox.threshold || 0.01;

    it(
      `loads the sandbox '${id}'`,
      async () => {
        browser = await browser;

        const page = await loadSandboxRetry(browser, id, 45 * SECOND, 2);

        const screenshot = await page.screenshot();

        expect(screenshot).toMatchImageSnapshot({
          customDiffConfig: {
            threshold,
          },
          customSnapshotIdentifier: id.split('/').join('-'),
        });

        await page.close();
      },
      65 * SECOND
    );
  });
});
