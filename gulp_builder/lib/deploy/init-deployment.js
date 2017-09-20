'use strict';

module.exports = function (gb, task) {

    var dependencies = task.deployDependencies || [];

    gb.gulp.task('init-deployment', dependencies, function () {

        var _ = require('lodash'),
            isDataTask = task.taskName === 'run-deploy-data' || task.taskName === 'run-system-objects-report',
            configDefaults = _.omit(gb.nconf.get('deployment'), _.isUndefined),
            configOverrides = _.omit(gb.argv, _.isEmpty),
            options = _.assign({}, configDefaults, configOverrides),
            uploadPath,
            archiveName = 'build',
            archiveFilenames,
            archivePath;

        if (options.buildVersion) {
            archiveName = options.buildVersion;
        } else if (isDataTask) {
            archiveName = options.siteDataFolderName;
        } else if (process.env.BUILD_TAG) {
            archiveName = process.env.BUILD_TAG;
        }

        // Create array of archive file names, which are code or data folders to be deployed
        archiveFilenames = [];
        if (options.cartridges && !isDataTask) {
            for (var i = 0; i < options.cartridges.length; i++) {
                archiveFilenames.push(archiveName + i + '.zip');
            }
        } else {
            options.cartridges = [
                [
                    '**'
                ]
            ];
            if(isDataTask) {
                if (options.dataBundle !== null && typeof options.dataBundle !== 'undefined' && options.dataBundles !== null && options.dataBundles[options.dataBundle] !== null) {
                    var dataBundleNames = options.dataBundles[options.dataBundle];
                    options.siteDataFolderNames = [];
                    for (var j = 0; j < dataBundleNames.length; j++) {
                        options.siteDataFolderNames.push(dataBundleNames[j]);
                        archiveFilenames.push(dataBundleNames[j] + '.zip');
                    }
                } else if (options.siteDataFolderNames !== null && typeof options.siteDataFolderNames !== 'undefined') {
                    for (j = 0; j < options.siteDataFolderNames.length; j++) {
                        archiveFilenames.push(options.siteDataFolderNames[j] + '.zip');
                    }
                } else {
                    archiveFilenames.push(archiveName + '.zip');
                    options.siteDataFolderNames = [archiveName];
                }

                // add the release data directory
                if (options.dataReleaseFolderName !== null && typeof options.dataReleaseFolderName !== 'undefined') {
                    // remove "release/" prefix if it exists
                    options.dataReleaseFolderName = options.dataReleaseFolderName.replace('release/','');
                    options.siteDataFolderNames.push(options.dataReleaseFolderName);
                    archiveFilenames.push(options.dataReleaseFolderName + '.zip');
                }
            } else {
                archiveFilenames.push(archiveName + '.zip');
            }
        }

        if (isDataTask) {
            archivePath = '../data_impex';
            if (options.siteDataProject) {
                archivePath = '../' + options.siteDataProject;
            }
            uploadPath = '/on/demandware.servlet/webdav/Sites/Impex/src/instance/';
        } else {
            archivePath = 'deploy/output';
            uploadPath = '/on/demandware.servlet/webdav/Sites/Cartridges/' + archiveName + '/';
        }

        gb.fileSystem = require('fs');
        gb.request = require('../util/bm_request');
        gb.bmLogin = require('../util/bm_login');
        gb.url = require('url');
        gb.http = require('https');
        gb.zip = require('gulp-zip');
        gb.changed = require('gulp-changed');

        // Get timestamp of last data deployment (skip for "clean" data builds)
        gb.lastDeploymentTimestamp = null;
        gb.lastDeploymentFileName = gb.workingPath + '/lastbuild.properties';
        if(isDataTask && options.dataDeltaOnly) {
            if(gb.fileSystem.existsSync(gb.lastDeploymentFileName)) {
                gb.lastDeploymentTimestamp = gb.fileSystem.readFileSync(gb.lastDeploymentFileName, 'utf8');
            }
        }

        gb.deployment = {
            overwriteRelease: (isDataTask) ? true : (options.overwriteRelease === 'true'),
            user: options.user,
            password: options.password,
            instanceRoot: options.instanceRoot,
            instances: (typeof options.instances !== 'undefined' && options.instances.length > 0) ? options.instances.split(',') : [],
            activationInstances: (typeof options.activationInstances !== 'undefined' && options.activationInstances.length > 0) ? options.activationInstances.split(',') : [],
            importInstances: (typeof options.importInstances !== 'undefined' && options.importInstances.length > 0) ? options.importInstances.split(',') : [],
            uploadPath: uploadPath,
            twoFactor: options.twoFactor,
            twoFactorp12: options.twoFactorp12,
            twoFactorPassword: options.twoFactorPassword,
            archiveName: archiveName,
            archiveFilenames: archiveFilenames,
            archivePath: archivePath,
            cartridgeSuffix: options.cartridgeSuffix,
            siteDataFolderName: options.siteDataFolderName,
            siteDataFolderNames: options.siteDataFolderNames,
            cartridges: options.cartridges,
            dataDeployDelay: (typeof options.dataDeployDelay !== 'undefined') ? options.dataDeployDelay : 2000
        };

    });

};
