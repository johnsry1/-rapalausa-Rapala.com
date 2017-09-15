# LyonsCG Gulp Builder for Salesforce Commerce Cloud

Gulp is a task/build runner for development that runs on top of NodeJS. Lyons uses a special "Gulp Builder" tool (which is included in our reference application) to perform the following tasks:

* Converting Sass to CSS

* Combine JavaScript modules into a single generated JavaScript file.

* Code linting for JavaScript/Sass errors or syntax issues. (Code linting is a type of static analysis that is frequently used to find problematic patterns or code that doesn’t adhere to certain style guidelines.)

* Generating SVG sprites (Sass and ISML)

* "Bless" large CSS files (for circumventing the CSS selector limit on IE9 and below)

* Minify the CSS and JavaScript files

* Deploy a code version to a Salesforce Commerce Cloud instance

* Activate the deployed code version on a Salesforce Commerce Cloud instance

* Deploy a data import archive on a Salesforce Commerce Cloud instance

* Generate a system objects report page in Confluence

## Configuration of the Gulp Builder

In the LyonsCG Salesforce Commerce Cloud Reference Application, there is an Eclipse project entitled "gulp_builder". Inside of that directory there is a file named config.json. This file can be used to configure various aspects of how the code is built and deployed for your project. Here are the properties of the configuration JSON object contained within config.json:

* "sites" - array of “site” objects, each object represents a single site containing the following properties:

    * "name" - ID for the site

    * "publicJavaScript" - path to the cartridge where the preprocessed JavaScript code will be generated

        * The path is from the parent directory of the gulp_builder directory to the cartridge

    * "cartridges" - array of cartridge paths

        * The path is from the parent directory of the gulp_builder directory to the individual site cartridges

        * order is important, JavaScript files located later in the array are lower priority (more on this in the Client-side JavaScript section)

        * If a cartridge is missing from this array it will not get deployed.

    * "javascriptPluginPaths" - array of static paths to JS plugin files that should be compiled into plugins.js

        * Plugins listed here do not need to also be loaded in footer_UI.isml, unless you have the unminified version of the JS file and want to conditionally load that only in non-Production instances.

        * These values will likely need to be the same across all of your "site" objects, unless some sites in the realm require different plugins.

