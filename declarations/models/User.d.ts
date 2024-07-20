import mongoose from "mongoose";
interface user {
    username: string;
    email: string;
    password: string;
    description: string;
    createdAt: Date;
    updatedAt: Date;
    admin: Boolean;
    adminedAt?: Date;
}
declare const User: mongoose.Model<user, {}, {}, {}, mongoose.Document<unknown, {}, user> & user & {
    _id: mongoose.Types.ObjectId;
}, mongoose.Schema<user, mongoose.Model<user, any, any, any, mongoose.Document<unknown, any, user> & user & {
    _id: mongoose.Types.ObjectId;
}, any>, {}, {}, {}, {}, mongoose.DefaultSchemaOptions, user, mongoose.Document<unknown, {}, mongoose.FlatRecord<user>> & mongoose.FlatRecord<user> & {
    _id: mongoose.Types.ObjectId;
}>>;
export default User;
