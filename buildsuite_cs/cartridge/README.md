Build Suite
==============

--------------------------
[Looking for the ant version?](https://bitbucket.org/demandware/build-suite-ant/overview)  Please note ANT version is being sunsetted in favor of the newer Grunt based build suite.


Introduction
------------
The build suite is an easy-to-use set of scripts to automate your build processes and adding some additional value to it. In a nutshell you configure your SVN and/or Git locations, your target environment (i.e. staging) and then hit the button to package a build and to deploy it to your environment and activate the new version.

It is part of the [Community Suite](https://xchange.demandware.com/community/developer/community-suite) set of tools.

Documentation
-------------
Full documentation is available on the [Wiki](https://bitbucket.org/demandware/build-suite/wiki).

Release history
---------------
- latest
- 2015/02/27 - [Grunt Branch](https://bitbucket.org/demandware/build-suite/src/4ad8e2001b5a4200422ced9844df545dd6f45ae5/?at=grunt)
    - Merged new features in to grunt branch including support for svn and two factor auth.
    - IMPORTANT: ALL properties files are being moved to json files to support more advanced configuration.  A merge option exists to merge the global properties files.  The project repository folders should be converted by hand if you use any advanced options.  A sample file is provided. 
    - IMPORTANT: Run `npm cache clean` `npm install` as we are now including a lint module. If you can't get it to clone because of an authentication problem. Open the package.json and change `"dslint": "git+https://bitbucket.org/demandware/dslint.git",` to `"dslint": "git+https://[user]:[password]@bitbucket.org/demandware/dslint.git"`,
    - Known Issues: Two factor auth will successfully push the archive to the remote server.  It is a known issue that it will not unzip nor activate.  We are working on that.


Support / Contributing
----------------------

Feel free to create issues and enhancement requests or discuss on the existing ones, this will help us understanding in which area the biggest need is. For discussions please start a topic on the [Community Suite discussion board](https://xchange.demandware.com/community/developer/community-suite/content).

License
-------
Licensed under the current NDA and licensing agreement in place with your organization. (This is explicitly not open source licensing.)