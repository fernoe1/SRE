import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import Basket from './Basket.js';

const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },
    basketId: {
        type: Schema.Types.ObjectId,
        ref: 'Basket'  
    },
     address: {
        type: String,
    },
    city: {
        type: String,
    },
    state: {
        type: String,
    },
    postalCode: {
        type: String,
    },
    phoneNumber: {
        type: String,
    }
});

userSchema.statics.updateProfile = async function (userId, { address, city, state, postalCode, phoneNumber }) {
    const user = await this.findById(userId);
    if (!user) {
        throw new Error('User not found');
    }

    if (address !== undefined) user.address = address;
    if (city !== undefined) user.city = city;
    if (state !== undefined) user.state = state;
    if (postalCode !== undefined) user.postalCode = postalCode;
    if (phoneNumber !== undefined) user.phoneNumber = phoneNumber;

    await user.save();

    return user;
};

userSchema.statics.login = async function (email, password) {
    if (!email || !password) {
        throw Error('All fields must be filled');
    }

    const user = await this.findOne({ email });

    if (!user) {
        throw Error('Incorrect email');
    }

    const match = await bcrypt.compare(password, user.password);

    if (!match) {
        throw Error('Incorrect password');
    }

    return user;
}

userSchema.statics.signup = async function (name, email, password) {
    const exists = await this.findOne({ email });

    if (exists) {
        throw Error('Email already in use');
    }

    const salt = await bcrypt.genSalt();
    const hash = await bcrypt.hash(password, salt);

    const basket = new Basket();
    await basket.save();

    const user = await this.create({ name, email, password: hash, basketId: basket._id });

    basket.userId = user._id;
    await basket.save();


    return user;
}

export default mongoose.model('User', userSchema);