* "deployment" - object containing the deployment properties. These properties can also be set in Jenkins, and many times you need to set them in Jenkins based on the type of deployment you are doing and where you are deploying the code. The properties are as follows:

    * "buildVersion" - Optional code version to use during deployment. If this is not set, the build will use the Jenkins build number by default.

    * "cartridgeSuffix" - A suffix to add to the deployed cartridges’ names. This is used when you want to deploy cartridges under a different alias to avoid overwriting existing cartridges on an instance. This also requires deploying using the same code version name.

    * "overwriteRelease" - Boolean attribute which affects the deployment behavior when the buildVersion property is set.

        * true - Deletes and re-uploads the release that is being built.

        * false - Code is uploaded without first deleting and code version by the same name. This could be helpful if you want to deploy an additional set of cartridges to the same code version. This could happen when using the cartridgeSuffix property of the deployment object.
    
    * "cartridges" - An optional Array of Arrays (of cartridge names) that will group the code deployment into several archives instead of one.

    * "instanceRoot" -  Required property for storing the root portion of the URL for the Salesforce Commerce Cloud instance (e.g. .evaluation.dw.Salesforce Commerce Cloud.net).

    * "instances" - Required property for storing a comma separated list of instances to upload the code to (e.g. lyons5,lyons6).

    * "activationInstances" - Required property for storing a comma separated list of instances to activate the code on (e.g. lyons5,lyon6).

    * "importInstances" - Required property for storing a comma separated list of instances to import the data on (e.g. lyons5,lyon6).

    * "user" - The username used to log into the Salesforce Commerce Cloud instances. Required, but it’s suggested that you set this in Jenkins for security purposes.

    * "password" - The password used to log into the Salesforce Commerce Cloud instances. Required, but it’s suggested that you set this in Jenkins for security purposes.

    * "twoFactor" - Required boolean property which stores whether or not two factor authentication should be used. 

        * false - deploys the code using basic http authentication

        * true - deploys the code using two-factor authentication

    * "twoFactorp12" - The path to the file that contains the key used for authentication. Required if “twoFactor” mode is enabled.

    * "twoFactorPassword" - The password to use with the key file. Required if “twoFactor” mode is enabled, but it’s suggested that you set this in Jenkins for security purposes.

    * "siteDataProject" - The project with impex data. This is "data_impex" by default.

    * "siteDataFolderName" - The directory within the data_impex project to use for the data-deploy task. (Preferred to use dataBundles / dataBundle instead)
    
    * "siteDataFolderNames" - Array of directories within the data_impex project to use for the data-deploy task. (Preferred to use dataBundles / dataBundle instead)
    
    * "dataBundles" - Object containing named arrays of data bundles for import. The array elements correspond to directories within the siteDataProject impex directory.
    
    * "dataBundle" - Specifies which data bundle within dataBundles to be used for data deployment.
    
    * "dataReleaseFolderName" - Name of the data release directory to be included in the deployment. Used to automatically deploy data for a same-named branch (will remove the "release/" prefix from input parameter)
    
    * "dataDeployDelay" - Delay in milliseconds between data imports (Default = 2000ms). Should be adjusted upward if import times increase AND there are import conflicts (same file(s) in multiple import archives)
    
    * "dataDeltaOnly" - Boolean flag that enables a delta-only data build. Each time a data deployment is executed, the timestamp is recorded. When this flag is enabled on a subsequent build, only files that have been modified after that timestamp are included. NOTE: this currently only works well when using the same data bundle repeatedly.

* "tasks" - object containing all of the tasks available to be executed

    * Each property of the tasks object represents another task to be executed

    * Each task has a "public" name which is the name of the property/object itself

    * Each task also has a private name "taskName" which is the name of the task that gets generated when the gulpfile gets executed

    * Each task has an array of "subModules" which represents the JS modules that are used for that task

    * Each task also has an array of "subTasks" which represents the tasks within the JS modules to execute

## Sass - Task Behavior & Related Files

Purpose: Builds generated CSS from multiple SCSS files.

Public task name (property name of "tasks" object): styles

Private task name ("taskName"): build-styles 

Execution on CLI: gulp styles

Build steps:

1. Get the directories containing SCSS

    * Subtask: get-style-directories

    * Submodule: /lib/styles/get-style-directories

    * Builds array of directories containing non-partial .scss files

    * .scss files must be at the following location within the cartridges: /cartridge/scss/

1. Lint the SCSS files

    * Subtask: sass-lint

    * Submodule: /lib/styles/sass-lint

    * Checks the .scss files for syntax or styling errors

    * When errors are found, outputs them to the console and cancels the build process 

2. Build CSS from Sass

    * Subtask: sass

    * Submodule: /lib/styles/sass

    * Builds .css files for every cartridge/directory in the array generated by the get-style-directories subtask

    * Generates the .css files in cartridge/static/default/css

    * Adds vendor specific rule prefixes to rules when needed

    * Also creates sourcemaps for the generated css files so you can identify where in the .scss files the code originated from when inspecting in developer tools

## Client-side JavaScript - Task Behavior & Related Files

Purpose: Builds a single generated app.js file from multiple JavaScript modules. This file is used to provide the client-side JavaScript functionality on the storefront.

Public task name (property name of "tasks" object): client-javascript

Private task name ("taskName"): build-client-js 

Execution on CLI: gulp client-javascript

Build steps:

1. Get Paths for Client JavaScript

    * Subtask: get-paths-client-js

    * Submodule: /lib/client-js/get-paths-client-js

    * Builds array of files containing client-side .js

    * .js files must be at the following location within the cartridges: /cartridge/js/

