import mongoose from "mongoose";
import Standard from "../models/Standard"; // adjust path

async function seed() {
  await mongoose.connect('mongodb://127.0.0.1:27017/yourDBName');

  const existing = await Standard.findOne({ code: "MA.912.DP.1.3" });
  if (!existing) {
    await Standard.create({
      code: "MA.912.DP.1.3",
      description: "Understand the basics of data analysis: probability, correlation, and causation",
      subject: "Math",
      gradeLevel: 12,
    });
    console.log("Created Standard MA.912.DP.1.3");
  } else {
    console.log("Standard already exists");
  }

  await mongoose.disconnect();
}

seed();