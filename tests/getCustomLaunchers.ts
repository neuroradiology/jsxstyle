import * as fs from 'fs';
import * as invariant from 'invariant';
import { groupBy, uniqBy } from 'lodash';
import * as path from 'path';

const mobilePlatforms = {
  android: 'Android',
  iphone: 'iOS',
};

const mobileApiNames = {
  android: true,
  ipad: true,
  iphone: true,
};

const desktopApiName = {
  chrome: true,
  firefox: true,
  'internet explorer': true,
  microsoftedge: true,
  safari: true,
};

const excludedApiNames = {
  'internet explorer': true,
  ipad: true,
};

type MobileApiName = keyof typeof mobileApiNames;
type DesktopApiName = keyof typeof desktopApiName;
type SauceApiName = MobileApiName | DesktopApiName;

interface SauceBase {
  api_name: SauceApiName;
  automation_backend: 'webdriver' | 'appium';
  latest_stable_version: string;
  long_name: string;
  long_version: string;
  os: string;
  short_version: string;
}

interface WebdriverBrowser extends SauceBase {
  automation_backend: 'webdriver';
}

interface MobileDevice extends WebdriverBrowser {
  api_name: MobileApiName;
  device: string;
}

interface AppiumDevice extends SauceBase {
  api_name: MobileApiName;
  automation_backend: 'appium';
  device: string;
  deprecated_backend_versions: string[];
  recommended_backend_version: string;
  supported_backend_versions: string[];
}

type SauceData = WebdriverBrowser | MobileDevice | AppiumDevice;

interface LauncherBase {
  base: 'SauceLabs';
  browserName: string;
  name: string;
}

interface WebdriverLauncher extends LauncherBase {
  version: string;
  platform?: string;
}

interface AppiumLauncher extends LauncherBase {
  appiumVersion: string;
  browserName: string;
  deviceName: string;
  platformName: string;
  platformVersion: string;
}

type Launcher = WebdriverLauncher | AppiumLauncher;

/** Left pads a number with zeros. will fail on numbers greater than 10,000 */
const padNum = (num: string): string => {
  const numInt = parseInt(num, 10);
  if (isNaN(numInt)) {
    return 'NaN_';
  }
  return ('' + (parseInt(num, 10) + 10000)).slice(1);
};

/** Turns each segment of a semver number into a left-padded number */
const semverToSortString = (str: string): string =>
  str
    .split('.')
    .map(padNum)
    .join('.');

/** Sorts SauceBase objects by semver */
const semverSort = (a: string, b: string) =>
  semverToSortString(a).localeCompare(semverToSortString(b));

const sauceDataFile = path.join(__dirname, 'saucelabs-data.json');

export function getCustomLaunchers(): Record<string, Launcher> {
  invariant(fs.existsSync(sauceDataFile), 'Sauce data file does not exist');
  const sauceData: SauceData[] = JSON.parse(
    fs.readFileSync(sauceDataFile, 'utf8')
  );
  invariant(Array.isArray(sauceData), 'Sauce data is not an array');
  invariant(sauceData.length > 10, 'Sauce data is incomplete');

  const webdriverDevices = sauceData.filter(
    (f): f is WebdriverBrowser =>
      !excludedApiNames[f.api_name] &&
      f.automation_backend === 'webdriver' &&
      !mobileApiNames[f.api_name]
  );

  const appiumDevices = sauceData.filter(
    (f): f is AppiumDevice =>
      !excludedApiNames[f.api_name] && f.automation_backend === 'appium'
  );

  const dataByApiName = groupBy(
    [...webdriverDevices, ...appiumDevices],
    'api_name'
  );

  const devices: Array<AppiumDevice | WebdriverBrowser> = [];

  Object.keys(dataByApiName).map(apiName => {
    const groupedByBrowserVersion = groupBy(
      dataByApiName[apiName],
      'short_version'
    );

    const osVersions = Object.keys(groupedByBrowserVersion)
      // filter out non-numeric OS versions
      .filter(f => !isNaN(parseInt(f, 10)))
      // sort OS versions by semver
      .sort(semverSort)
      // reverse so that uniqBy sees the largest number first
      .reverse()
      .map(f =>
        groupedByBrowserVersion[f].sort((a, b) => semverSort(b.os, a.os))
      );

    console.log(apiName + '!!!');

    const latestOSVersions = uniqBy(osVersions, v =>
      parseInt(v[0].short_version, 10)
    );

    console.log(latestOSVersions);

    const sauceObjs = latestOSVersions.slice(0, 4).map(v => v[0]);

    devices.push(...sauceObjs);
  });

  const customLaunchers: Record<string, Launcher> = {};

  devices.forEach(device => {
    const key = `sl_${device.api_name}_${device.short_version}`;
    const version = device.long_version.replace(/\.$/g, '');

    // make sure there aren't any key collisions
    invariant(
      !customLaunchers[key],
      'Key `%s` already exists in customLaunchers',
      key
    );

    let browserName;

    // Mobile devices
    if (
      device.automation_backend === 'appium' &&
      (device.api_name === 'iphone' || device.api_name === 'android')
    ) {
      if (device.api_name === 'iphone') {
        browserName = 'Safari';
      } else if (device.api_name === 'android') {
        const androidVersion = parseInt(device.short_version, 10);
        if (androidVersion < 6) {
          browserName = 'Browser';
        } else {
          browserName = 'Chrome';
        }
      }

      customLaunchers[key] = {
        // recommended_backend_version is possibly an empty string
        appiumVersion:
          device.recommended_backend_version ||
          device.supported_backend_versions.slice(-1)[0],
        base: 'SauceLabs',
        browserName,
        deviceName: device.long_name,
        name: `${device.long_name} ${version}`,
        platformName: mobilePlatforms[device.api_name] || device.long_name,
        platformVersion: device.short_version,
      };
    } else if (
      device.api_name === 'chrome' ||
      device.api_name === 'firefox' ||
      device.api_name === 'microsoftedge' ||
      device.api_name === 'safari'
    ) {
      // let platform: string | undefined;
      // if (data.api_name === 'safari') {
      //   platform = data.os;
      // } else {
      //   platform = 'Windows 10';
      // }

      customLaunchers[key] = {
        base: 'SauceLabs',
        browserName: device.api_name,
        name: `${device.long_name} ${version}`,
        platform: device.os,
        version: device.short_version,
      };
    }
  });

  // IE 9-11
  [11, 10, 9].forEach(v => {
    customLaunchers[`sl_ie_${v}`] = {
      base: 'SauceLabs',
      browserName: 'Internet Explorer',
      name: `Internet Explorer ${v}`,
      version: '' + v,
    };
  });

  const testPrefix = process.env.TRAVIS_EVENT_TYPE
    ? 'Travis ' + process.env.TRAVIS_EVENT_TYPE.replace(/_/g, ' ')
    : 'Local test';

  // timezone offset in hours
  const tzOffset = new Date().getTimezoneOffset() / -60;
  const [dateString, timeString] = new Date(
    Date.now() + tzOffset * 60 * 60 * 1000
  )
    .toISOString()
    .split(/[T.]/);

  const offsetString = (tzOffset < 0 ? '' : '+') + tzOffset;

  const when = ` @ ${dateString} ${timeString} GMT${offsetString}: `;

  for (const k in customLaunchers) {
    customLaunchers[k].name = testPrefix + when + customLaunchers[k].name;
  }

  return customLaunchers;
}
