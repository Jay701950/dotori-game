const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")

const app = express()

app.use(cors())
app.use(express.json())

mongoose.connect("mongodb://127.0.0.1:27017/dotori_game")

const ProfileSchema = new mongoose.Schema({

  nick: {type:String, unique:true},

  acorn:Number,
  clickValue:Number,
  tier:Number,

  squirrelRemainingMs:[Number],

  goldenReady:Boolean,
  goldenRemainingMs:Number,

  updatedAt:Number

})

const Profile = mongoose.model("Profile",ProfileSchema)


// 닉네임 존재 확인
app.get("/profile/:nick", async (req,res)=>{

  const nick = req.params.nick

  const p = await Profile.findOne({nick})

  if(!p){
    return res.json(null)
  }

  res.json(p)

})


// 저장
app.post("/save", async (req,res)=>{

  const data = req.body

  await Profile.findOneAndUpdate(
    {nick:data.nick},
    data,
    {upsert:true}
  )

  res.json({ok:true})

})


// 새 프로필 생성
app.post("/create", async (req,res)=>{

  const nick = req.body.nick

  const exists = await Profile.findOne({nick})

  if(exists){
    return res.json({ok:false})
  }

  const p = new Profile({

    nick,

    acorn:0,
    clickValue:1,
    tier:0,

    squirrelRemainingMs:[],

    goldenReady:false,
    goldenRemainingMs:0,

    updatedAt:Date.now()

  })

  await p.save()

  res.json({ok:true})

})

app.listen(3000,()=>{
  console.log("server running on 3000")
})