2. Lint the JavaScript files

    * Subtask: eslint-client-js

    * Submodule: /lib/client-js/eslint-client-js

    * Checks the .js files for syntax or styling errors

    * When errors are found, outputs them to the console and cancels the build process

3. Build temporary directories for each site which contain all JS modules

    * Subtask: build-temp-client-js

    * Submodule: /lib/client-js/build-temp-client-js

    * Copies JS from all defined "cartridges" for the site into in a temporary directory

    * Cartridges that appear later in the "cartridges" array for thier site have their js modules overwritten by modules with the same name and path in cartridges defined earlier in the array (works much like the cartridge path in Business Manager, but just for JS files)

4. Generates the client-side app.js files 

    * Subtask: client-js

    * Submodule: /lib/client-js/client-js

    * Builds app.js file in the defined "publicJavaScript" cartridge for every site in the “sites” array 

    * Generates the app.js files to cartridge/static/default/js

    * Also creates sourcemaps for the generated js files so you can identify where in the .js modules the code originated from when inspecting in developer tools

5. Delete temporary directories for each site which contain all JS modules

    * Subtask: delete-temp-client-js

    * Submodule: /lib/client-js/delete-temp-client-js

    * Deletes all temporary JS directories and modules created by the build-temp-client-js task

## Server-side JavaScript - Task Behavior & Related Files

Purpose: Lint the server-side JavaScript files for errors and syntax issues.

Public task name (property name of "tasks" object): server-javascript

Private task name ("taskName"): server-js 

Execution on CLI: gulp server-javascript

Build steps:

1. Lint the JavaScript files

    * Subtask: eslint-server-js

    * Submodule: /lib/server-js/eslint-server-js

    * Checks the .js files for syntax or styling errors

    * When errors are found, outputs them to the console and cancels the build process

## Builder JavaScript - Task Behavior & Related Files

Purpose: Lint the builder JavaScript files for errors and syntax issues.

Public task name (property name of "tasks" object): builder-javascript

Private task name ("taskName"): builder-js 

Execution on CLI: gulp builder-javascript

Build steps:

1. Lint the JavaScript files

    * Subtask: eslint-builder-js

    * Submodule: /lib/builder-js/eslint-builder-js

    * Checks the .js files for syntax or styling errors

    * When errors are found, outputs them to the console and cancels the build process

## SVG - Task Behavior & Related Files

Purpose: Builds the generated SVG sprite map and related SCSS partial from multiple individual SVG files.

Public task name (property name of "tasks" object): svg

Private task name ("taskName"): build-svg 

Execution on CLI: gulp svg

Build steps:

1. Get the paths for all cartridges that contain SVG files

    * Subtask: get-svg-sprite-projects

    * Submodule: /lib/svg/get-svg-sprite-projects

    * Builds array of directories containing SVG files

    * SVG files must be at the following location within the cartridges: /cartridge/static/default/images/svg-icons/

2. Combine the SVG files into sprite files

    * Subtask: combine-svg

    * Submodule: /lib/svg/combine-svg

    * Builds for each project in the array created by get-svg-sprite-projects

    * Outputs a SVG sprite to /static/default/images/compiled/sprites.svg

    * Outputs a SCSS partial for the sprites to /scss/default/compiled/_svg.scss

    * Outputs an ISML template containing the SVG sprites to /scss/default/compiled/_svg.scss

## Deploy - Task Behavior & Related Files

Purpose: Builds & bundles the code version and deploys it to the instance. Optionally activates the code version and/or adds a suffix to the cartridge names.

Public task name (property name of "tasks" object): deploy

Private task name ("taskName"): run-deploy 

Execution on CLI: gulp deploy

Build steps:

1. SVG - See task behavior and related files above.

