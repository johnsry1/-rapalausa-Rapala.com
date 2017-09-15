'use strict';

// Include the different modules to be used throughout the program
var nconf = require('nconf'),
    argv = require('yargs').argv,
    path = require('path'),
    initTask = require('./lib/util/initialize-task'),
    workingPath = path.resolve(argv.basedir || '.');

// Load a file store onto nconf with the specified settings
nconf.use('file', { file: workingPath + '/config.json' });
nconf.add('sandbox', { type: 'file', file: workingPath + '/config-server.json' });

//save reference to the sites and tasks
var sites = nconf.get('sites'),
    tasks = nconf.get('tasks');

//gb (gulp builder) object holds globals
var gb = {
    sites: sites,
    workingPath: workingPath,
    gulp: require('gulp'),
    vinylPaths: require('vinyl-paths'),
    Q: require('q'),
    nconf: nconf,
    argv: argv
};

//initialize required modules (tasks)
for (var task in tasks) {
    gb.gulp.task(task, function(){
        //retrieve the task name to get config
        var task = this.seq.slice(-1)[0];
        initTask(gb, tasks[task]);
        gb.gulp.start(tasks[task].taskName);
    });
}
