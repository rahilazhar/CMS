const Editrequestschema = require('../Models/EditrequestSchema')



const Editrequestget = async(req , res) => {
   const getalleditrequest = await Editrequestschema.find()

   if(getalleditrequest.length > 0){
    return res.status(200).send(getalleditrequest)

   }else{
    res.status(404).send({Message : "No data Available"})
   }
}


module.exports = {Editrequestget}