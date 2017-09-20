# Setting up the deployment project in Jenkins

## Note: This guide assumes that the Jenkins server has already been set up by the OSC team

### Add the new project to the Jenkins server

  On the Jenkins server, you will start at the dash board and it should look something like this:

  ![Jenkins Dashboard][jenkins-dashboard]

  [jenkins-dashboard]: images/jenkins-dashboard.png

  Please choose the "New Item" link in the top left to continue

  On the "New Item" page you will have several options to choose from. You should see a screen similar to the one below:

  ![Jenkins New Item][jenkins-new-item]

  [jenkins-new-item]: images/jenkins-new-item.png

  If this is a new server with no projects on it, please use the "Freestyle Project" option. Otherwise, if this server already has several projects setup it may be faster to use the "Copy existing Item" option to reduce setup time. This option will copy over all of the settings from the chosen project into your new project. After choosing one of these options make sure to enter a name for your project in the "Item name" field, preferably using dashes instead of spaces between words. After this click the "OK" button at the bottom of the form.

  On the next page you should see a screen similar to the one below:

  ![Jenkins Project Configuration][jenkins-project-config]

  [jenkins-project-config]: images/jenkins-project-config.png

  To continue the setup please choose either the "Multiple SCMs" option for Git repositories or the "Subversion" option for SVN repositories.

  If you are setting up Git repositories please read the following instructions. If not please skip below to the section on Subversion.

### Git Repository Setup

  To setup a Git repositories in Jenkins for use with our build script please choose the "Multiple SCMs" option under "Source Code Management"

  When the option has been chosen you should see a screen similar to the one below:

  ![Multiple SCMS][multiple-scms]

  [multiple-scms]: images/multiple-scms.png

  To add a Git repository click the "Add SCM" drop down and choose the "Git option"

  After choosing the options you should see the below options:

  ![Git Options][git-options]

  [git-options]: images/git-options.png

  Add the SSH Git url (e.g. git@code.lcgosc.com:demandware-standard-library/lyons-demandware-storefront-core-application.git) to the "Repository URL" field

  Then click the "Add" button next to the "Credentials" drop down to add a set of credentials to log into the Git server

  In the field "Branch Specifier (blank for 'any')" specify the branch name if you decide to use one other than master (e.g. */develop, */release, etc.)

  Add some additional options to the Git build by clicking the "Add" drop down under the "Additional Behaviours" section and choosing the following options:

  1. Checkout to a sub-directory
  2. Wipe out repository & force clone

  In the "Local subdirectory for repo" field under the "Check out to a sub-directory" option add a name for the Git repository. The name should correspond to the name of the repository (e.g. demandware-lea-project, demandware-enhanced-store-locator, etc.). These also need to match the cartridge paths contained in gulp_builder/config.json so that the deployment scripts can find the files.

  Repeat the above steps for each repo that is part of the project

### Subversion Repository Setup

  Setting up a SVN repository is similar to setting up a Git repository but there are a few key differences.

  Instead of using the "Multiple SCMs" to setup the repository, please choose the "Subversion" option. This is because the Subversion plugin can handle multiple repos natively.

  Enter the "Repository URL" and "Credentials" exactly as the Git repo (except with a different URL)

  If using multiple respositories please enter a folder name in the "Local module directory" field. This is useful if there is a different repo for the private key used for two factor authentication

  To add multiple repos with SVN use the "Add module..." button. This will add another set of fields to use in setting up the next repo.

### Build Options Setup

  To setup the build options to allow for deployment to the servers scroll to the bottom of the Jenkin's project settings. There is a section called "Build" where the final part of the setup will occur.

  In the Build section there is an "Advanced..." button. After clicking the button you should see a section similar to the following:

  ![Build Options][build-options]

  [build-options]: images/build-options.png

  This section will allow you to enter the build file and the properties for the build.

  In the "Build File" field enter the path relative to the Jenkins workspace to your deployment script. This should be similar to what is in the path in the image above.

  In the "Properties" field enter all of the properties needed for this project. For an explanation of all of the properties please refer to the [Deploy Properties](DeployProperties.md) document.

  After all of the properties have been entered click the "Apply" button at the bottom of the screen. This will save your project options.

  To test out the build, scroll to the top of the configuration and click the "Build Now" option in the upper left. If everything was setup correctly the build should complete successfully.



