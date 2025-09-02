import mongoose, {Schema} from "mongoose";
const userSchema = new Schema({
    name: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    role: {type: String,enum:['patient', 'healthexpert', 'admin'], required: true},
    gender: {type: String, enum:['male', 'female'], required: true},
    dob: {type: Date},
    phone: {type: String, required: true},
    Emergencycontact: {type: String, required: true},
    Specialisation: {type: String, required: true},
}, {timestamps: true});

export default mongoose.model('Users',userSchema)