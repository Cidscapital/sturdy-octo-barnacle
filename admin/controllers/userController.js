const { validationResult } = require("express-validator");
const bcrypt = require('bcryptjs');
const dbConnection = require("../utils/dbConnection");
const { NULL } = require("mysql/lib/protocol/constants/types");





// Home Page
exports.homePage = async (req, res, next) => {
    const [row] = await dbConnection.execute("SELECT * FROM `admin` WHERE `id`=?", [req.session.userID]);

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
            "SELECT * FROM `admin` WHERE `email`=?",
            [body._email]
        );

        if (row.length >= 1) {
            return res.render('register', {
                error: 'This email already in use.'
            });
        }

        const hashPass = await bcrypt.hash(body._password, 12);

        const [rows] = await dbConnection.execute(
            "INSERT INTO `admin`(`name`,`email`,`password`) VALUES(?,?,?)",
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

        const [row] = await dbConnection.execute('SELECT * FROM `admin` WHERE `email`=?', [body._email]);

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


exports.insertPage = (req, res, next) => {
    res.render('insert');
};
exports.insert = async (req, res, next) => {

    const errors = validationResult(req);
    const { body } = req;

    if (!errors.isEmpty()) {
        return res.render('insert', {
            error: errors.array()[0].msg
        });
    }

    try{
    console.log(req.body);
    const { _event, _eventcode, _capacity, _venue } = req.body;

    const [row] = await dbConnection.execute(
            "SELECT * FROM `all_events` WHERE `eventcode`=?",
            [_eventcode]
        );

        if (row.length >= 1) {
            return res.render('insert', {
                error: 'This event code is already in use.'
            });
        }

            if (_event !== NULL && _event !== '') {
                
                if (_venue !== NULL && _venue !== '') {
                   const [rows] = await dbConnection.execute(
                    "INSERT INTO `all_events`(`eventcode`,`eventname`,`venue`,`capacity`,`created_at`) VALUES(?,?,?,?,NOW())",
                        [_eventcode, _event, _venue, _capacity]); 
                        res.render('insert', {
                     msg: 'Event added successfully. Event code is: ' + _eventcode
                        });
                     
                } else{
                    res.render('insert', {
                 error: 'Fill in venue Appropriately.'
                     });
                } 
            }else {
                res.render('insert', {
                 error: 'Fill in event name Appropriately.'
                     });
            }
            
    }
    catch (e) {
        next(e);
    }
}