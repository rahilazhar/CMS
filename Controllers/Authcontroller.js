const Userschema = require("../Models/Userschema")
const bcrypt = require('bcrypt')
const JWT = require('jsonwebtoken')


const UserRegistration = async (req, res) => {
    const { name, email, password, role , isUserApproved } = req.body

    if (!name || !email || !password) {
        return res.send({ message: "please fill all the fields" })
    }
    // check existing email 
    const checkuser = await Userschema.findOne({ email })
    if (checkuser) {
        return res.send({ message: "User Already Exist" })
    }
    const hashed = await bcrypt.hash(password, 10)
    const newuser = new Userschema({ name, isUserApproved, email, password: hashed, role })

    const result = newuser.save()
    if (result) {
        return res.send({ message: "USER REGISTERED SUCCESSFULLY", role, email })
    } else {
        return res.send({ ERROR: "Failed" })
    }
}


// Login Route
const logincontroller = async (req, res) => {
    // const { email, password } = req.body

    // const checkuser = await Userschema.findOne({ email })
    // if (!checkuser) {
    //     return res.status(400).send({ message: "Invalid Email" })
    // }
    // const compare = await bcrypt.compare(password, checkuser.password)

    // const token = JWT.sign({ _id: checkuser._id, role: checkuser.role }, process.env.JWT_Key, { expiresIn: '7d' });

    // if (compare) {
    //     return res.send({ Message: "Login Successfull", email, role: checkuser.role, id: checkuser._id, name: checkuser.name, token });
    // } else {
    //     // Send a 401 Unauthorized status code for a failed login
    //     return res.status(401).send({ Message: "Login Failed" });
    // }

    const { email, password } = req.body;

    try {
        const user = await Userschema.findOne({ email });
        if (!user) {
            return res.status(400).send('User not found');
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).send('Invalid credentials');
        }

        const token = JWT.sign({ id: user._id }, process.env.JWT_Key, { expiresIn: '1h' }); // Replace 'your_jwt_secret' with a real secret key

        res.status(200).json({ token ,  role:user.role , email:user.email });
    } catch (error) {
        res.status(500).send('Server error');
    }

}




module.exports = { UserRegistration, logincontroller }