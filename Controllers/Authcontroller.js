const Userschema = require("../Models/Userschema")
const bcrypt = require('bcrypt')
const JWT = require('jsonwebtoken')


const UserRegistration = async (req, res) => {
    const { name, email, password, role } = req.body

    if (!name || !email || !password) {
        return res.send({ message: "please fill all the fields" })
    }
    // check existing email 
    const checkuser = await Userschema.findOne({ email })
    if (checkuser) {
        return res.send({ message: "User Already Exist" })
    }
    const hashed = await bcrypt.hash(password, 10)
    const newuser = new Userschema({ name, email, password: hashed, role })

    const result = newuser.save()
    if (result) {
        return res.send({ message: "USER REGISTERED SUCCESSFULLY", role, email })
    } else {
        return res.send({ ERROR: "Failed" })
    }
}


// Login Route
const logincontroller = async (req, res) => {
    const { email, password } = req.body

    const checkuser = await Userschema.findOne({ email })
    if (!checkuser) {
        return res.status(400).send({ message: "Invalid Email" })
    }
    const compare = await bcrypt.compare(password, checkuser.password)

    const token = JWT.sign({ _id: checkuser._id, role: checkuser.role }, process.env.JWT_Key, { expiresIn: '7d' });

    if (compare) {
        return res.send({ Message: "Login Successfull", email, role: checkuser.role, id: checkuser._id, name: checkuser.name, token });
    } else {
        // Send a 401 Unauthorized status code for a failed login
        return res.status(401).send({ Message: "Login Failed" });
    }
    
}




module.exports = { UserRegistration, logincontroller }