require('dotenv').config({ path: '.env.local' });
const mongoose = require('mongoose');

async function patch() {
  await mongoose.connect(process.env.MONGODB_URI);
  const organizationSchema = new mongoose.Schema({}, { strict: false });
  const Organization = mongoose.models.Organization || mongoose.model('Organization', organizationSchema);

  await Organization.updateMany(
    { location: "Jayanagar" },
    { $set: { location: "Jayanagar, Bangalore" } }
  );
  await Organization.updateMany(
    { location: "JP Nagar" },
    { $set: { location: "JP Nagar, Bangalore" } }
  );
  await Organization.updateMany(
    { location: "BTM Layout" },
    { $set: { location: "BTM Layout, Bangalore" } }
  );
  
  console.log("Patched locations to include Bangalore");
  mongoose.disconnect();
}
patch();
