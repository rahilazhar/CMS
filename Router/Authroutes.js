const express = require('express')
const { Caseentries, Getentries, gettodayhearings, updateschema, deleteHistoryEntry, Gethistory, GetTodayEntries, Factsheetcontroller, getFactsheetByCaseentryId, Getentriesonthebaseofid, updateFactsheetByCaseentryId, deleteCaseEntry, getCaseBySuitno, Editallentries, RequestEdit, Approvedrequest, ListPendingEditRequests, UpdateRequestStatus } = require('../Controllers/Entriescontroller')
const { UserRegistration, logincontroller } = require('../Controllers/Authcontroller')
const auth = require('../Middlewares/Verification')
const { Editrequestget } = require('../Controllers/AdminController')
const { Getallusers } = require('../Controllers/Usercontroller')




// ok
const router = express.Router()

// Auth controllers
router.post('/registration', UserRegistration)
router.post('/login', logincontroller)

// Case Routes
router.post('/entries', Caseentries)
router.get('/getentries/:id?', Getentries);


router.put('/editentries/:id', auth, Editallentries)
router.post('/reqedit/:id', auth, RequestEdit)
router.post('/approvedreq/:userId', Approvedrequest)
router.get('/pendingrequests', ListPendingEditRequests)
router.post('/updaterequest/:id', UpdateRequestStatus) // A general route for both approval and rejection
router.get('/editreqget', Editrequestget)

router.get('/getentriesid/:id', Getentriesonthebaseofid)
router.get('/gettodayentries', GetTodayEntries)
router.delete('/deleteentries/:id', deleteCaseEntry)

// Factsheetroutes
router.post('/factsheet/:caseentryId', Factsheetcontroller)
router.get('/factsheet/caseentry/:caseentryId', getFactsheetByCaseentryId)
router.put('/editfactsheet/:caseentryId', updateFactsheetByCaseentryId)

// history routes
router.put('/updateschema/:id', updateschema)
router.delete('/caseentries/:caseId/history/:historyId', deleteHistoryEntry); // Route for deleting history entry
router.get('/gethistory/:caseId', Gethistory)


router.get('/gettodayhearings', gettodayhearings)


// Users Routes

router.get('/getallusers', Getallusers)


module.exports = router