const { validationResult } = require("express-validator");
const bcrypt = require('bcryptjs');
const dbConnection = require("../utils/dbConnection");
const con = require("../utils/connection");


let geventcode;
let gcapacity;
let fcapacity;
let acapacity;
let bcapacity;
// Home Page
exports.homePage = async (req, res, next) => {
    const [row] = await dbConnection.execute("SELECT * FROM `users` WHERE `id`=?", [req.session.userID]);

    if (row.length !== 1) {
        return res.redirect('/logout');
    }

    res.render('home', {
        user: row[0]
    });
}

// Register Page
exports.registerPage = (req, res, next) => {
    res.render("register");
};

// User Registration
exports.register = async (req, res, next) => {
    const errors = validationResult(req);
    const { body } = req;

    if (!errors.isEmpty()) {
        return res.render('register', {
            error: errors.array()[0].msg
        });
    }

    try {

        const [row] = await dbConnection.execute(
            "SELECT * FROM `users` WHERE `email`=?",
            [body._email]
        );

        if (row.length >= 1) {
            return res.render('register', {
                error: 'This email already in use.'
            });
        }

        const hashPass = await bcrypt.hash(body._password, 12);

        const [rows] = await dbConnection.execute(
            "INSERT INTO `users`(`name`,`email`,`password`) VALUES(?,?,?)",
            [body._name, body._email, hashPass]
        );

        if (rows.affectedRows !== 1) {
            return res.render('register', {
                error: 'Your registration has failed.'
            });
        }
        
        res.render("register", {
            msg: 'You have successfully registered.'
        });

    } catch (e) {
        next(e);
    }
};

// Login Page
exports.loginPage = (req, res, next) => {
    res.render("login");
};

// Login User
exports.login = async (req, res, next) => {

    const errors = validationResult(req);
    const { body } = req;

    if (!errors.isEmpty()) {
        return res.render('login', {
            error: errors.array()[0].msg
        });
    }

    try {

        const [row] = await dbConnection.execute('SELECT * FROM `users` WHERE `email`=?', [body._email]);

        if (row.length != 1) {
            return res.render('login', {
                error: 'Invalid email address.'
            });
        }

        const checkPass = await bcrypt.compare(body._password, row[0].password);

        if (checkPass === true) {
            req.session.userID = row[0].id;
            return res.redirect('/');
        }

        res.render('login', {
            error: 'Invalid Password.'
        });


    }
    catch (e) {
        next(e);
    }

}

exports.enterPage = (req, res, next) => {
    res.render('enter');
};

exports.enter = async (req, res, next) => {

    const errors = validationResult(req);
    const { body } = req;

    if (!errors.isEmpty()) {
        return res.render('enter', {
            error: errors.array()[0].msg
        });
    }
    try {
        
        console.log(req.body);
        const {_eventcode} = req.body;
        geventcode = _eventcode;

        const [row] = await dbConnection.execute(
            "SELECT * FROM `all_events` WHERE `eventcode`=?",
            [_eventcode]
        );

        if (row.length == 0) {
            return res.render('enter', {
                error: 'This event code does not exist.'
            });
        } else {
            return res.redirect('/view');
        }

    } 
    catch (e) {
        next(e);
    }
}

// View Page
exports.viewPage = async (req, res, next) => {

     const errors = validationResult(req);
    const { body } = req;

    if (!errors.isEmpty()) {
        return res.render('view', {
            error: errors.array()[0].msg
        });
    }
    try{
    //const {_eventcode} = req.body;
    const [row] = await dbConnection.execute("SELECT * FROM `all_events` WHERE `eventcode`=?", [geventcode]);

    res.render('view', {
        selectevent: row[0]
    });
    
    console.log('Reached');
    console.log(row[0]);
        //const {_eventcode} = req.body;
        //geventcode = _eventcode;
    }
    catch (e) {
        next(e);
    }
}

//exports.viewPage = (req, res, next) => {
    //res.render('view');
//};

exports.addPage = (req, res, next) => {

    // make to connection to the database.
        //con.connect()
        // if connection is successful
        con.query("SELECT `capacity` FROM `all_events` WHERE `eventcode` =?",[geventcode], function (err, result, fields) {
            // if any error while executing above query, throw error
            if (err) throw err;
            // if there is no error, you have the result
            Object.keys(result).forEach(function(key) {
            var row = result[key];
            console.log(row.capacity)
            gcapacity = row.capacity;
            console.log(gcapacity);
            acapacity = gcapacity;
            if (acapacity > 0) {
            
            let added = acapacity -1;
            con.query('UPDATE all_events SET ? WHERE eventcode = ?', [{ capacity: added }, geventcode])
            return res.redirect('/view');

        } else{
            
                        console.log('event is full');
                        return res.redirect('/full');

        }
        });
        });
        


};


exports.fullPage = (req, res, next) => {
    res.render('full');
};


exports.removePage = (req, res, next) => {

    // make to connection to the database.
        //con.connect()
        // if connection is successful
        con.query("SELECT `capacity` FROM `all_events` WHERE `eventcode` =?",[geventcode], function (err, result, fields) {
            // if any error while executing above query, throw error
            if (err) throw err;
            // if there is no error, you have the result
            Object.keys(result).forEach(function(key) {
            var row = result[key];
            console.log(row.capacity)
            fcapacity = row.capacity;
            console.log(fcapacity);
            bcapacity = fcapacity;
            if (bcapacity <= fcapacity) {
            
                let removal = bcapacity +1;
            con.query('UPDATE all_events SET ? WHERE eventcode = ?', [{ capacity: removal }, geventcode])
            return res.redirect('/view');

        } else{
            
                        console.log('event is empty');
                        return res.redirect('/original');

        }
        });
        });
        


};

exports.originalPage = (req, res, next) => {
    res.render('original');
};

