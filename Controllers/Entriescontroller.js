const Caseentryschema = require('../Models/Caseentryschema');
const Factsheet = require('../Models/Factsheetschema');
const EditRequest = require('../Models/EditrequestSchema')
const Userschema = require('../Models/Userschema')






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

const deleteCaseEntry = async (req, res) => {
    try {
        const { id } = req.params; // Get the id from the request parameters

        // Attempt to delete the case entry using the id
        const result = await Caseentryschema.findByIdAndDelete(id);

        if (!result) {
            return res.status(404).send({ Message: "Case not found" });
        }

        return res.status(200).send({ Message: "Case deleted successfully" });
    } catch (error) {
        console.error(error);
        return res.status(500).send({ Message: "Internal Server Error" });
    }
};





// Get Entries Controller

// const Getentries = async (req, res) => {
//     const Findentries = await Caseentryschema.find()

//     if (Findentries.length > 0) {
//         return res.status(200).send(Findentries)
//     } else {
//         return res.status(401).send({ Message: "No Case Found" })
//     }
// }

const Getentries = async (req, res) => {
    // Check if an ID is provided in the request
    const entryId = req.params.id;

    if (entryId) {
        // Find entry by ID
        try {
            const entry = await Caseentryschema.findById(entryId);
            if (entry) {
                return res.status(200).send(entry);
            } else {
                return res.status(404).send({ Message: "Entry Not Found" });
            }
        } catch (error) {
            // Handle possible errors, like invalid MongoDB ID format
            return res.status(400).send({ Message: "Invalid ID Format" });
        }
    } else {
        // Find all entries if no ID is provided
        const Findentries = await Caseentryschema.find();
        if (Findentries.length > 0) {
            return res.status(200).send(Findentries);
        } else {
            return res.status(401).send({ Message: "No Cases Found" });
        }
    }
};


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

// Delete 
const deleteHistoryEntry = async (req, res) => {
    try {
        const { caseId, historyId } = req.params; // Assuming you pass these as URL parameters

        // Find the document and pull the history object with the specified _id
        const updatedCaseEntry = await Caseentryschema.findByIdAndUpdate(
            caseId,
            {
                $pull: {
                    history: { _id: historyId } // Using $pull to remove the history with specific _id
                }
            },
            { new: true } // Option to return the modified document
        );

        if (!updatedCaseEntry) {
            return res.status(404).send({ Message: "Case Entry not found or History ID not found" });
        }

        return res.status(200).send({ Message: "History deleted successfully", data: updatedCaseEntry });
    } catch (error) {
        console.error(error);
        return res.status(500).send({ Message: "Internal Server Error" });
    }
};





// const deleteHistoryEntry = async (req, res) => {
//     try {
//         const { id } = req.params; // ID of the case entry to be deleted

//         // Attempt to find and delete the case entry by its ID
//         const deletedCaseEntry = await Caseentryschema.findByIdAndDelete(id);

//         // If no document was found, return a 404 error
//         if (!deletedCaseEntry) {
//             return res.status(404).send({ Message: "Case Entry not found" });
//         }

//         // If the delete operation was successful, send back a success message
//         return res.status(200).send({ Message: "Case Entry deleted successfully" });

//     } catch (error) {
//         console.error(error);
//         return res.status(500).send({ Message: "Internal Server Error" });
//     }
// };



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

// Edit Factsheet
const updateFactsheetByCaseentryId = async (req, res) => {
    try {
        const { caseentryId } = req.params;
        const updateData = req.body; // Assuming all the updated data is passed in the request body

        // Find the Factsheet by Caseentry ID and update it
        // The {new: true} option ensures that the updated document is returned
        const updatedFactsheet = await Factsheet.findOneAndUpdate(
            { caseentry: caseentryId },
            updateData,
            { new: true }
        ).exec();

        if (!updatedFactsheet) {
            return res.status(404).send('No Factsheet found with the provided Caseentry ID');
        }

        res.json(updatedFactsheet);
    } catch (error) {
        res.status(500).send(error.message);
    }
};

