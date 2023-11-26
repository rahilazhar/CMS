const Userschema = require ('../Models/Userschema')




const Getallusers  = async(req , res) => {
    const getallusers = await Userschema.find()
    res.status(200).send(getallusers)
}


module.exports = {Getallusers}