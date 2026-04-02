import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Organization from "@/models/Organization";

export async function GET() {
  await connectToDatabase();
  const orgs = [
    {
       name: "Parikrma Humanity Foundation",
       location: "Jayanagar",
       description: "Education for underprivileged children. Free schooling, life-skills training, community support. Donate: Books, school supplies, money, volunteering time.",
       type: "Education",
       contactEmail: "contact@parikrmafoundation.org"
    },
    {
       name: "eVidyaloka",
       location: "Jayanagar",
       description: "Education for rural children through digital classrooms. Teaching, digital education programs. Donate: volunteer as online teacher or education volunteer.",
       type: "Education",
       contactEmail: "contact@evidyaloka.org"
    },
    {
       name: "Vatsalyapuram Trust NGO",
       location: "Jayanagar",
       description: "Orphanage and child welfare. Shelter, food, and education for children. Donate: food, clothes, toys, books, and sponsor meals.",
       type: "Hunger",
       contactEmail: "contact@vatsalyapuram.org"
    },
    {
       name: "Helping Heroes India Foundation",
       location: "Jayanagar",
       description: "Social service & community support. Helping underprivileged families, social campaigns. Donate: food distribution and charity drives.",
       type: "Hunger",
       contactEmail: "info@helpingheroes.org"
    },
    {
       name: "Anahata United Efforts Foundation",
       location: "Jayanagar",
       description: "Community development and social welfare. Social projects, youth volunteering, charity work.",
       type: "Education",
       contactEmail: "contact@anahata.org"
    },
    {
       name: "Aahwahan Foundation",
       location: "Jayanagar",
       description: "Women empowerment, education, environment, health. Community service, volunteering programs.",
       type: "Women Empowerment",
       contactEmail: "contact@aahwahan.org"
    },
    {
       name: "Vara Foundation",
       location: "JP Nagar",
       description: "Education and welfare for underprivileged children. School support programs and social development. Donate: Books, clothes, money.",
       type: "Education",
       contactEmail: "contact@varafoundation.org"
    },
    {
       name: "Sana Khaderia Education Charitable Trust",
       location: "JP Nagar",
       description: "Education for economically weaker students. School supplies, books, funds.",
       type: "Education",
       contactEmail: "contact@sanakhaderia.org"
    },
    {
       name: "Snehasadan Boys Home",
       location: "JP Nagar",
       description: "Shelter, education, and rehabilitation for street children. Food, groceries, clothes, books, educational materials, toys, sponsorship for child education, money donations.",
       type: "Education",
       contactEmail: "contact@snehasadan.org"
    },
    {
       name: "Jana Seva Samruddi Education and Rural Development Society",
       location: "JP Nagar",
       description: "Education programs for poor children, rural development projects, awareness programs, community training workshops. Donate: Books, stationery, clothes, food grains, money for education programs.",
       type: "Education",
       contactEmail: "contact@janaseva.org"
    },
    {
       name: "Zav Foundation",
       location: "JP Nagar",
       description: "Education, child welfare, social awareness. Education support programs, volunteering activities, awareness campaigns, community development programs. Donate: Books, stationery, clothes, toys, food donations, money donations.",
       type: "Education",
       contactEmail: "contact@zavfoundation.org"
    },
    {
       name: "Dhwani Foundation",
       location: "JP Nagar",
       description: "Rural entrepreneurship, social impact programs. Training programs for NGOs and rural entrepreneurs, leadership development, capacity-building workshops, community development initiatives. Donate: Money donations, volunteering time, training materials, educational resources.",
       type: "Education",
       contactEmail: "contact@dhwanifoundation.org"
    },
    {
       name: "Indian Roots Foundation",
       location: "JP Nagar",
       description: "Education support and social development projects. Education support for underprivileged children, skill-development programs, community outreach activities. Donate: Books, school supplies, clothes, food donations, money donations.",
       type: "Education",
       contactEmail: "contact@indianroots.org"
    },
    {
       name: "Child Support Foundation",
       location: "JP Nagar",
       description: "Helping underprivileged children through education and donations. Sponsoring children’s education, scholarship programs, distribution of school supplies, health and welfare programs. Donate: Books, stationery, clothes, food, toys, educational sponsorships, money donations.",
       type: "Education",
       contactEmail: "contact@childsupport.org"
    },
    {
       name: "Premaanjali Foundation",
       location: "JP Nagar",
       description: "Social welfare and charity activities. Charity drives, support for poor families, education assistance programs, community development activities. Donate: Clothes, food, blankets, books, money donations.",
       type: "Hunger",
       contactEmail: "contact@premaanjali.org"
    },
    {
       name: "Anant Army",
       location: "JP Nagar",
       description: "Environment projects, community volunteering. Tree plantation drives, environmental awareness campaigns, community volunteering programs. Donate: Plants for drives, volunteering time, money donations.",
       type: "Environment",
       contactEmail: "contact@anantarmy.org"
    },
    {
       name: "Sri Kalajyothi Charitable Trust",
       location: "BTM Layout",
       description: "Education support, charity drives, support for underprivileged families, community service activities. Donate: Clothes, books, food, stationery, money donations.",
       type: "Education",
       contactEmail: "contact@kalajyothi.org"
    }
  ];

  await Organization.insertMany(orgs);
  return NextResponse.json({ message: "Seeded", count: orgs.length });
}
