// scripts/seedStandards.js
const mongoose = require("mongoose");
const Standard = require("../models/Standard"); // JS version

async function seedStandards() {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/standardflow"); // change DB name if needed

    const standardsToSeed = [
      {
        code: "MA.912.DP.1.3",
        description: "Understand the basics of data analysis: probability, correlation, and causation",
        subject: "Math",
        gradeLevel: 12,
      },
      // Add more standards here if you want
    ];

    for (const std of standardsToSeed) {
      const exists = await Standard.findOne({ code: std.code });
      if (!exists) {
        await Standard.create(std);
        console.log(`Created Standard ${std.code}`);
      } else {
        console.log(`Standard ${std.code} already exists`);
      }
    }

    console.log("Seeding complete!");
  } catch (err) {
    console.error("Error seeding standards:", err);
  } finally {
    await mongoose.disconnect();
  }
}

seedStandards();