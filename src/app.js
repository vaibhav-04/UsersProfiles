const express = require("express");
const path=require("path");
const app=express();
const hbs=require("hbs");

require("./db/conn");
const Register=require("./models/registers");

const port=process.env.PORT||3000;

const static_path=path.join(__dirname,"../public")
const template_path=path.join(__dirname,"../templates/views");
const partials_path=path.join(__dirname,"../templates/partials");

app.use(express.json());
app.use(express.urlencoded({extended:false}));

app.use(express.static(static_path));
app.set("view engine","hbs");
app.set("views",template_path);
hbs.registerPartials(partials_path);

app.get("/",(req,res)=>{
    res.render("index")
});
app.get("/login",(req,res)=>{
    res.render("login")
});

app.get("/register",(req,res)=>{
    res.render("register")
});

app.get("/users",(req,res)=>{
    res.render("users")
});

app.get("/edit",(req,res)=>{
    res.render("edit")
});

app.post("/register",async(req,res)=>{
    try{
       const password=req.body.password;
       const confirmpassword=req.body.confirmpassword;
       
       if(password===confirmpassword){
           const registerUser = new Register({
               username: req.body.username,
               email: req.body.email,
               password: req.body.password,
               confirmpassword: req.body.confirmpassword,
               address: req.body.address
           })

           const registered=await registerUser.save();
           res.status(201).render("index");
       }else{
           res.send("password is not matching");
       }

    }catch(error){
        res.status(400).send(error);
    }
});

app.post("/login",async(req,res)=>{
     try{
        const email=req.body.email;
        const password=req.body.password;

        const useremail=await Register.findOne({email:email});
        
          if(useremail.password===password){
               res.status(201).render("index");
          }else{
              res.send("invalid login details");
          }
     }catch(error){
         res.status(400).send("invalid login details");
     }
})

app.get("/",async(req,res)=>{
    const users=await Register.find({})
    res.render('users',{users})
})

app.get("/:id",async(req,res)=>{
    const{id}=req.params;
    const user=await Register.findById(id)
    res.render('show',{user})
})
 
app.get("/:id/edit",async(req,res)=>{
    const{id}=req.params;
    const user=await Register.findById(id)
    res.render('edit',{user})
})
 
app.delete('/:id',async(req,res)=>{
    const {id}=req.params;
    const deleteduser= await Register.findByIdAndDelete(id);
    res.redirect("/")
})


app.listen(port,()=>{
    console.log(`server is running at port no ${port}`);
})