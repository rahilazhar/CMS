const Caseentryschema = require('../Models/Caseentryschema');
const Factsheet = require('../Models/Factsheetschema');





const Caseentries = async (req, res) => {
    try {
        const {
            Suitno,
            title,
            nature,
            prevhearing,
            nexthearing,
            factsheet,
            progressreport,
        } = req.body

        if (!Suitno || !title || !nature || !prevhearing || !nexthearing || !factsheet || !progressreport) {
            return res.status(400).send({ Message: "Fill All the Fields" });
        }

        const checksuitno = await Caseentryschema.findOne({ Suitno });

        if (checksuitno) {
            return res.status(409).send({ Message: "Case Already Exists" });
        }

        const newCaseEntry = new Caseentryschema({
            Suitno,
            title,
            nature,
            prevhearing,
            nexthearing,
            factsheet,
            progressreport,
        });

        const savedCaseEntry = await newCaseEntry.save()
        console.log('Case saved:', savedCaseEntry)

        if (savedCaseEntry) {
            return res.status(200).send({ Message: "Case Added Successfully" })
        } else {
            return res.status(400).send({ Message: "Case Added Failed" })
        }
    } catch (error) {
        console.error(error);
        return res.status(500).send({ Message: "Internal Server Error" });
    }
};




// Get Entries Controller

const Getentries = async (req, res) => {
    const Findentries = await Caseentryschema.find()

    if (Findentries.length > 0) {
        return res.status(200).send(Findentries)
    } else {
        return res.status(401).send({ Message: "No Case Found" })
    }
}


const Getentriesonthebaseofid = async (req, res) => {
    // Destructure the id from the request parameters
    const { id } = req.params;

    // Check if id was provided
    if (!id) {
        return res.status(400).send({ Message: "No ID provided" });
    }

    try {
        // Using findOne to get the specific entry by ObjectId
        const Findentry = await Caseentryschema.findById(id);

        if (Findentry) {
            return res.status(200).send(Findentry);
        } else {
            return res.status(404).send({ Message: "Case Not Found" });
        }
    } catch (error) {
        // If there's an error (like an invalid ObjectId), send back a 400 status code
        return res.status(400).send({ Message: "Error fetching case", Error: error.message });
    }
};





const updateschema = async (req, res) => {
    try {
        const { id } = req.params; // Get the object ID from the URL params
        const { date, proceedings } = req.body;

        // Find the existing case entry by its ID
        const existingCaseEntry = await Caseentryschema.findById(id);

        if (!existingCaseEntry) {
            return res.status(404).send({ Message: "Case Entry not found" });
        }

        // Append the new data to the history array
        existingCaseEntry.history.push({ date, proceedings });

        // Save the updated case entry
        const updatedCaseEntry = await existingCaseEntry.save();

        return res.status(200).send({ Message: "Case Entry updated successfully", data: updatedCaseEntry });
    } catch (error) {
        console.error(error);
        return res.status(500).send({ Message: "Internal Server Error" });
    }
};


const Gethistory = async (req, res) => {
    try {
        const { caseId } = req.params;
        const caseEntry = await Caseentryschema.findById(caseId, 'history');
        if (!caseEntry) {
            return res.status(404).send({ Message: 'Case not found' });
        }
        res.send(caseEntry.history);
    } catch (error) {
        console.error(error);
        res.status(500).send({ Message: 'Internal server error' });
    }
}


// Getentries on the base of today's Date
const GetTodayEntries = async (req, res) => {
    let startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    let endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    try {
        const Findentries = await Caseentryschema.find({
            createdAt: { $gte: startOfDay, $lte: endOfDay }
        });

        if (Findentries.length > 0) {
            return res.status(200).send(Findentries);
        } else {
            return res.status(200).send({ Message: "No Case Found" });
        }
    } catch (error) {
        return res.status(500).send({ Error: "Internal Server Error", Details: error.message });
    }
}


// Factsheetschema posted Controller
const Factsheetcontroller = async (req, res) => {
    try {
        const { caseentryId } = req.params;

        // Check if the Caseentry with the given ID exists
        const caseentry = await Caseentryschema.findById(caseentryId);
        if (!caseentry) return res.status(404).send('The Caseentry with the given ID was not found.');

        // Include the Caseentry ID in the Factsheet data
        const factsheetData = { ...req.body, caseentry: caseentryId };
        const factsheet = new Factsheet(factsheetData);

        // Save the factsheet
        await factsheet.save();

        res.send(factsheet);
    } catch (error) {
        res.status(500).send(error.message);
    }
}


// get the factsheet on the base of id

const getFactsheetByCaseentryId = async (req, res) => {
    try {
        const { caseentryId } = req.params;

        // Find all the Factsheets that reference the provided Caseentry ID
        const factsheets = await Factsheet.find({ caseentry: caseentryId })
        // .populate('caseentry');
        if (factsheets.length === 0) {
            return res.status(404).send('No Factsheets found for the provided Caseentry ID');
        }

        res.json(factsheets);
    } catch (error) {
        res.status(500).send(error.message);
    }
};






module.exports = { Caseentries, Getentries, updateschema, Gethistory, Getentriesonthebaseofid, GetTodayEntries, Factsheetcontroller, getFactsheetByCaseentryId }