// const updateFactsheetByCaseentryId = async (req, res) => {
//     // Assuming you're receiving the update data in the request body as JSON and using body-parser or Express built-in parser to parse JSON bodies.
//     const updateData = req.body; // Make sure to have the updated data in the body.

//     try {
//         let result = await Factsheet.updateOne(
//             { _id: req.params.id },
//             updateData,
//             { upsert: true }
//         );
//         res.send(result);
//     } catch (error) {
//         // Make sure to handle errors properly.
//         res.status(500).send(error);
//     }
// };


// const gettodayhearings = async (req, res) => {
//     try {
//       // Get the current UTC date
//       const currentDate = new Date();
//       currentDate.setUTCHours(0, 0, 0, 0); // Set time to midnight in UTC timezone

//       const isoDate = currentDate.toISOString().split('T')[0];
//       console.log('UTC Date:', isoDate);

//       // Find all case entries with nexthearing dates matching today's date
//       const todayHearings = await Caseentryschema.find({
//         nexthearing: isoDate,
//       });
//       console.log('Today Hearings:', todayHearings);

//       res.json(todayHearings);
//     } catch (err) {
//       console.error(err);
//       res.status(500).json({ error: 'An error occurred' });
//     }
//   };

const gettodayhearings = async (req, res) => {
    try {
        // Get the current UTC date
        const currentDate = new Date();
        currentDate.setUTCHours(0, 0, 0, 0); // Set time to midnight in UTC timezone

        // Extract year, month, and day components
        const year = currentDate.getUTCFullYear();
        const month = String(currentDate.getUTCMonth() + 1).padStart(2, '0'); // Months are zero-based
        const day = String(currentDate.getUTCDate()).padStart(2, '0');

        // Create the date string in "yyyy-mm-dd" format
        const dateStr = `${year}-${month}-${day}`;
        console.log('Date:', dateStr);

        // Find all case entries with nexthearing dates matching today's date
        const todayHearings = await Caseentryschema.find({
            nexthearing: dateStr,
        });
        console.log('Today Hearings:', todayHearings);

        res.json(todayHearings);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'An error occurred' });
    }
};

// one time allow user code 
// const Editallentries = async(req , res) => {
//     const { id } = req.params;
// const updateData = req.body;

// try {
//     // Check if edit is approved
//     const caseEntry = await Caseentryschema.findById(id);

//     if (!caseEntry.isEditApproved) {
//         return res.status(403).send({ message: "Edit not approved by admin" });
//     }

//     // Proceed with edit
//     const updatedEntry = await Caseentryschema.findByIdAndUpdate(id, updateData, { new: true });
//     res.status(200).send(updatedEntry);
// } catch (error) {
//     res.status(500).send({ message: "Error updating the case entry", error: error.message });
// }
// }


// this code is for one time allow and user can edit multiple times to edit
// const Editallentries = async (req, res) => {
//     const { id } = req.params;
//     const updateData = req.body;

//     try {
//         // Find the case entry
//         const caseEntry = await Caseentryschema.findById(id);

//         // Check if the edit is approved
//         if (!caseEntry.isEditApproved) {
//             return res.status(403).send({ message: "Edit not approved by admin" });
//         }

//         // If edit is approved, check the status of the edit request
//         const editRequest = await EditRequest.findOne({ caseId: id });

//         if (!editRequest) {
//             return res.status(404).send({ message: "Edit request not found" });
//         }

//         if (editRequest.status === 'approved') {
//             // If status is approved, proceed with edit
//             const updatedEntry = await Caseentryschema.findByIdAndUpdate(id, updateData, { new: true });
//             res.status(200).send(updatedEntry);
//         } else if (editRequest.status === 'rejected') {
//             // If status is rejected, show "Your request is rejected"
//             res.status(403).send({ message: "Your request is rejected" });
//         } else {
//             // If status is not approved (rejected or pending), show "You are not Authorized to edit"
//             res.status(403).send({ message: "You are not Authorized to edit" });
//         }
//     } catch (error) {
//         res.status(500).send({ message: "Error updating the case entry", error: error.message });
//     }
// }


