import * as mongoose from 'mongoose';


const uri: string = 'mongodb://127.0.0.1:27017/local';

mongoose.connect(uri, (err: any) => {
    if (err) {
        console.log(err.message);
    } else {
        console.log("Succesfully Connected!")
    }
});

export const TaskSchema = new mongoose.Schema({
    title: {type:String, required: true},
    author: {type:String, required: true},
    id:  {type:String, required: false},
    ref: {type:String, required: false},
    detail: {type:String, required: false},
    userId: {type:String, required: false},
    version: {type:String, required: true},
    enabled: {type:Boolean, required: true},
    type: {type:String, required: true},
    status: {type:String, required: true}
});

const Task = mongoose.model('Task', TaskSchema);
export default Task;