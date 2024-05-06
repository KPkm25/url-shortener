const express=require('express');
const dotenv=require('dotenv');
const cors=require('cors');
const mongoose=require('mongoose');
const shortid=require('shortid');
const Url=require('./Url');
const utils=require('./util/util');

dotenv.config();
const app=express();

app.use(cors({
    origin:["https://url-shortener-seven-dun.vercel.app"],
    methods:["POST","GET"],
    credentials:true
  }));app.use(express.json());

//database connection
mongoose
.connect(process.env.MONGO_URI,{
    useNewUrlParser:true,
    useUnifiedTopology:true,
})
.then(()=>{
    console.log("Database connected");
})
.catch((e)=>{
    console.log(e.message);
});

app.get("/",async (req,res)=>{
    res.send("hello");
})

//URL shortener endpoint
app.get("/all", async (req, res, next) => {
    try {
        const data = await Url.find().exec();
        res.json(data);
    } catch (error) {
        console.error("Error fetching URLs:", error);
        res.status(500).json({ error: "Error fetching URLs" });
    }
});


app.post("/short",async (req,res)=>{
    console.log("HERE",req.body.ogUrl);
    const {ogUrl}=req.body;
    const base=`http://localhost:3333`;

    const urlId=shortid.generate();
    if(utils.validateUrl(ogUrl)){
        try{
            let url=await Url.findOne({ogUrl}).exec();
            if(url){
                res.json(url);
            }else{
                const shortURL=`${base}/${urlId}`;

                url=new Url({
                    ogUrl,
                    shortURL,
                    urlId,
                    date:new Date(),
                });

                await url.save();
                res.json(url);
            }
        }catch(err){
         console.log(err);
         res.status(500).json("Server error");       
        }
    }else{
        res.status(400).json("Invalid Original URL");
    }
});

app.get("/:urlId",async (req,res)=>{
    try{
        const url=await Url.findOne({urlId:req.params.urlId}).exec();
        console.log(url);
        if(url){
            url.clicks++;
            url.save();
            console.log("url saved:",url);
            return res.redirect(url.ogUrl);
        }else res.status(404).json("Not Found");
    }catch(e){
        console.log(e);
        res.status(500).json("Server Error");
    }
});






const PORT=3333;

app.listen(PORT,()=>{
    console.log(`Server is running on port:${PORT}`);
    console.log('mongo id is:',process.env.MONGO_URI);
})