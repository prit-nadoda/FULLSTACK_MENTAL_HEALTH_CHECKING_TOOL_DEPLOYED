const fs = require('fs');
const path = require('path'); // Import the path module to work with file paths

// Import your Mongoose models
const optionModel = require("./options");
const questionModel = require("./questions");
const conditionModel = require("./conditions");
const expertModel = require("./experts");

async function seedDataFromJSON() {
    try {
        // Check document counts for existing data
        const optionCount = await optionModel.countDocuments();
        const expertCount = await expertModel.countDocuments();
        const questionCount = await questionModel.countDocuments();
        const conditionCount = await conditionModel.countDocuments();

        // Read JSON files from the parent directory
        const optionData = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../psyOps.json'), 'utf8'));
        const expertData = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../psyExps.json'), 'utf8'));
        const conditionData = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../psyCons.json'), 'utf8'));
        const questionData = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../psyQs.json'), 'utf8'));

        // Insert data into respective collections if they are empty
        if (optionCount === 0) {
            await optionModel.insertMany(optionData);
            console.log('Option seeding completed');
        }
        if (expertCount === 0) {
            await expertModel.insertMany(expertData);
            console.log('Experts seeding completed');
        }
        if (conditionCount === 0) {
            await conditionModel.insertMany(conditionData);
            console.log('Conditions seeding completed');
        }
        if (questionCount === 0) {
            await questionModel.insertMany(questionData);
            console.log('Questions seeding completed');
        }
    } catch (err) {
        console.error('Error seeding data:', err);
    }
}

// Export the function for external usage
module.exports = seedDataFromJSON;
