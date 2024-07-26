import async from "async";
import DatabaseManager from "../lib/DatabaseManager.js";
import { Consts } from "../lib/Consts.js";
import Utils from "../lib/Utils.js";

class UserLogic {
    static update(body, callback) {
        async.waterfall([
            function (done) {
                console.log('User ID:', body.userID); // Log the user ID

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
                        done({ status: Consts.httpCodeSeverError, message: err.message });
                    });
            },
            function (user, done) {
                const params = {
                    name: body.name,
                    phone: body.phone,
                    email: body.email,
                    userType: body.userType,
                };

                if (body.userType === 'patient') {
                    if (Utils.isEmpty(body.dateOfBirth)) {
                        done({ status: Consts.httpCodeSeverError, message: 'Date of birth is required for patient' });
                        return;
                    }
                    if (Utils.isEmpty(body.gender)) {
                        done({ status: Consts.httpCodeSeverError, message: 'Gender is required for patient' });
                        return;
                    }
                    params.dateOfBirth = body.dateOfBirth;
                    params.gender = body.gender;
                } else if (body.userType === 'doctor') {
                    if (Utils.isEmpty(body.medicalDegree)) {
                        done({ status: Consts.httpCodeSeverError, message: 'Medical degree is required for doctor' });
                        return;
                    }
                    if (Utils.isEmpty(body.specialization)) {
                        done({ status: Consts.httpCodeSeverError, message: 'Specialization is required for doctor' });
                        return;
                    }
                    if (Utils.isEmpty(body.licenseNumber)) {
                        done({ status: Consts.httpCodeSeverError, message: 'License number is required for doctor' });
                        return;
                    }
                    params.medicalDegree = body.medicalDegree;
                    params.specialization = body.specialization;
                    params.licenseNumber = body.licenseNumber;
                } else if (body.userType === 'admin') {
                    if (Utils.isEmpty(body.jobTitle)) {
                        done({ status: Consts.httpCodeSeverError, message: 'Job title is required for admin' });
                        return;
                    }
                    params.jobTitle = body.jobTitle;
                }
                done(null, params);
            },
            function (params, done) {
                DatabaseManager.user
                    .update(params, { where: { userID: body.userID } })
                    .then((res) => {
                        done(null, res);
                    })
                    .catch((err) => {
                        done({ status: Consts.httpCodeSeverError, message: err.message });
                    });
            },
        ],
        function (err, data) {
            if (err) {
                return callback({
                    status: err.status || Consts.httpCodeSeverError,
                    message: err.message || 'Failed to update user',
                    error: err,
                });
            }

            return callback({
                status: Consts.httpCodeSuccess,
                message: 'User updated successfully',
            });
        });
    }
}

export default UserLogic;
