import _ from 'lodash';
import moment from 'moment';

class Utils {

    static randomString(len, charSet) {
        charSet = charSet || 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        var randomString = '';

        for (var i = 0; i < len; i++) {
            var randomPoz = Math.floor(Math.random() * charSet.length);
            randomString += charSet.substring(randomPoz, randomPoz + 1);
        }

        return randomString;// + Math.floor(Date.now());
    }

    static isEmpty(variable) {

        if (_.isUndefined(variable))
            return true;

        if (_.isNull(variable))
            return true;

        if (_.isString(variable) && _.isEmpty(variable))
            return true;

        return false;

    }
    static isValidJson(str) {
        try {
            JSON.parse(str);
            // console.log("json parsed")
        } catch (e) {
            // console.log(e)
            //changed roles since the function is used without negation
            return true;
        }
        return false;
    }
    static localizeString(str) {

        return str;
    }
    static trim(str) {
        try {
            var myStr = str.toString();
            var inputtxt = myStr.replace(/\s/g, "");//replace(/\s*$/, "");
            return inputtxt;
        } catch (error) {
            // console.log("String with Error "+str)
            console.log("Error on trim " + error)
            return str.replace(/\s/g, "");
        }

    }
    static strToUpperCase(str) {

        var res = str.toUpperCase();
        return res;
    }
    static removeSpecialChars(str) {
        try {
            str.replace('/\\d/', '');
        } catch (error) {

        }
        //return the first 50 chars
        return str.substring(0, 50);
    }
    static now() {
        return Math.floor(Date.now());
    }
    static randomNumbers(len, charSet) {

        charSet = charSet || '0123456789';
        var randomOTP = '';
        for (var i = 0; i < len; i++) {
            var randomPoz = Math.floor(Math.random() * charSet.length);
            randomOTP += charSet.substring(randomPoz, randomPoz + 1);
        }

        return randomOTP;
    }
    static getTodayDate() {
        let date = moment(Date.now()).format('YYYY-MM-DD');
        return date;
    }
    static subtractDaysFromDate(date, numberOfDays) {
        let d = new Date(date);
        d.setDate(d.getDate() - numberOfDays)
        return moment(d).format('YYYY-MM-DD');

    }
    static addDaysToDate(date, numberOfDays) {
        let d = new Date(date);
        d.setDate(d.getDate() + numberOfDays)
        return moment(d).format('YYYY-MM-DD');

    }
    static addTimeToDate(months=0, days=0,hours=0,minutes=0,seconds=0) {
        let d = new Date();
        
        d.setDate(d.getDate() + days)
        d.setMonth(d.getMonth() + months)
        d.setHours(d.getHours() + hours)
        d.setMinutes(d.getMinutes() + minutes)
        d.setSeconds(d.getSeconds() + seconds)
        var date=moment(d).format('yyyy-MM-DDTHH:mm:ss');
        // console.log(date)
        return date

    }
    static getStartYearDate() {
        let date = moment(new Date(new Date().getFullYear(), 0, 1)).format('YYYY-MM-DD');
        return date;
    }
    static parseDate(date) {
        var d = new Date(date) 
        return moment(d).format('YYYY-MM-DD HH:mm:ss');
        
    }

    static getDateTime() {
        var d = new Date()
        //   .toLocaleString('en-US',{timeZone: "America/New_York"} );
        // console.log(d)
        let date = moment(d).format('YYYY-MM-DD HH:mm:ss');
        return date;
    }
    static longToDate(date) {

        try {

            var time = moment(parseInt(date));
            var timestamp = time.format('YYYY-MM-DD HH:mm:ss');

            return timestamp;// d.toISOString().split('T', 1)[0];//toLocaleDateString("en-US");
        } catch (error) {
            var d = new Date(parseInt(date));//
            var time = moment(d);
            var timestamp = time.format('YYYY-MM-DD HH:mm:ss');
            return timestamp;
        }
    }
    static getDateDiff(startDate, endDate) {
        try {
            // To set two dates to two variables 
            var date1 = new Date(startDate);
            var date2 = new Date(endDate);
            // To calculate the time difference of two dates 
            var timeDifference = date1.getTime() - date2.getTime();
            // To calculate the no. of days between two dates 
            var days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
            var hours = 0, hours = 0, minutes = 0, seconds = 0;
            var dayString = "";

            // console.log("DATE DIFF "+startDate)

            if (days > 0) {
                days = (timeDifference - timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60 * 24);
                timeDifference = timeDifference % (1000 * 60 * 60 * 24);
                dayString = days + " Days ";
                return dayString;
            }
            hours = Math.floor(timeDifference / (1000 * 60 * 60));//hours
            if (hours > 0) {
                hours = (timeDifference - timeDifference % (1000 * 60 * 60)) / (1000 * 60 * 60);
                timeDifference = timeDifference % (1000 * 60 * 60);
                dayString = dayString + hours + " Hours ";
                return dayString;
            }
            minutes = Math.floor(timeDifference / (1000 * 60)); //Minutes
            if (minutes > 0) {
                minutes = (timeDifference - timeDifference % (1000 * 60)) / (1000 * 60);
                timeDifference = timeDifference % (1000 * 60);
                dayString = dayString + minutes + " Minutes ";
                return dayString;
            }

            seconds = Math.floor(timeDifference / (1000));//Seconds
            if (seconds > 0)
                dayString = dayString + seconds + " Seconds";

            // console.log("DATE DIFF "+dayString)
            return dayString;
        } catch (error) {
            return "";
        }

    }
    static getTimeDiff(startDate, endDate) {
        try {
            // To set two dates to two variables 
            var date1 = new Date(startDate);
            var date2 = new Date(endDate);

            // To calculate the time difference of two dates 
            var timeDifference = date2.getTime() - date1.getTime();
            var seconds = 0;

            seconds = Math.floor(timeDifference / (1000));//Seconds 

            return Math.floor(timeDifference);
        } catch (error) {
            return "";
        }

    }
    static formatNumbersToK(value) {
        if (value < 1e3) return value;
        if (value >= 1e3 && value < 1e6) return +(value / 1e3).toFixed(1) + "K";
        if (value >= 1e6 && value < 1e9) return +(value / 1e6).toFixed(1) + "M";
        if (value >= 1e9 && value < 1e12) return +(value / 1e9).toFixed(1) + "B";
        if (value >= 1e12) return +(value / 1e12).toFixed(1) + "T";
    }
    static formatMoney(amount, decimalCount = 2, decimal = ".", thousands = ",") {
        try {
            decimalCount = Math.abs(decimalCount);
            decimalCount = isNaN(decimalCount) ? 2 : decimalCount;

            const negativeSign = amount < 0 ? "-" : "";

            var i = (parseInt(amount = Math.abs(Number(amount) || 0).toFixed(decimalCount)).toString());
            let j = (i.length > 3) ? i.length % 3 : 0;

            return negativeSign + (j ? i.substr(0, j) + thousands : '') + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + thousands) + (decimalCount ? decimal + Math.abs(amount - i).toFixed(decimalCount).slice(2) : "");
        } catch (e) {
            console.log(e)
            return amount
        }
    }











}

export default Utils