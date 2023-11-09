const express = require('express')
const { Caseentries, Getentries, gettodayhearings, updateschema, deleteHistoryEntry, Gethistory, GetTodayEntries, Factsheetcontroller, getFactsheetByCaseentryId, Getentriesonthebaseofid, updateFactsheetByCaseentryId, deleteCaseEntry, getCaseBySuitno } = require('../Controllers/Entriescontroller')
const { UserRegistration, logincontroller } = require('../Controllers/Authcontroller')




// ok
const router = express.Router()

// Auth controllers
router.post('/registration', UserRegistration)
router.post('/login', logincontroller)

// Case Routes
router.post('/entries', Caseentries)
router.get('/getentries', Getentries)
router.get('/getentriesid/:id', Getentriesonthebaseofid)
router.get('/gettodayentries', GetTodayEntries)
router.delete('/deleteentries/:id' , deleteCaseEntry)

// Factsheetroutes
router.post('/factsheet/:caseentryId', Factsheetcontroller)
router.get('/factsheet/caseentry/:caseentryId', getFactsheetByCaseentryId)
router.put('/editfactsheet/:caseentryId', updateFactsheetByCaseentryId)

// history routes
router.put('/updateschema/:id', updateschema)
router.delete('/caseentries/:caseId/history/:historyId', deleteHistoryEntry); // Route for deleting history entry
router.get('/gethistory/:caseId', Gethistory)


router.get('/gettodayhearings' ,  gettodayhearings)











module.exports = router