const mongoose = require('mongoose');
const Course = mongoose.model('Course');
const Student = require('mongoose').model('Student');
const { ObjectId } = require('mongodb');

//
function getErrorMessage(err) {
    if (err.errors) {
        for (let errName in err.errors) {
            if (err.errors[errName].message) return err.errors[errName].
                message;
        }
    } else {
        return 'Unknown server error';
    }
};
//
exports.create = function (req, res) {
    const course = new Course();
    course.courseCode = req.body.courseCode;
    course.courseName = req.body.courseName;
    course.section = req.body.section;
    course.semester = req.body.semester;
    //article.creator = req.body.username;
    var studentUsername = req.studentUsername
    console.log(req.body)
    //
    //
    Student.findOne({username: studentUsername}, (err, student) => {

        if (err) { return getErrorMessage(err); }
        //
        req.id = student._id;
        console.log('student._id',req.id);

	
    }).then( function () 
    {
        course.student = req.id
        console.log('req.student._id',req.id);

        course.save((err) => {
            if (err) {
                console.log('error', getErrorMessage(err))

                return res.status(400).send({
                    message: getErrorMessage(err)
                });
            } else {
                res.status(200).json(course);
            }
        });
    
    });
};
//
exports.list = function (req, res) {
    Course.find().sort('-courseName').populate('student', 'firstName lastName fullName').exec((err, courses) => {
if (err) {
        return res.status(400).send({
            message: getErrorMessage(err)
        });
    } else {
        res.status(200).json(courses);
    }
});
};
//
exports.studentsByCourses = async (req, res) => {

    let courseCode = req.body.auth.courseCode
    //console.log(courseCode);
    let student = await Course.find({courseCode: courseCode}).sort('-courseName').populate('student', 'firstName lastName fullName');
    try{
        var studArray = []
        //student.forEach(element => {
        //    studArray.push(element)
        //});
        for(let i = 0; i < student.length; i++){
            studArray.push(student[i].student)
        }
        res.status(200).json(studArray)
        
    }
    catch(e){
        
    }
};
//
exports.courseByID = function (req, res, next, id) {
    Course.findById(id).populate('student', 'firstName lastName fullName').exec((err, course) => {if (err) return next(err);
    if (!course) return next(new Error('Failed to load course '
            + id));
        req.course = course;
        console.log('in courseById:', req.course)
        next();
    });
};
//
exports.read = function (req, res) {
    res.status(200).json(req.course);
};
//
exports.update = function (req, res) {
    console.log('in update:', req.course)
    const course = req.course;
    course.courseCode = req.body.courseCode;
    course.courseName = req.body.courseName;
    course.section = req.body.section;
    course.semester = req.body.semester;
    course.save((err) => {
        if (err) {
            return res.status(400).send({
                message: getErrorMessage(err)
            });
        } else {
            res.status(200).json(course);
        }
    });
};
//
exports.delete = function (req, res) {
    const course = req.course;
    course.remove((err) => {
        if (err) {
            return res.status(400).send({
                message: getErrorMessage(err)
            });
        } else {
            res.status(200).json(course);
        }
    });
};
//The hasAuthorization() middleware uses the req.article and req.user objects
//to verify that the current user is the creator of the current article
exports.hasAuthorization = function (req, res, next) {
    console.log('in hasAuthorization - student: ',req.course.student)
    console.log('in hasAuthorization - student: ',req.id)
    //console.log('in hasAuthorization - user: ',req.user._id)


    if (req.course.student.id !== req.id) {
        return res.status(403).send({
            message: 'Student is not authorized'
        });
    }
    next();
};
//
exports.studentCourses = function (req, res) {
    const student = req.student;
    console.log('here'+req.id)
    var studentID = req.id
    Course.find({student:ObjectId(studentID)}, (err, courses) => {
        if (err) {
            // Call the next middleware with an error message
            return res.status(400).send({
                message: getErrorMessage(err)
            });
        } else {
            //console.log(comments);
            // Use the 'response' object to send a JSON response
            res.status(200).json(courses);
        }
	});
};
