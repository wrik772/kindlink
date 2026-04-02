require('dotenv').config({ path: '.env.local' });
const mongoose = require('mongoose');

async function dedupe() {
  await mongoose.connect(process.env.MONGODB_URI);
  const organizationSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true }
  }, { strict: false });
  const Organization = mongoose.models.Organization || mongoose.model('Organization', organizationSchema);

  // Find all organizations
  const orgs = await Organization.find({});
  const seen = new Set();
  let duplicateCount = 0;

  for (const org of orgs) {
    if (seen.has(org.name)) {
      await Organization.findByIdAndDelete(org._id);
      duplicateCount++;
    } else {
      seen.add(org.name);
    }
  }

  console.log(`Deleted ${duplicateCount} duplicate organizations.`);
  mongoose.disconnect();
}
dedupe();
