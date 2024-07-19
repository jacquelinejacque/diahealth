import { Consts } from "../lib/Consts.js";
import DatabaseManager from "../lib/DatabaseManager.js";
import Utils from "../lib/Utils.js";
import jwt from "jsonwebtoken";

function authenticate(request, response, next) {
    try {
        var token = request.headers['access-token'];
        if (Utils.isEmpty(token)) {
            response.json({
                status: Consts.unAuthorized,
                message: "Authentication failed"
            });
            return;
        }

        var decoded = jwt.verify(token, process.env['JWT_KEY']);
        DatabaseManager.user.findOne({
            attributes: ["userID", "name", "phone", "session", "email", "shopID", "expiry", "sysproUser", "userType"],
            where: { session: decoded.session }
        }).then((res) => {
            if (!res) {
                response.json({
                    status: Consts.unAuthorized,
                    message: "Authentication failed"
                });
                return;
            }
            request.body.user = res;
            request.query.user = res;
            request.params.user = res;
            next();
        }).catch((err) => {
            response.json({
                status: Consts.unAuthorized,
                message: "Authentication failed"
            });
        });
    } catch (err) {
        response.json({
            status: Consts.unAuthorized,
            message: "Authentication failed"
        });
    }
}

export default authenticate;
