import User from "../Model/user.js";
import bcrypt from 'bcrypt'
import jwt from "jsonwebtoken";
//create user

 export const createUser=async(req,res)=>{
try{

    const {name,email,password}=req.body
    const existEmail=await User.findOne({email})
    if(existEmail){
      return res.status(400).json({message:"User exist already"})
    }
    const hashPassword=await bcrypt.hash(password,10)
const createUser=await User.create({name,email,password:hashPassword})

return res.status(200).json({message:"User created successfully",createUser})

}catch(error){
return res.status(500).json({message:"Something went wrong"})
}
}

//FIND
export const findUser=async(req,res)=>{
    try{
        const {name,email,password}=req.body
        const findUser=await User.find().select(-password)
return res.status(201).json({findUser})
    }catch(error){
return res.status(500).json({message:"something went wrong"})
    }
}

export const findUserById= async(req,res)=>{
    try{
    const {id}=req.params.id
    const {name,email}=req.body
    const findUserById=await User.findOne({id}).select(-password)
    return res.status(201).json({findUserById})
    }
    catch(error){
return res.status(500).json({message:"something went wrong"})
    }
}

export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, password } = req.body;

    const updateData = {
      name,
      email,
    };

    if (password) {
      updateData.password = await bcrypt.hash(password, 10);
    }

    const updatedUser = await User.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    return res.status(200).json({
      message: "User updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error(error);

   return res.status(500).json({
      message: "Something went wrong",
    });
  }
};

//delete
export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedUser = await User.findByIdAndDelete(id);

    if (!deletedUser) {
      return res.status(404).json({
        message: "User not found",
      });
    }

  return  res.status(200).json({
      message: "User deleted successfully",
    });
  } catch (error) {
    console.error(error);

   return res.status(500).json({
      message: "Something went wrong",
    });
  }
};

//login
export const loginUser=async(req,res)=>{
    try{
        const {id}=req.params
const {email,password}=req.body
const loginUser=await User.findOne({email})
if(!loginUser){
  return  res.status(400).json({message:"User don't exist"})
}
const checkPassword=await bcrypt.compare(password,loginUser.password)
if(!checkPassword){
 return   res.status(400).json({message:"Enter correct email or password"})
}
const token=jwt.sign({email:loginUser.email,id:loginUser._id},process.env.JWT_SECRET,   { expiresIn: "7d" })
 return res.status(200).json({message:"Login successfullyy",token})

    }catch(error){
 return res.status(500).json({
      message: "Something went wrong",
    });
    }
}