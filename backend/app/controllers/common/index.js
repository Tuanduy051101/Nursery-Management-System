const bcrypt = require('bcryptjs');
const secretKey = 'keyone';
const jwt = require('jsonwebtoken');

const hashPassword = async (passwd) => {
    const salt = await bcrypt.genSalt(10); // 
    const hashedPassword = await bcrypt.hash(passwd, salt);
    return hashedPassword;
}

const comparePassword = async (password, hashedPassword) => {
    try {
        const isPasswordValid = await bcrypt.compare(password, hashedPassword);
        return isPasswordValid;
    } catch (error) {
        console.log(error);
        return false;
    }
}

const generateToken = (user) => {
    const payload = {
        id: user._id,
        username: user.name
    };
    const option = {
        expiresIn: '24h',
    };
    const token = jwt.sign(payload, secretKey, option);
    return token;
}

const verifyToken = (token) => {
    try {
        const decode = jwt.verify(token, secretKey);
        return decode;
    } catch (error) {
        console.log('Lỗi xác thực token: ', error.message);
        return null;
    }
}

module.exports = {
    hashPassword,
    generateToken,
    verifyToken,
    comparePassword
}