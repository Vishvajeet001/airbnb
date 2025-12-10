import mongoose from "mongoose";

const homeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  rating: {
    type: Number,
    required: true,
  },
  photo: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: false,
  },
});

export default mongoose.model("Home", homeSchema);

// import fs from "fs";

// export default class Home {
//     constructor(name, price, location, rating, photo) {
//         this.name = name;
//         this.price = price;
//         this.location = location;
//         this.rating = rating;
//         this.photo = photo;
//     }

//     static getAll(workAfterReadingFile) {
//         fs.readFile("./data/data.json", (err, data) => {
//             workAfterReadingFile(!err ? JSON.parse(data) : []);
//         });
//     }

//     static findById(homeId,callback) {
//         this.getAll((homes)=>{
//             const homeFound = homes.find(home=>home.id === homeId);
//             callback(homeFound);
//         });
//     }

//     static remove(homeId) {
//         Home.getAll((homes) => {
//             const updated = homes.filter(home => home.id !== homeId);
//             fs.writeFile("./data/data.json", JSON.stringify(updated), (err) => {
//                 console.log(err);
//             });
//         });
//     }

//     save() {
//         this.id = Date.now();
//         Home.getAll((homes) => {
//             homes.push(this);
//             fs.writeFile("./data/data.json", JSON.stringify(homes), (err) => {
//                 console.log(err);
//             });
//         });
//     }

//     edit() {
//         Home.getAll((homes) => {
//             const updated = homes.map(home => home.id !== this.id ? home : this);
//             console.log(updated);
//             fs.writeFile("./data/data.json", JSON.stringify(updated), (err) => {
//                 console.log(err);
//             });
//         });
//     }
// }
