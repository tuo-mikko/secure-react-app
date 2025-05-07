import mongoose, {Document, Schema, Model} from 'mongoose'

export interface IUser extends Document {
    _id : mongoose.Types.ObjectId
    username : string,
    name : string,
    passwordHash: string,
    posts: mongoose.Types.ObjectId[]
}

const userSchema: Schema<IUser> = new Schema({
    username: {type: String, required: true, unique: true, minlength:3, maxlength:30},
    name: {type: String, minlength:3, maxlength:30},
    passwordHash: {type: String, required: true},
    posts: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Post',
        },
    ],
})

userSchema.set('toJSON', {
  transform: (_document, returnedObject: any) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
    delete returnedObject.passwordHash;
  }
});

const UserModel: Model<IUser> = mongoose.model<IUser>('User', userSchema)

export default UserModel