// this code is allow only one time to allow user to edit 
const Editallentries = async (req, res) => {
    const { id } = req.params; // Case ID
    const updateData = req.body;
    const userId = req.user.id; // User ID from JWT token

    try {
        const caseEntry = await Caseentryschema.findById(id);

        // Find the user based on the ID from JWT token
        const approvedUser = await Userschema.findById(userId);

        if (!approvedUser) {
            return res.status(404).send({ message: "User not found" });
        }

        if (approvedUser.isUserApproved) {
            // Update all entries if the user is approved
            const updatedEntry = await Caseentryschema.updateMany({ _id: id }, updateData, { new: true });
            return res.status(200).send({ Message: "Successfully Updated", updatedEntry });
        }

        // Check if this specific entry is approved for editing
        if (caseEntry.isEditApproved) {
            const updatedEntry = await Caseentryschema.findByIdAndUpdate(id, updateData, { new: true });
            caseEntry.isEditApproved = false;
            await caseEntry.save();
            return res.status(200).send({ Message: "Successfully Updated", updatedEntry });
        } else {
            return res.status(403).send({ message: "Edit not approved by admin" });
        }
    } catch (error) {
        res.status(500).send({ message: "Error updating the case entry", error: error.message });
    }
}










// Request to admin for edit case Permisssion

const RequestEdit = async (req, res) => {
    const { id } = req.params; // Case ID
    const userId = req.user.id; // User ID

    try {
        // Check if there is an existing edit request for the same case and user
        const existingRequest = await EditRequest.findOne({ caseId: id, userId: userId });

        if (existingRequest) {
            return res.status(400).send({ message: "Edit request for this case already exists" });
        }

        // If no existing request, create a new edit request
        const newEditRequest = new EditRequest({
            caseId: id,
            userId: userId
        });

        await newEditRequest.save();

        // Fetch user details
        const user = await Userschema.findById(userId);

        // Fetch case details
        const caseEntry = await Caseentryschema.findById(id);

        // Check if user and case entry exist
        if (!user || !caseEntry) {
            return res.status(404).send({ message: "User or Case not found" });
        }

        // Send response with user name and case details
        res.status(200).send({
            message: "Your request is submitted",
            requestDetails: {
                userName: user.name,
                caseTitle: caseEntry.title,
                caseNature: caseEntry.nature,
                editRequest: newEditRequest
            }
        });
    } catch (error) {
        res.status(500).send({ message: "Error submitting edit request", error: error.message });
    }
}









// const Approvedrequest = async (req, res) => {
//     const { userId } = req.user.id; // Assuming you pass the user ID

//     try {
//         // Find all case entries by user and set isUserApproved to true
//         await Caseentryschema.updateMany({ userId: userId }, { $set: { isUserApproved: true } });

//         res.status(200).send({ message: "User approved for editing" });
//     } catch (error) {
//         res.status(500).send({ message: "Error approving user", error: error.message });
//     }
// }

const Approvedrequest = async (req, res) => {
    try {
        // Assuming the user ID is passed as a parameter in the URL, e.g., /users/:userId
        const userId = req.params.userId;

        // Update the isUserApproved field for the user with the given ID
        await Userschema.updateOne({ _id: userId }, { $set: { isUserApproved: req.body.isUserApproved } });

        res.status(200).send({ message: "User approval status updated" });
    } catch (error) {
        res.status(500).send({ message: "Error updating user approval status", error: error.message });
    }
}






const ListPendingEditRequests = async (req, res) => {
    try {
        const pendingRequests = await EditRequest.find({ status: 'pending' }).populate('caseId').populate('userId', 'name');
        res.status(200).send(pendingRequests);
    } catch (error) {
        res.status(500).send({ message: "Error retrieving pending requests", error: error.message });
    }
}


