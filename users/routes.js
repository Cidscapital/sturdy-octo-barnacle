const express = require('express');
const router = express.Router();
const { body } = require("express-validator");
const authController = require('./controllers/userController')

const {
    homePage,
    register,
    registerPage,
    login,
    loginPage,
    enterPage,
    viewPage,
    addPage,
    removePage,
    fullPage,
    originalPage,
} = require("./controllers/userController");

const ifNotLoggedin = (req, res, next) => {
    if(!req.session.userID){
        return res.redirect('/login');
    }
    next();
}

const ifLoggedin = (req,res,next) => {
    if(req.session.userID){
        return res.redirect('/');
    }
    next();
}

router.get('/', ifNotLoggedin, homePage);

router.get("/login", ifLoggedin, loginPage);
router.post("/login",
ifLoggedin,
    [
        body("_email", "Invalid email address")
            .notEmpty()
            .escape()
            .trim()
            .isEmail(),
        body("_password", "The Password must be of minimum 4 characters length")
            .notEmpty()
            .trim()
            .isLength({ min: 4 }),
    ],
    login
);

router.get("/signup", ifLoggedin, registerPage);
router.post(
    "/signup",
    ifLoggedin,
    [
        body("_name", "The name must be of minimum 3 characters length")
            .notEmpty()
            .escape()
            .trim()
            .isLength({ min: 3 }),
        body("_email", "Invalid email address")
            .notEmpty()
            .escape()
            .trim()
            .isEmail(),
        body("_password", "The Password must be of minimum 4 characters length")
            .notEmpty()
            .trim()
            .isLength({ min: 4 }),
    ],
    register
);

router.post('/enter', authController.enter );
router.get('/enter', ifNotLoggedin, enterPage);

router.get('/view', ifNotLoggedin, viewPage);

//router.post('/add', authController.add );
router.get('/add', ifNotLoggedin, addPage);
router.get('/remove', ifNotLoggedin, removePage);
router.get('/full', ifNotLoggedin, fullPage);
router.get('/original', ifNotLoggedin, originalPage);


router.get('/logout', (req, res, next) => {
    req.session.destroy((err) => {
        next(err);
    });
    res.redirect('/login');
});

module.exports = router;
