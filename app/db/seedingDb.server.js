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
    username: 'Janis Joplin',
    email: 'janis@mail.com',
    password: 'test123'
  });

  const user2 = await User.create({
    username: 'Jim Morrison',
    email: 'jim@mail.com',
    password: 'test123'
  });

  const user3 = await User.create({
    username: 'Jimi Hendrix,',
    email: 'jimi@mail.com',
    password: 'test123'
  });

  // Opret et event
  await Events.insertMany([
    {
      titel: 'The Annual VW Vintage Meetup',
      description: 'Join us for our annual gathering of classic VW cars! Whether you own a vintage Beetle, an iconic VW T2, or a rare Karmann Ghia, this is the place to be. We´ll have plenty of beautiful vehicles to admire, as well as the opportunity to meet other enthusiasts and share stories about our beloved VWs.',
      time: '10:00',
      date: new Date('2024-03-16'),
      place: 'Siimtoften 3, 8680 Ry',
      userID: user3._id, // Brug ID'et fra en eksisterende bruger
      attendees: [user1._id, user2._id, user3._id] // Tilføj ID'er for deltagere
    },
    {
      titel: 'Classic Cars Cruise and Dinner',
      description: 'Join us for a scenic drive in our classic cars followed by a delicious dinner! Experience the thrill of cruising through picturesque landscapes in your vintage vehicle, followed by a relaxing evening of good food and great company.',
      time: '10:00',
      date: new Date('2024-04-27'),
      place: 'Bysmedevej 61, 8381 Tilst',
      userID: user1._id, // Brug ID'et fra en eksisterende bruger
      attendees: [user1._id, user2._id, user3._id] // Tilføj ID'er for deltagere
    }
  ]);
}
