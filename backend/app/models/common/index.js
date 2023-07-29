const mongoose = require("mongoose");

const stringTrue = {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
};

const stringFalse = {
    type: String,
    required: false,
    trim: true,
    lowercase: true,
};

const numberTrue = {
    type: Number,
    required: true,
    trim: true,
    default: 0,
};

const numberFalse = {
    type: Number,
    required: false,
    trim: true,
    default: 0,
};

const booleanTrue = {
    type: Boolean,
    required: true,
    default: true,
}

const booleanFalse = {
    type: Boolean,
    required: false,
    default: false,
}

const objectId = (nameRef) => {
    return {
        type: mongoose.Schema.Types.ObjectId,
        ref: nameRef,
    };
}

const arrayId = (nameRef) => {
    return [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: nameRef,
        }
    ]
}

const newModel = (nameModel, schema) => {
    const nameSchema = new mongoose.Schema(schema);
    return mongoose.model(nameModel, nameSchema);
}

module.exports = {
    stringTrue,
    stringFalse,
    numberTrue,
    numberFalse,
    objectId,
    newModel,
    arrayId,
    booleanTrue,
    booleanFalse,
}
