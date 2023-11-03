const mongoose = require("mongoose");

const Factsheetschema = new mongoose.Schema(
    {

        caseentry: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Caseentries',
            required: true
        },

        
       facts:{
        type : String,
        required: true
       },

       caseinstituted:{
        type : String,
        required: true
       },

       hearings:{
        type : String,
        required: true
       },

       Natureofcase:{
        type : String,
        required: true
       },

       defendants:{
        type : String,
        required: true
       },

       lastdateofhearing:{
        type : String,
        required: true
       },

       

    },
    { timestamps: true }
);

module.exports = mongoose.model("Factsheet", Factsheetschema);