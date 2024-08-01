import async from "async";
import DatabaseManager from "../lib/DatabaseManager.js";
import { Consts } from "../lib/Consts.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Utils from "../lib/Utils.js";

class UserLogic {
    static list(params, callback) {
        const filter = {};
        if (params.userType) filter['userType'] = params.userType;

        Promise.all([
        // Count total records
        DatabaseManager.user.count({ where: filter }),
        // Fetch user details
        DatabaseManager.user.findAll({
            attributes: ['userID', 'name', 'phone', 'email', 'password', 'dateOfBirth', 'gender', 'medicalDegree', 'specialization', 'licenseNumber', 'jobTitle', 'userType'],
            where: filter,
        }),
        ])
        .then(([totalRecords, users]) => {
            callback({
            status: Consts.httpCodeSuccess,
            data: users,
            recordsTotal: totalRecords,
            recordsFiltered: totalRecords,
            });
        })
        .catch((err) => {
            console.error('Error fetching users:', err.message);
            callback({
            status: Consts.httpCodeServerError,
            message: 'Failed to fetch users',
            error: err.message,
            data: [],
            recordsTotal: 0,
            recordsFiltered: 0,
            });
        });
    }

    static login(body, callback) {
        async.waterfall(
            [
                function (done) {
                    DatabaseManager.user
                        .findOne({
                            attributes: ['userID', 'name', 'phone', 'email', 'password', 'dateOfBirth', 'gender', 'medicalDegree', 'specialization', 'licenseNumber', 'jobTitle', 'userType'],
                            where: {
                                email: body.username,
                            },
                        })
                        .then((res) => {
                            if (res == undefined) {
                                done("Invalid credentials");
                                return;
                            }
                            done(null, res);
                        })
                        .catch((err) => {
                            done(err);
                        });
                },
                function (user, done) {
                    if (bcrypt.compareSync(body.password, user.password)) {
                        //generate and update a session
                        var params = {
                            session: Utils.randomString(40),
                            expiry: Utils.addTimeToDate(0, 0, 1, 0, 0)
                        }

                        DatabaseManager.user
                            .update(params, {
                                where: {
                                    email: user.email,
                                },
                            })
                            .then((res) => {
                                done(null, user);
                            })
                            .catch((err) => {
                                console.log(err)
                                done(err);
                            });
                    } else {

                        done("Invalid credentials");
                    }
                },
                function (user, done) {
                    //get user

                    DatabaseManager.user
                        .findOne({
                            attributes: ['userID', 'name', 'phone', 'email', 'password', 'dateOfBirth', 'gender', 'medicalDegree', 'specialization', 'licenseNumber', 'jobTitle', 'userType'],
                            where: {
                                email: user.email,
                            },
                        })
                        .then((res) => {
                            let jwtToken = jwt.sign(
                                {
                                    session: res.session,
                                    expiry: res.expiry,
                                    name: res.name,
                                    email: res.email
                                },
                                process.env["JWT_KEY"],
                                {
                                    expiresIn: process.env["JWT_EXPIRY_TIME"],
                                }
                            );

                            done(null, jwtToken, res);
                        })
                        .catch((err) => {
                            console.log(err)
                            done(err);
                        });
                }
            ],
            function (err, token, user) {
                if (err) {
                    return callback({
                        status: Consts.httpCodeSeverError,
                        message: "Failed to login",
                        error: err,
                    });
                }


                return callback({
                    status: Consts.httpCodeSuccess,
                    token: token,
                    data: user
                });
            }
        );
    }



