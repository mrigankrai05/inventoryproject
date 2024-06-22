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
const mysql = require('mysql2');
app.use(express.urlencoded({extended:true}));
const connection=mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'chiragrai',
    database:'data',
});

app.get("/",(req,res)=>{
    res.render("loginpage.ejs")
})
app.post("/posts/success",(req,res)=>{
    let username=req.body.username;
    let password=req.body.password;
    connection.query(`SELECT * FROM thoughts WHERE username='${username}' AND id='${password}'`,(err,data)=>{
        console.log(data);
        if(data.length==0){
            res.send("Invalid username or password");
        }
        else{
            res.redirect("/posts");
        }
    })
});

app.listen(port,()=>{
    console.log('server is running on port'+ port); 
});

app.get("/posts",(req,res)=>{
    connection.query(`SELECT * FROM thoughts`,(err,posts)=>{
        res.render("index.ejs",{posts});
    })
});

app.get("/posts/create",(req,res)=>{
    res.render("create.ejs");
});

app.post("/posts",(req,res)=>{
    let username=req.body.username;
    let content=req.body.content;
    let id=uuidv4()
    let post=[ id,username,content];
    connection.query(`INSERT INTO thoughts VALUES (?,?,?)`,post,(err,result)=>{
        res.redirect("/posts");
    });
});

app.get("/posts/:id/view",(req,res)=>{
    let {id}=req.params;
});

app.delete("/posts/:id", (req, res) => {
    let { id }=req.params;
    connection.query(`DELETE FROM thoughts where id="${id}"`,(err,result)=>{
        res.redirect("/posts");
    });
});

app.patch("/posts/:id", (req, res) => {
    let { id }=req.params;
    let a=req.body.content;
    connection.query(`UPDATE thoughts SET content="${a}" WHERE id="${id}"`,(err,result)=>{
        res.redirect("/posts");
    });
});
app.get("/posts/:id", (req, res) => {
    let { id }=req.params;
    connection.query(`SELECT * FROM thoughts where id="${id}"`,(err,result)=>{
        let post=result[0];
        res.render("edit.ejs",{post});
    });
});
