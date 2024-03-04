import mongoose from "mongoose";

// ========================== initData ========================== //
export default async function seedDb() {
  const userCount = await mongoose.models.User.countDocuments();
  const eventsCount = await mongoose.models.Events.countDocuments();
  if (userCount === 0 || eventsCount === 0) {
    console.log("Seeding database...");
    insertData();
  }
}

async function insertData() {
  const User = mongoose.models.User;
  const Events = mongoose.models.Events;

  console.log("Dropping collections...");
  await User.collection.drop();
  await Events.collection.drop();

  console.log("Inserting data...");
  
  
  // Insert users
  const user1 = await User.create({
    username: 'Anna Finsrud',
    email: 'anna@kolle.com',
    password: 'test123'
  });

  const user2 = await User.create({
    username: 'Freja Lund Rasmussen',
    email: 'freja@kolle.com',
    password: 'test123'
  });

  const user3 = await User.create({
    username: 'Mette-Marie Bech Sørensen',
    email: 'MM@kolle.com',
    password: 'test123'
  });

  // Opret et event
  await Events.insertMany([
    {
      titel: 'Børnefødselsdag',
      description: 'Min 28-års fødselsdag fest',
      time: '18:00',
      date: new Date('2024-03-16'),
      place: 'Min adresse',
      userID: user3._id, // Brug ID'et fra en eksisterende bruger
      attendees: [user1._id, user2._id, user3._id] // Tilføj ID'er for deltagere
    },
    {
      titel: 'Sorring-tur',
      description: 'Vi skal nusse lam',
      time: '10:00',
      date: new Date('2024-04-27'),
      place: 'Sorring',
      userID: user1._id, // Brug ID'et fra en eksisterende bruger
      attendees: [user1._id, user2._id, user3._id] // Tilføj ID'er for deltagere
    }
  ]);
}