// const UpdateRequestStatus = async (req, res) => {
//     const { id } = req.params; // This is the Case ID
//     const { status } = req.body; // Status to be updated: 'approved' or 'rejected'

//     if (!['approved', 'rejected'].includes(status)) {
//         return res.status(400).send({ message: "Invalid status update" });
//     }

//     try {
//         // Find the edit request by case ID and status 'pending'
//         const editRequest = await EditRequest.findOne({ caseId: id, status: 'pending' });



//         if (!editRequest) {
//             return res.status(404).send({ message: "No pending edit request found for this case" });
//         }



//         // Update the status to either 'approved' or 'rejected'
//         editRequest.status = status;
//         await editRequest.save();



//         res.status(200).send({ message: `Edit request for the case ${status}`, editRequest });
//     } catch (error) {
//         res.status(500).send({ message: `Error updating edit request status`, error: error.message });
//     }
// };


// const UpdateRequestStatus = async (req, res) => {
//     const { id } = req.params; // This is the Case ID
//     const { status } = req.body; // Status to be updated: 'approved' or 'rejected'

//     if (!['approved', 'rejected'].includes(status)) {
//         return res.status(400).send({ message: "Invalid status update" });
//     }

//     try {
//         // Find the edit request by case ID and status 'pending'
//         const editRequest = await EditRequest.findOne({ caseId: id, status: 'pending' });

//         if (!editRequest) {
//             return res.status(404).send({ message: "No pending edit request found for this case" });
//         }

//         // Update the status to either 'approved' or 'rejected'
//         editRequest.status = status;
//         await editRequest.save();

//         // if (status === 'rejected') {
//         //     // If the status is 'rejected', remove the document from the collection
//         //     await EditRequest.deleteOne({ _id: editRequest._id });
//         // }

//         res.status(200).send({ message: `Edit request for the case ${status}`, editRequest });
//     } catch (error) {
//         res.status(500).send({ message: `Error updating edit request status`, error: error.message });
//     }
// };

const UpdateRequestStatus = async (req, res) => {
    const { id } = req.params; // This is the Case ID
    const { status } = req.body; // Status to be updated: 'approved' or 'rejected'

    if (!['approved', 'rejected'].includes(status)) {
        return res.status(400).send({ message: "Invalid status update" });
    }

    try {
        // Find the edit request by case ID and status 'pending'
        const editRequest = await EditRequest.findOne({ caseId: id, status: 'pending' });

        if (!editRequest) {
            return res.status(404).send({ message: "No pending edit request found for this case" });
        }

        // Update the status of the edit request
        editRequest.status = status;
        await editRequest.save();

        // Find the case entry
        const caseEntry = await Caseentryschema.findById(id);

        if (!caseEntry) {
            return res.status(404).send({ message: "Case not found" });
        }

        // Update isEditApproved based on the status
        if (status === 'approved') {
            caseEntry.isEditApproved = true;
        } else {
            caseEntry.isEditApproved = false;
        }


        await caseEntry.save();
        if (status === 'rejected' || "'approved") {
            // If the status is 'rejected', remove the document from the collection
            await EditRequest.deleteOne({ _id: editRequest._id });
        }

        editRequest

        res.status(200).send({ message: `Edit request for the case has been ${status}`, editRequest, caseEntry });
    } catch (error) {
        res.status(500).send({ message: `Error updating edit request status`, error: error.message });
    }
};











module.exports = { Caseentries, Getentries, UpdateRequestStatus, RequestEdit, ListPendingEditRequests, Approvedrequest, Editallentries, gettodayhearings, updateFactsheetByCaseentryId, deleteCaseEntry, updateschema, Gethistory, deleteHistoryEntry, Getentriesonthebaseofid, GetTodayEntries, Factsheetcontroller, getFactsheetByCaseentryId }

