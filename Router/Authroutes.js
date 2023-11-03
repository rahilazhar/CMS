const express = require('express')
const {Caseentries, Getentries , updateschema, Gethistory, GetTodayEntries, Factsheetcontroller, getFactsheetByCaseentryId, Getentriesonthebaseofid} = require('../Controllers/Entriescontroller')




const router = express.Router()

// Case Routes
router.post('/entries' , Caseentries)
router.get('/getentries' , Getentries)
router.get('/getentriesid/:id' ,  Getentriesonthebaseofid)
router.get('/gettodayentries' , GetTodayEntries)
router.post('/factsheet/:caseentryId' , Factsheetcontroller)
router.get('/factsheet/caseentry/:caseentryId', getFactsheetByCaseentryId);
router.put('/updateschema/:id' , updateschema)
router.get('/gethistory/:caseId' , Gethistory)





module.exports = router