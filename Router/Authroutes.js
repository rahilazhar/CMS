const express = require('express')
const { Caseentries, Getentries, updateschema, deleteHistoryEntry, Gethistory, GetTodayEntries, Factsheetcontroller, getFactsheetByCaseentryId, Getentriesonthebaseofid } = require('../Controllers/Entriescontroller')
const {UserRegistration, logincontroller}  = require('../Controllers/Authcontroller')




const router = express.Router()

// Auth controllers
router.post('/registration' , UserRegistration )
router.post('/login' , logincontroller )

// Case Routes
router.post('/entries', Caseentries)
router.get('/getentries', Getentries)
router.get('/getentriesid/:id', Getentriesonthebaseofid)
router.get('/gettodayentries', GetTodayEntries)
router.post('/factsheet/:caseentryId', Factsheetcontroller)
router.get('/factsheet/caseentry/:caseentryId', getFactsheetByCaseentryId)
router.put('/updateschema/:id', updateschema)
router.delete('/caseentries/:caseId/history/:historyId', deleteHistoryEntry); // Route for deleting history entry
router.get('/gethistory/:caseId', Gethistory)





module.exports = router