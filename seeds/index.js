
if(process.env.NODE_ENV !== "production"){
    require('dotenv').config();
   }
   
  // require('dotenv').config();
const mongoose= require('mongoose');
const cities = require('./cities');
const {places,descriptors} =require('./seedHelpers');
const Campground= require('../models/campground');
const dbUrl = process.env.DB_URL;
//'mongodb://localhost:27017/yelp-camp'

 mongoose.connect(dbUrl,{
        useNewUrlParser : true,
        //useCreateIndex : true,
        useUnifiedTopology : true
    });

const db=async()=>{
    await mongoose.connection;
db.on("error", console.error.bind(console,"connection error:"));
db.once("open",() =>{
    console.log("Database Connected");
})};

const seedDB = async()=>{
    await Campground.deleteMany({});
    // const c=new Campground({title: 'purple field'});
    // await c.save();

    const sample = array=> array[Math.floor(Math.random()*array.length)];

    for(let i=0;i<50;i++){
        const random1000 = Math.floor(Math.random()*1000);
        const price = Math.floor(Math.random()*20)+10;
        const camp =new Campground({
            author:'659109d31122a0a07ff79bc1',
            location:`${cities[random1000].city},${cities[random1000].state}`,
           title:`${sample(descriptors)} ${sample(places)}`,
           image:'https://source.unsplash.com/collection/483251',
           description:'lorem ipsum',
           price
        })
        await camp.save();
    }

}

seedDB().then(()=>{

    //mongoose.connection.close()
    //console.log("Connection is Closed")
});

 