    static create(body, callback) {
        async.waterfall([
            function (done) {
                if (Utils.isEmpty(body.name)) {
                    done({ status: Consts.httpCodeBadRequest, message: "Name cannot be empty" });
                    return;
                }
                if (Utils.isEmpty(body.password)) {
                    done({ status: Consts.httpCodeBadRequest, message: "Password is required" });
                    return;
                }
                if (Utils.isEmpty(body.phone)) {
                    done({ status: Consts.httpCodeBadRequest, message: "Phone number is required" });
                    return;
                }
                if (Utils.isEmpty(body.email)) {
                    done({ status: Consts.httpCodeBadRequest, message: "Email is required" });
                    return;
                }
                if (body.userType === 'patient') {
                    if (Utils.isEmpty(body.dateOfBirth)) {
                        done({ status: Consts.httpCodeBadRequest, message: "Date of Birth is required" });
                        return;
                    }
                    if (Utils.isEmpty(body.gender)) {
                        done({ status: Consts.httpCodeBadRequest, message: "Gender is required" });
                        return;
                    }
                } else if (body.userType === 'doctor') {
                    if (Utils.isEmpty(body.medicalDegree)) {
                        done({ status: Consts.httpCodeBadRequest, message: "Medical Degree is required" });
                        return;
                    }
                    if (Utils.isEmpty(body.specialization)) {
                        done({ status: Consts.httpCodeBadRequest, message: "Specialization is required" });
                        return;
                    }
                    if (Utils.isEmpty(body.licenseNumber)) {
                        done({ status: Consts.httpCodeBadRequest, message: "License Number is required" });
                        return;
                    }
                } else if (body.userType === 'admin') {
                    if (Utils.isEmpty(body.jobTitle)) {
                        done({ status: Consts.httpCodeBadRequest, message: "Job Title is required" });
                        return;
                    }
                } else {
                    done({ status: Consts.httpCodeBadRequest, message: "Invalid user type" });
                    return;
                }

                DatabaseManager.user
                    .findOne({
                        where: {
                            email: body.email
                        },
                    })
                    .then((res) => {
                        if (res != undefined) {
                            done({ status: Consts.httpCodeBadRequest, message: "User with this email already exists" });
                            return;
                        }
                        done(null);
                    })
                    .catch((err) => {
                        done({ status: Consts.httpCodeServerError, message: "Sequelize error", error: err });
                    });
            },
            function (done) {
                var params = {
                    name: body.name,
                    password: bcrypt.hashSync(body.password, 8),
                    phone: body.phone,
                    email: body.email,
                    userType: body.userType
                };

                if (body.userType === 'patient') {
                    params.dateOfBirth = body.dateOfBirth;
                    params.gender = body.gender;
                } else if (body.userType === 'doctor') {
                    params.medicalDegree = body.medicalDegree;
                    params.specialization = body.specialization;
                    params.licenseNumber = body.licenseNumber;
                } else if (body.userType === 'admin') {
                    params.jobTitle = body.jobTitle;
                }

                DatabaseManager.user
                    .create(params)
                    .then((res) => {
                        done(null, res);
                    })
                    .catch((err) => {
                        done({ status: Consts.httpCodeServerError, message: "Sequelize error", error: err });
                    });
            }
        ], function (err, data) {
            if (err) {
                return callback(err);
            }

            return callback({
                status: Consts.httpCodeSuccess,
                message: "User created successfully",
                data: data
            });
        });
    }

 

    static findById(userId, callback) {
        async.waterfall(
            [
                function (done) {
                    DatabaseManager.user
                        .findOne({
                            where: {
                                userID: userId,
                            },
                            attributes: ['userID', 'name', 'phone', 'email', 'password', 'dateOfBirth', 'gender', 'medicalDegree', 'specialization', 'licenseNumber', 'jobTitle', 'userType'],
                        })
                        .then((res) => {
                            done(null, res);
                        })
                        .catch((err) => {
                            done(err);
                        });
                },
            ],

            function (err, data) {
                if (err)
                    return callback({
                        status: Consts.httpCodeSeverError,
                        message: "Error fetching user",
                        error: err,
                    });

                return callback({
                    status: Consts.httpCodeSuccess,
                    user: data,
                });
            }
        );
    }

    static update(body, callback) {
        async.waterfall([
            function (done) {
                
                if (!body.userID) {
                    done({ status: Consts.httpCodeBadRequest, message: 'UserID is required' });
                    return;
                }
            
                DatabaseManager.user
                    .findOne({
                        attributes: [
                            'userID', 'name', 'phone', 'email', 'password', 'dateOfBirth', 'gender', 'medicalDegree', 'specialization', 'licenseNumber', 'jobTitle', 'userType'
                        ],
                        where: {
                            userID: body.userID,
                        },
                    })
                    .then((res) => {
                        if (Utils.isEmpty(res)) {
                            done({ status: Consts.httpCodeFileNotFound, message: 'User not found' });
                            return;
                        }
                        done(null, res);
                    })
                    .catch((err) => {
                        done({ status: Consts.httpCodeServerError, message: 'Error updating a user' });
                        return;
                    });
            },

            function (data, done) {
                const dataToUpdate = {
                    name: body.name || data.dataValues.name,
                    email: body.email || data.dataValues.email,
                    phone: body.phone || data.dataValues.phone,
                    password: body.password || data.dataValues.password,
                    dateOfBirth: body.dateOfBirth || data.dataValues.dateOfBirth,
                    gender: body.gender || data.dataValues.gender,
                    medicalDegree: body.medicalDegree || data.dataValues.medicalDegree,
                    specialization: body.specialization || data.dataValues.specialization,
                    licenseNumber: body.licenseNumber || data.dataValues.licenseNumber,
                    jobTitle: body.jobTitle || data.dataValues.jobTitle,
                    userType: body.userType || data.dataValues.userType,
                };

                data.update(dataToUpdate)
                    .then(() => {
                        done(null, { status: Consts.httpCodeOK, message: 'User details updated successfully' });
                    })
                    .catch((err) => {
                        done({ status: Consts.httpCodeServerError, message: 'Error updating a user' });
                    });
            }
        ], function (err, result) {
            callback(err || result);
        });
    }

