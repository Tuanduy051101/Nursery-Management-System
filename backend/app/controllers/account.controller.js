const { Children, Teacher, Account } = require('../models/model');
const Error = require('http-errors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { generateToken, verifyToken, comparePassword, hashPassword } = require('../controllers/common/index');

exports.create = async (req, res, next) => {
};

exports.findAll = async (req, res, next) => {
    try {
        const documents = await Account.find();
        return res.send(documents);
    } catch (error) {
        console.log(error);
    }
};

exports.deleteAll = async (req, res, next) => {

};

exports.delete = async (req, res, next) => {

};

exports.find = async (req, res, next) => {

};

exports.signin = async (req, res, next) => {
    const { username, password } = req.body;
    console.log(req.body);
    if (!username || !password) {
        return res.send({
            error: true,
            message: 'Vui lòng điền đầy đủ thông tin.'
        })
    }
    const check = await Account.exists({ name: username });
    if (!check) {
        console.log('c');
        return res.send({
            error: true,
            message: 'Tên đăng nhập hoặc mật khẩu không hợp lệ.'
        })
    }
    try {
        const user = await Account.findOne({ name: username });
        const children = await Children.find({ account: user._id }).populate('childcareCenter');
        const teacher = await Teacher.find({ account: user._id }).populate('childcareCenter');
        console.log(children);
        const owner = {
            _id: '',
            role: '',
            name: '',
            childcareCenter: '',
            childcareCenterName: '',
            childcareCenterEmail: '',
            childcareCenterPhone: '',
            childcareCenterAddress: '',
            isHeadquarters: '',
        }
        if (children.length != 0) {
            owner._id = children[0]._id;
            owner.name = children[0].name;
            owner.childcareCenter = children[0].childcareCenter[children[0].childcareCenter.length - 1]._id;
            owner.childcareCenterName = children[0].childcareCenter[children[0].childcareCenter.length - 1].name;
            owner.childcareCenterEmail = children[0].childcareCenter[children[0].childcareCenter.length - 1].email;
            owner.childcareCenterPhone = children[0].childcareCenter[children[0].childcareCenter.length - 1].phone;
            owner.childcareCenterAddress = children[0].childcareCenter[children[0].childcareCenter.length - 1].address;
            owner.isHeadquarters = (await hashPassword(children[0].childcareCenter[children[0].childcareCenter.length - 1].isHeadquarters.toString())).toString();
            owner.role = 'children';
        }
        if (teacher.length != 0) {
            owner._id = teacher[0]._id;
            owner.name = teacher[0].name;
            owner.childcareCenter = teacher[0].childcareCenter[teacher[0].childcareCenter.length - 1]._id;
            owner.childcareCenterName = teacher[0].childcareCenter[teacher[0].childcareCenter.length - 1].name;
            owner.childcareCenterEmail = teacher[0].childcareCenter[teacher[0].childcareCenter.length - 1].email;
            owner.childcareCenterPhone = teacher[0].childcareCenter[teacher[0].childcareCenter.length - 1].phone;
            owner.childcareCenterAddress = teacher[0].childcareCenter[teacher[0].childcareCenter.length - 1].address;
            owner.isHeadquarters = (await hashPassword(teacher[0].childcareCenter[teacher[0].childcareCenter.length - 1].isHeadquarters.toString())).toString();
            owner.role = 'teacher';
        }
        console.log('cc')
        const isPasswordValid = await comparePassword(password, user.password);
        if (!isPasswordValid) {
            console.log('c1');
            return res.send({
                error: true,
                message: 'Tên đăng nhập hoặc mật khẩu không hợp lệ.'
            })
        }
        const token = generateToken(user);
        console.log({
            error: false,
            token: token,
            username: user.name,
            role: user.role,
            owner: owner,
            message: 'Đăng nhập thành công.'
        });
        return res.send({
            error: false,
            token: token,
            username: user.name,
            role: user.role,
            owner: owner,
            message: 'Đăng nhập thành công.'
        });
    } catch (error) {
        console.log(error);
        return res.send({
            error: true,
            message: 'Đăng nhập thất bại.'
        });
    }
};

exports.verifyToken = async (req, res, next) => {
    const { token, isHeadquarters } = req.body;
    console.log(isHeadquarters);
    if (!verifyToken(token)) {
        return res.send({
            error: true,
            message: 'Phiên đăng nhập đã hết hạn'
        })
    }
    const temp = await comparePassword('trụ sở chính', isHeadquarters);
    console.log(temp);
    if (temp) {
        return res.send({
            error: false,
            message: 'xxx',
            isHeadquarters: true,
        })
    }

    return res.send({
        error: false,
        message: 'xxx',
        isHeadquarters: false,
    });

}
