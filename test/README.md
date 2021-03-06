# SiteGenesis Tests
We're launching a new client-side testing strategy for SiteGenesis. It will include:

- functional tests that make sure the application's features are working correctly
- unit tests
- the ability to run all tests on the command-line with a build tool (gulp and grunt), with flexible reporting output

### Application vs Unit Tests
As an application, SG requires thorough testing on both the unit level as well as application level. With recent efforts to modularize client-side code, unit tests will make our modules more reliable. They will also allow custom implementations of SG to reuse our modules.

At the same time, we also need to deliver on a smooth ecommerce experience, and that is where application/ user interface (UI) tests come in. It will cover high level usecases and complex ecommerce scenarios, as well as demonstrate functionalities enabled by our platform.

## Test architecture
### Mocha
We use [Mocha](http://mochajs.org) as the primary framework to run tests on node.js and in the browser. Mocha really excels in making asynchronous actions easy, supporting both callback style and promise-based APIs.

### WebdriverIO
[WebdriverIO](http://webdriver.io) provides bindings for WebDriver protocols in JavaScript. Not only does it provide a simple and clean API to work with, it also integrates nicely with different Selenium drivers for Chrome, Firefox and PhantomJS browsers and support services like SauceLabs that could enable tests to be run on a wide variety of browsers.

### Build tools
Both current build tools that are supported in SiteGenesis, namely gulp and grunt, will be able to run application and unit tests.

### Directory structure

```shell
test
├── README.md
├── application
│   ├── homepage
│   │   └── general.js
│   ├── productDetails
│   │   └── index.js
│   └── webdriver
│       ├── wdio.conf.js
│       ├── config.json
│       └── config.sample.json
└── unit
└── util
	└── index.js

```
Above is the structure of our tests. The main `test` directory lives in the root folder of SG application. In it will be `application` and `unit` directories.

Application tests' webdriver configurations are in the `webdriver` directory.

The tests are contained in suites, which are represented as directories. For example, the above structure contains Application test suites `homepage` and `productDetails`, and Unit test suite `util`.

## Test Setup

1. Install all dependencies

```shell
:; npm install
```

1. Install phantomjs and standalone Selenium driver

```shell
:; npm install -g phantomjs # see note [1]
:; npm install --production -g selenium-standalone@latest
:; selenium-standalone install # see note [2]
```

1. Use a WebDAV client (i.e. Cyberduck at https://cyberduck.io/) to upload the
**demo_data_no_hires_images/inventory-lists/inventory/inventory*.xml** files to the "**Impex/src/testdata/inventory-list/**"
directory of your sandbox (https://&lt;sandbox_host&gt;/on/demandware.servlet/webdav/Sites/Impex/src/testdata/inventory-list/).
You will need to login with a valid Business Manager account that has been
assigned the role of Administrator.

1. Add the `app_storefront_pipelines` cartridge to the Effective Cartridge Path of the Business Manager Sites-Site
Settings:
    1. Go to **Business Manager > Administration > Manage Sites**
    1. Click on the Manage the **Business Manager** Site link
    1. Set the **Cartridges** field to **app_storefront_pipelines:bm_custom_plugin**

1. Update site url config and desired browser client in `test/application/webdriver/config.json`. For example:

```javascript
{
	"url": "https://example.demandware.net/s/SiteGenesis",
	"client": "phantomjs"
}
```
 *Note: please use Storefront URL format for application tests, but without the ending `/home` part.*

These 5 steps only need to be performed once.

## Run the tests

### Application tests

After installing the dependencies, start selenium server each time you wish to run the tests.

```shell
:; selenium-standalone start # see note [3]
```

It's important to keep this command-line instance running in the background. Open a new terminal window for next steps. For more information, see http://webdriver.io/guide/getstarted/install.html

1. Reset test data

    To ensure that the application tests can consistently compare results with their
expected values, we have implemented a process to reset test data.  During the
SiteGenesis build process, a job called, **TestDataReset**, is created and available
to run.  **Note:** By default, the site associated with the job is SiteGenesis.
If you are using a different site, please alter the job to point to it.

    Before running a test, please reset the data by following these steps:

    a. Go to **Business Manager > Administration > Job Schedules**

    b. Click on the **TestDataReset** link, which will redirect you to the Job Detail page.

    c. Click the Run button, wait a moment, then periodically click the Refresh
button under the **TestDataReset - History** section until the Status column reports
**Finished**.  The Error column should display **None**.  At this point, you can run
the application tests.

1. Run the test

```sh
:; gulp test:application
```

 This command runs all the test suites by default. In order to run specific test suite(s), you can specify from the command line, for eg. `gulp test:application --suite homepage`.
Other configurations are also available, see below.

### Unit tests

```shell
:; gulp test:unit
```

This command runs all the test suites by default. In order to run specific test suite(s), you can specify from the command line, for eg. `gulp test:unit --suite util`.
Other configurations are also available, see below.

### Options
The following options are supported on the command line:

- `reporter`: (default: `spec`) see [all available options](http://mochajs.org/#reporters).
- `timeout`: (default: `10000`)
- `suite`: (default: `all`)
- `client`: (default: `phantomjs`) browser environment to run UI tests in
- `url`: URL of storefront site to run UI tests against

### Test user accounts

Here are some generic test accounts that are used in the application tests suite,
along with their differences for testing different scenarios:
**Note**: The password for each account is **Test123!**

| Email                    | First Name | Last Name | Address1             | City          | State Code | Postal Code | Country Code | Phone        | Address ID | Preferred Address | Gender |
|--------------------------|------------|-----------|----------------------|---------------|------------|-------------|--------------|--------------|-----------|-------------------|--------|
| testuser1@demandware.com | Test1      | User1     | 104 Presidential Way | Woburn        | MA         | 01801       | US           | 781-555-1212 | Home      | ✔                 | F      |
|                          |            |           | 91 Middlesex Tpke    | Woburn        | MA         | 01801       | US           | 781-555-1212 | Work      |                   |        |
| testuser2@demandware.com | Test2      | User2     |                      |               |            |             |              |              |           |                   | M      |
| testuser3@demandware.com | Test3      | User3     | 3486 Mission St      | San Francisco | CA         | 94110       | 415-555-1212 | Mom's        |           | ✔                 | F      |


### Test products
| Type             | Product ID                                 | Display Name                                           | Color                   | Size | Width   | Product Options |
|------------------|--------------------------------------------|--------------------------------------------------------|-------------------------|------|---------|-----------------|
| Option Product   | samsung-ln55a950                           | Samsung Series 9 55" LCD High Definition Television    |                         |      |         | tvWarranty      |
| Variation Master | 25686514                                   | Navy Single Pleat Wool Suit                            |                         |      |         |                 |
| Variant          | 750518548258                               |                                                        | Navy (NAVYWL)           | 46   | Regular |                 |
| Variant          | 750518548265                               |                                                        | Navy                    | 48   | Regular |                 |
| Variant          | 750518548227                               |                                                        | Navy                    | 42   | Regular |                 |
| Variant          | 750518548197                               |                                                        | Navy                    | 39   | Regular |                 |
| Variant          | 750518548234                               |                                                        | Navy                    | 43   | Regular |                 |
| Variant          | 750518548203                               |                                                        | Navy                    | 40   | Regular |                 |
| Variant          | 750518548241                               |                                                        | Navy                    | 44   | Regular |                 |
| Variant          | 750518548432                               |                                                        | Navy                    | 40   | Long    |                 |
| Variant          | 750518548487                               |                                                        | Navy                    | 46   | Long    |                 |
| Variant          | 750518548456                               |                                                        | Navy                    | 42   | Long    |                 |
| Variant          | 750518548319                               |                                                        | Navy                    | 38   | Short   |                 |
| Variant          | 750518548357                               |                                                        | Navy                    | 42   | Short   |                 |
| Variant          | 750518548371                               |                                                        | Navy                    | 44   | Short   |                 |
| Variant          | 750518548296                               |                                                        | Navy                    | 36   | Short   |                 |
| Set              | spring-look                                | Spring Look                                            |                         |      |         |                 |
| Variation Master | 25517787                                   | Long Sleeve Raglan Button Out Turtle Neck              |                         |      |         |                 |
| Variant          | 701642808268                               |                                                        | Fire Red Multi          | S    |         |                 |
| Variant          | 701642808251                               |                                                        | Fire Red Multi          | M    |         |                 |
| Variant          | 701642808244                               |                                                        | Fire Red Multi          | L    |         |                 |
| Variant          | 701642808275                               |                                                        | Fire Red Multi          | XL   |         |                 |
| Variation Master | 25553432                                   | Trouser Leg Pant                                       |                         |      |         |                 |
| Variant          | 701643489442                               |                                                        | Chino (JJ493XX)         | 16   |         |                 |
| Variant          | 701643489398                               |                                                        | midnight navy (JJ0VWXX) | 6    |         |                 |
| Variation Master | 25791388                                   | Zacco                                                  | Black (BLKBKPA)         |      |         |                 |
| Variant          | 740357431040                               |                                                        | Black                   | 6    | M       |                 |
| Variant          | 740357431057                               |                                                        | Black                   | 6.5  | M       |                 |
| Variant          | 740357431064                               |                                                        | Black                   | 7    | M       |                 |
| Variant          | 740357431071                               |                                                        | Black                   | 7.5  | M       |                 |
| Variant          | 740357431088                               |                                                        | Black                   | 8    | M       |                 |
| Variant          | 740357431095                               |                                                        | Black                   | 8.5  | M       |                 |
| Variant          | 740357431101                               |                                                        | Black                   | 9    | M       |                 |
| Variant          | 740357431118                               |                                                        | Black                   | 9.5  | M       |                 |
| Variant          | 740357431125                               |                                                        | Black                   | 10   | M       |                 |
| Bundle           | microsoft-xbox360-bundle                   | Xbox 360 Bundle                                        |                         |      |         | consoleWarranty |
| Product          | microsoft-xbox360-console                  | Microsoft X-Box 360 Game Console                       |                         |      |         | consoleWarranty |
| Product          | easports-fight-night-round-3-xbox360       | Fight Night: Round 3 (for X-Box 360)                   |                         |      |         |                 |
| Product          | rockstar-games-grand-theft-auto-iv-xbox360 | Grand Theft Auto 4 (for X-Box 360)                     |                         |      |         |                 |
| Product          | sierra-the-bourne-conspiracy-xbox360       | Robert Ludlum's: The Bourne Conspiracy (for X-Box 360) |                         |      |         |                 |

# Troubleshooting

1. **Couldn't connect to selenium server error**

    This is likely due to the Selenium server not being started.  Assuming that
    `npm install` has already been run, from a Terminal, please type:
    `selenium-standalone start`

1. **Tests have been succeeding, and with no code changes, tests are suddenly
failing**

    - Has the TestDataReset job been run?  It is possible that a test has been
      run so often that inventory values have been depleted, and certain options
      are no longer available.

    - Another potential area to check is whether Promises in before and beforeEach
      hooks are prepended with `return` as this is needed by Mocha as part of
      its Promises implementation.

1. **Other Tips**

    - Check the Selenium log in the Terminal where `selenium-standalone start`
      was executed for potential clues as to what may have occurred when a
      test failed.


# Notes
*[1] You do not need to install `phantomjs` globally if `./node_modules/bin` is in your `$PATH`.*

*[2] Selenium version 2.44.0 is not compatible with PhantomJS (see https://code.google.com/p/selenium/issues/detail?id=8088). In order to circumvent this, install version 2.43.1 instead: `selenium-standalone install --version=2.43.1`.*

*[3] You might need to use the flag `--version=2.43.1` to start the server as well, similar to note [2].*

