const students = require('../../app/controllers/students.server.controller');
const courses = require('../../app/controllers/courses.server.controller');
//
module.exports = function (app) {
        app.route('/api/courses')
            .get(courses.list)
            .post(students.requiresLogin, courses.create);
        //
        app.route('/api/your-courses')
            .get(students.requiresLogin, courses.studentCourses);
        //
        app.route('/api/students-by-courses')
            .post(students.requiresLogin, courses.studentsByCourses);
        //
        app.route('/api/stud')
            .post(courses.studentsByCourses);
        //
        app.route('/api/courses/:courseId')
            .get(courses.read)
            .put(students.requiresLogin, courses.hasAuthorization, courses.
                update)
            .delete(students.requiresLogin, courses.hasAuthorization, courses.
                delete);
        //
        app.param('courseId', courses.courseByID);
};
