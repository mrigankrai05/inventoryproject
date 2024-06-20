const express = require('express'); 
const app = express();
let port =8080;
const path = require('path');
const methods = require('method-override');
app.use(methods('_method'));
app.set('view engine','ejs');
app.set("views",path.join(__dirname,'views'));
app.use(express.static(path.join(__dirname,'public')));
const {v4:uuidv4}=require('uuid');

app.use(express.urlencoded({extended:true}));
let posts=[
    {
        id:uuidv4(),
        username:"apna college",
        content:"learning"
    },
    {
        id:uuidv4(),
        username:"college",
        content:"learning in college"
    },
    {
        id:uuidv4(),
        username:" school ",
        content:" learning in school "
    }
];
app.listen(port,()=>{
    console.log('server is running on port'+ port); 
});



app.get("/posts",(req,res)=>{
    res.render("index.ejs",{posts});
});


app.get("/posts/create",(req,res)=>{
    res.render("create.ejs");
});
app.post("/posts",(req,res)=>{
    let username=req.body.username;
    let content=req.body.content;
    let post={
        id:uuidv4(),
        username,
        content
    };
    posts.push(post);
    res.redirect("/posts");
});

app.get("/posts/:id/view",(req,res)=>{
    let {id}=req.params;
    let post=posts.find((p)=>id === p.id);
    res.render("ok.ejs",{post});
});

app.delete("/posts/:id", (req, res) => {
    let { id }=req.params;
    posts = posts.filter((p)=>id!==p.id);
    res.redirect("/posts");
});

app.patch("/posts/:id", (req, res) => {
    let { id }=req.params;
    let post=posts.find((p)=>id === p.id);
    console.log(req.body);
    post.content=req.body.content;
    res.redirect("/posts");
});
app.get("/posts/:id", (req, res) => {
    let { id }=req.params;
    let post=posts.find((p)=>id === p.id);
    res.render("edit.ejs",{post});
});