# Configuring the Data Deploy tool for Local Sandbox Deployment

  To use the auto data deploy feature, use the following steps:

**Step 1**
Copy config-server_example.json to a new file config-server.json. Use the deployment object within config-server.json and populate with your deployment details. This new file is git-ignored so it won't be shared.

* user: your username
* password: your password
* instances: comma separated list of prefixes of sandboxes to deploy to (ex. "demo" or "demo,dev01,dev02")
* importInstances: comma separated list of prefixes of sandboxes to import into (ex. "demo" or "demo,dev01,dev02")

*Alternate Usage on the command line (from within gulp_builder directory)*

Any of the options can be added to the command from the command line like so:
```
Ex. 1
gulp deploy-data --user="username" --password="password" --instances="dev01" --importInstances="dev01" --dataBundle="core-config"
Ex. 2
gulp deploy-data --user="username" --password="password" --instances="dev01" --importInstances="dev01" --dataBundle="core-config-data"
```
When used in this way, it will override any of the defaults from config.json.

**Step 2**
Install node module dependencies

* From the command line, navigate to the "gulp_builder" folder (that contains this README)
* Run `npm install` in administrator mode on Windows
* Run `sudo npm install` on a Mac
* This may already have been run.  If there is a node_modules folder, it has already been run.

**Step 3**
Do this each time you pull new data_impex updates from repository

* From the command line, navigate to the "gulp_builder" folder (that contains this README)
* Run `gulp deploy-data`


# Configuring Post-Deployment Data Reporting to Confluence

After the build is complete, a few reports can be generated and included in the project's Confluence space. This requires some general Jenkins configuration, as well as build project configuration.

### Currently available reports:
* Build Reports: A list of builds, including timestamp, branch, and git commit
* System Objects: A table is generated for each System Object, which include ID, Name, group, etc.

#### Jenkins Management

**Step 1**
Install Confluence Publisher and Flexible Publish Plug-ins (at /pluginManager)
* https://wiki.jenkins-ci.org/display/JENKINS/Confluence+Publisher+Plugin
* https://wiki.jenkins-ci.org/display/JENKINS/Flexible+Publish+Plugin

**Step 2**
Add your (TL) Confluence credentials to Jenkins Configuration (at /configure)

![Jenkins Confluence Configuration][jenkins-confluence-config]

[jenkins-confluence-config]: images/jenkins-confluence-config.png

#### Build Project Configuration

**Step 1**
Include "system-objects-report" in ANT build steps.  Make sure it's the last step.

  ![Reports Ant Cmds][reports-ant-cmds]

  [reports-ant-cmds]: images/reports-ant-cmds.png

**Step 2**
Create 2 pages in your project's Confluence Space:

* "System Objects"
* "Build Reports"

**Step 3**
Add Flexible Publish as Post-build Action. This will allow multiple post-build actions. Add a conditional action and configure with following settings:

* Run?: Always
* Action 1: Publish to Confluence (System Objects Report)
    * Confluence Site: "lyonscg.atlassian.net"
    * Space: <the ID of your project space> Ex. "HotelChocolatDW"
    * Page: "System Objects"
    * Wiki Markup Replacements: Replace entire page content with File contents <jenkins git checkout sub-directory>/data_impex/core/meta/system-objecttype-extensions.txt
* Action 2: Publich to Confluence (Build Reports)
    * Confluence Site: "lyonscg.atlassian.net"
    * Space: <the ID of your project space> Ex. "HotelChocolatDW"
    * Page: "Build Reports"
    * Wiki Markup Replacements: Replace entire page content with Plain text (shown below)

```html
<br/>
<b>Build $BUILD_NUMBER Successful</b> at $BUILD_TIMESTAMP Central Time USA<br/>
Git Commit: $GIT_BRANCH : $GIT_COMMIT<br/>
<br/>
```

![Reports Post Job Config][reports-post-job-config]

[reports-post-job-config]: images/reports-post-job-config.png

### Example Reports shown in Confluence

**Confluence Build Reports**

![Confluence Build Reports][conf-build-reports]

[conf-build-reports]: images/conf-build-reports.png

**Confluence System Objects Report**

![Confluence System Objects Report][conf-system-objects]

[conf-system-objects]: images/conf-system-objects.png