2. Sass - See task behavior and related files above. Two new steps added for deployments as well:

    * Minify the generated .css files

        * Subtask: minify

        * Submodule: /lib/styles/minify

        * Minifies all of the .css files generated by the sass task

        * Places minified files the same directory with the the following naming: *.min.css

    * Bless the generated .css files for IE 9 and below - Read more about Bless [here](http://blesscss.com/).

        * Subtask: bless

        * Submodule: /lib/styles/bless

        * Blesses all of the .min.css files generated by the minify task

        * Blessed CSS is generated in the following directory: cartridge/static/default/ie-css

3. Client-side JavaScript - See task behavior and related files above. One new step added for deployments as well:

    * Minify the generated .js files

        * Subtask: uglify

        * Submodule: /lib/client-javascript/uglify

        * Minifies all of the .js files generated by the client-js task

        * Places minified files in the same directory with the the following naming: *.min.js

3. Initialize the Deployment

    * Subtask: init-deployment

    * Submodule: /lib/deploy/init-deployment

    * Initializes the environment and configuration for the deployment process

    * Configuration can come in via config.json, command line, Ant, or Jenkins configuration

        * Ultimately all sources other than config.json use command to pass in parameters like so:
gulp deploy --basedir="${basedir}" --buildVersion="${buildVersion}" --cartridgeSuffix="${cartridgeSuffix}" --user="${user}" --password="${password}" --twoFactor="${twoFactor}" --twoFactorp12="${twoFactorp12}" --twoFactorPassword="${twoFactorPassword}" --instances="${instances}" --instanceRoot="${instanceRoot}" --activationInstances="${activationInstances}"

        * See the "deployment" section of config.json in the Configuration of the Gulp Builder section above for more details about what can be configured.

4. Copy the cartridges to a working folder for compression and other pre-deployment activities

    * Subtask: copy-cartridges

    * Submodule: /lib/deploy/copy-cartridges

    * Creates a working directory for all of the cartridges

    * Places all of the configured cartridges from config.json in the directory

    * Adds a suffix to the cartridge directory name if one is provided by the configuration in config.json

5. Updates properties files for any renamed cartridges (as a result of "cartridgeSuffix" configuration)

    * Subtask: update-cartridge-properties

    * Submodule: /lib/deploy/update-cartridge-properties

    * Only updates the properties files if they are in renamed copies of the cartridges

    * Creates a new properties file with the new filename and content

    * Removes old incorrectly named properties files

6. Updates all of the references within the code to cartridges to the suffixed version (as a result of "cartridgeSuffix" configuration)

    * Subtask: update-cartridge-references

    * Submodule: /lib/deploy/update-cartridge-references

    * Replaces references in .js, .ds, .isml and .xml (but can be easily modified to support more file types)

7. Create code version directories on instances as needed
    
    * Subtask: make-directories

    * Submodule: /lib/deploy/make-directories

    * Directory name is derived during step 3 (init-deployment)

8. Compress the files in the working directory into a zip archive(s)

    * Subtask: zip-files

    * Submodule: /lib/deploy/zip-files

    * Archives are named using the "buildVersion" from the configuration

9. Upload the zip archive(s) to the instance

    * Subtask: webdav-upload

    * Submodule: /lib/util/webdav-upload

    * If "overwriteRelease" configuration is set to true, deletes any previous release by the same name

    * Handles authentication to the remote instance (two-factor or otherwise)

    * Uploads to all instances defined in "instances" configuration (see above)

10. Decompress the zip archive(s) into the code version directory

    * Subtask: unzip-files

    * Submodule: /lib/deploy/unzip-files

    * Decompress the archive into a code version which matches the "buildVersion" configuration

    * Deletes the zip archive(s) after it has been decompressed

10. Activate the code version

    * Subtask: activate-code

    * Submodule: /lib/deploy/activate-code

    * Activates the code on all instances in the "activationInstances" configuration list

## Deploy Data - Task Behavior & Related Files

Public task name (property name of "tasks" object): deploy-data

Private task name ("taskName"): run-deploy-data 

Execution on CLI: gulp deploy-data

Purpose: Deploys the data_impex files to the instance and imports the data files contained within.

1. Initialize the Deployment - See task behavior and related files above under "Deploy - Task Behavior & Related Files".

2. Delete zip(s)

    * Subtask: delete-data-zip (not represented in config.json)

    * Submodule: /lib/data/delete-data-zip

    * Deletes old data zip file(s) from the instance via WebDAV, if present, to prepare for new zip upload

3. Create zip(s)

    * Subtask: zip-data-files (not represented in config.json)

    * Submodule: /lib/data/zip-data-files

    * Compresses the data-impex files into new zip file(s)

4. Upload the zip archive(s) to the instance - See task behavior and related files above under "Deploy - Task Behavior & Related Files".

5. Import Data

    * Subtask: import-data

    * Submodule: /lib/data/import-data

    * Logs into the instance using HTTP requests

    * May optionally use two-factor auth if needed (using /lib/util/two-factor)

    * Triggers the import process from within Business Manager using HTTP requests
    
6. Clean-up data (Delete local zip(s))

    * Subtask: cleanup-data

    * Submodule: /lib/data/cleanup-data

    * Deletes the local copy of data zip files 

## System Objects Report - Task Behavior & Related Files

Purpose: Creates a System Object Report containing all custom objects represented in the data-impex directory.

Public task name (property name of "tasks" object): system-objects-report

Private task name ("taskName"): run-system-objects-report

Execution on CLI: gulp system-objects-report

Build steps:

1. Initialize the deployment - See task behavior and related files above under "Deploy - Task Behavior & Related Files". This task also uses a separate config.json within the gulp_builder’s /lib/data directory to set deployment configuration specific to deploy-data.

2. Create and upload the system object report

    * Subtask: system-objects-report

    * Submodules: /lib/data/sysobj-report, /lib/data/system-objects-report, /lib/util/xml-reporting-util

    * Generates the system objects report markup

    * This portion of the script uses Jenkins to populate the data into Confluence. You can learn more about the Jenkins configuration that is needed [here](https://bitbucket.org/lyonsconsultinggroup/reference-application/src/789c3f80d93f9d0a25b08b032beede681301a9ca/gulp_builder/?at=master).

## Additional Information

The builder uses an [Apache Ant](https://ant.apache.org/manual/) script to to run the deployments on a jenkins server, as well as run the scripts within the Eclipse IDE. Most of the tasks we’ve covered in this guide are set up as Ant tasks as well within the following file: gulp_builder/builders.xml

Within the gulp_builder project you’ll also notice an .externalToolBuilders directory. That directory contains the configuration for the Eclipse project builder. This part of the build configuration determines which files and directories are being watched for changes for each type of build as well as which directories to refresh once the build is complete. To configure this, right click on the gulp_builder project within Eclipse’s Navigator. Choose Properties and then navigate to the Builders using the left column. You will see the defined builders for your project listed. This typically contains the following builders:

* client-javascript

* svg

* styles

* server-javascript

* builder-javascript

* core-modification-warning

You can turn the builders on or off by checking/unchecking the box next to the builder. You can also edit the builder by selecting it, and then clicking the Edit button to the right.

Once within the resulting dialog, the main tabs you want to configure are as follows:

* Refresh - Clicking on the Specify Resources button here allows you to determine which directories will need to be refreshed when the build is complete. If there are any generated files in that directory they will be uploaded assuming you have Auto-upload enabled.

* Build Options - Clicking on the Specify Resources button here allows you to determine which directories will be watched for changes. When a change happens, it will trigger the associated build script.

## Summary

There is even more to the build script that isn’t covered in this document, but if you can’t find what you need here, feel free to reach out to Matt Rose with any questions:

* Email: [mrose@lyonscg.com](mailto:mrose@lyonscg.com)

* Skype: mrose.lcg

* Bitbucket ID: matthewrose

Also if you notice any improvements that could be made to this guide, please add them via a pull request into this repository, or, if you can’t add the improvements, feel free to log an issue in the repository and assign it to me!