    static deleteUser(body, callback) {
        async.waterfall([
            function (done) {
                if (!body.userID) {
                    done({ status: Consts.httpCodeBadRequest, message: 'UserID is required' });
                    return;
                }

                DatabaseManager.user
                    .findOne({
                        attributes: [
                            'userID', 'status'
                        ],
                        where: {
                            userID: body.userID,
                        },
                    })
                    .then((res) => {
                        if (Utils.isEmpty(res)) {
                            done({ status: Consts.httpCodeFileNotFound, message: 'User not found' });
                            return;
                        }
                        done(null, res);
                    })
                    .catch((err) => {
                        done({ status: Consts.httpCodeServerError, message: 'Sequelize error' });
                    });
            },

            function (data, done) {
                const dataToUpdate = {
                    status: 'deleted',
                };

                data.update(dataToUpdate)
                    .then(() => {
                        done(null, { status: Consts.httpCodeSuccess, message: 'User successfully deleted' });
                    })
                    .catch((err) => {
                        done({ status: Consts.httpCodeServerError, message: 'Sequelize error' });
                    });
            }
        ], function (err, result) {
            callback(err || result);
        });
    }static deleteUser(body, callback) {
        async.waterfall([
            function (done) {
                if (!body.userID) {
                    done({ status: Consts.httpCodeBadRequest, message: 'UserID is required' });
                    return;
                }

                DatabaseManager.user
                    .findOne({
                        attributes: [
                            'userID', 'status'
                        ],
                        where: {
                            userID: body.userID,
                        },
                    })
                    .then((res) => {
                        if (Utils.isEmpty(res)) {
                            done({ status: Consts.httpCodeFileNotFound, message: 'User not found' });
                            return;
                        }
                        done(null, res);
                    })
                    .catch((err) => {
                        done({ status: Consts.httpCodeServerError, message: 'Sequelize error' });
                    });
            },

            function (data, done) {
                const dataToUpdate = {
                    status: 'deleted',
                };

                data.update(dataToUpdate)
                    .then(() => {
                        done(null, { status: Consts.httpCodeSuccess, message: 'User successfully deleted' });
                    })
                    .catch((err) => {
                        done({ status: Consts.httpCodeServerError, message: 'Sequelize error' });
                    });
            }
        ], function (err, result) {
            callback(err || result);
        });
    }


    static resetPassword(body, callback) {
        async.waterfall(
            [
                function (done) {
                    if (Utils.isEmpty(body.userId)) {
                        done("UserId is required");
                        return;
                    }
                    if (Utils.isEmpty(body.password)) {
                        done("password is required");
                        return;
                    }

                    // if (body.password !== body.confirmPassword) {
                    //     done("Passwords do not match");
                    //     return;
                    // }

                    done(null);
                },

                function (done) {
                    DatabaseManager.user
                        .findOne({
                            attributes: ["userID", "name", "phone", "email", "session", "expiry", "sysproUser", "sysproPassword", "shopID", "userType"],
                            where: { userID: body.userId },
                        })
                        .then((user) => {
                            if (user === null) {
                                done("user not found!");
                                return;
                            }
                            done(null, user);
                        })
                        .catch((err) => {
                            console.log("error");
                            done(err, null);
                        });
                },

                function (user, done) {
                    DatabaseManager.user
                        .update(
                            {
                                password: bcrypt.hashSync(body.password, 8),
                            },
                            { where: { userID: user.userID } }
                        )
                        .then((res) => {
                            done(null, "Password reset succesfull");
                        })
                        .catch((error) => {
                            done("Error resetting password", null);
                        });
                },
            ],
            function (err, data) {
                if (err) {
                    return callback({
                        status: Consts.httpCodeSeverError,
                        message: err,
                    });
                } else {
                    return callback({
                        status: Consts.httpCodeSuccess,
                        message: data,
                    });
                }
            }
        );
    }

  
}

export default UserLogic;