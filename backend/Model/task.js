import mongoose from "mongoose";
const taskSchema=new mongoose.Schema({
    title:{
        required:true,
        type:String

    },
    description:{
        required:true,
        type:String
    },
    status:{
        required:true,
        type:String,
        enum:["completed","in-progess","incompleted"],
        default:"incompleted",
    
    },
    priority:{
type:String,
required:true,
enum:['low','medium','high'],
default:'medium',
    },
    status: {
  type: String,
  enum: ["todo", "in-progress", "completed"],
  default: "todo",
  required: true,
},
    dueDate:{
        required:true,
type:Date,

    },
    user:{
        type:mongoose.Schema.Types.ObjectId,
ref:"User",
required:true
    }

},
{
    timestamps:true
}
)
const Task=mongoose.model('Task',taskSchema)
export default Task;