const { Children, Teacher, Account } = require('../models/model');
const Error = require('http-errors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { generateToken, verifyToken, comparePassword, hashPassword } = require('../controllers/common/index');

exports.create = async (req, res, next) => {

};

exports.findAll = async (req, res, next) => {

};

exports.deleteAll = async (req, res, next) => {

};

exports.delete = async (req, res, next) => {

};

exports.find = async (req, res, next) => {

};

exports.signin = async (req, res, next) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.send({
            error: true,
            message: 'Missing required fields.'
        })
    }
    const check = await Account.exists({ name: username });
    if (!check) {
        return res.send({
            error: true,
            message: 'Invalid username or password.'
        })
    }
    try {
        const user = await Account.findOne({ name: username });
        const children = await Children.find({ account: user._id });
        const teacher = await Teacher.find({ account: user._id });
        const owner = {
            _id: '',
            role: '',
        }
        if (children.length != 0) {
            owner._id = children[0]._id,
                owner.role = 'children'
        }
        if (teacher.length != 0) {
            owner._id = teacher[0]._id,
                owner.role = 'teacher'
        }
        const isPasswordValid = await comparePassword(password, user.password);
        if (!isPasswordValid) {
            return res.send({
                error: true,
                message: 'Invalid username or password.'
            })
        }
        const token = generateToken(user);
        return res.send({
            error: false,
            token: token,
            username: user.name,
            role: user.role,
            owner: owner,
        });
    } catch (error) {
        console.log(error);
        return res.send({
            error: true,
            message: 'Login failed.'
        });
    }
};
