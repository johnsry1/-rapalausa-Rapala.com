'use strict';

/**
 * initialize-task: Initialize one main gulp task along with it's sub-tasks.
 */
module.exports = function (gb, task) {

    //initialize required task (tasks)
    for (var i = 0; i < task.subModules.length; i++) {
        require(gb.workingPath + task.subModules[i])(gb, task);
    }

    //initialize one task
    gb.gulp.task(task.taskName, task.subTasks);

};
