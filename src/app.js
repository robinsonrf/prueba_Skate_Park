const express = require('express');
const app = express();
const exphbs = require('express-handlebars');
const expressFileUpload = require('express-fileupload');
const bodyParser = require('body-parser');
const path = require('path');
const jwt = require('jsonwebtoken');
const {nuevoSkater, getSkaters, revisionSkater} = require("./db/querys")
const secretKey = 'Shhhh';
const port = 3000;

app.listen(port, ()=> console.log(`SERVER ON, PUERTO: ${port}`));

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(express.static(__dirname + "/public"));

app.use(
    expressFileUpload({
        limits: 5000000,
        abortOnLimit: true,
        responseOnLimit: "El tamaño de la imagen supera el limite permitido",
    })
);

//Config Handlebars
app.set("view engine", "handlebars");
app.set('views',path.join(__dirname, "views", "layouts"));

//Middleware CSS BOOTSTRAP 
app.use("/css", express.static(path.join(__dirname, "..", "/node_modules/bootstrap/dist/css")));

//Ruta Middleware BUNDLE JS BOOTSTRAP 
app.use('/js', express.static(path.join(__dirname,"..","/node_modules/bootstrap/dist/js")));

//Middleware jQuery 
app.use('/dist', express.static(path.join(__dirname, "..","/node_modules/jquery/dist")));

//Middleware Folder Assets
app.use('/assets', express.static(path.join(__dirname,"/assets")));

app.engine(
    "handlebars",
    exphbs.engine({
        defaultLayout: "main",
        layoutsDir: app.get('views'),
        partialsDir: path.join(__dirname, "views", "components"),
        helpers: {
            inc: (value, options)=>{
                return parseInt(value)+1;
            }
        }
    })
);

//Ruta Principal
app.get('/', async (req,res)=> {
    const skaters = await getSkaters()
    res.render('main',{
        layout:'main',
        skaters: skaters 
    });
});

app.get('/holis', async (req, res) => {
    console.log("entramos en index")
    try {
        const skaters = await getSkaters();
        res.render('index', { skaters });
    } catch (e) {
        res.statusCode = 500;
        res.end("ocurrio un error en el servidor" + e);
    }
})

app.get("/datos", function (req, res) {
    res.render("Datos",{
        layout: "Datos", 
    });
});

app.get("/registro", function (req, res) {
    res.render("Registro",{
        layout: "Registro",
    });
});

app.get("/login", function (req, res) {
    res.render("Login",{
        layout: "Login",
    });
});

app.get('/Admin', async (req, res) => {
    try {
       const skaters = await getSkaters();
       console.log(skaters)
        res.render('Admin',{
            layout: "Admin",
            skaters: skaters
        });
    } catch (e) {
        res.statusCode = 500;
        res.end("ocurrio un error en el servidor" + e);
    }
})

app.post("/skaters", async(req,res)=>{
    const {foto} = req.files;
    const {name} = foto;
    const { email, nombre, password, confirmPass, aniosExp, especialidad} = req.body;
    if (password == confirmPass){
        try{
            await nuevoSkater(email, nombre, password, aniosExp, especialidad, name);
            foto.mv(`${__dirname}/public/assets/img/${name}`, (err)=> {
                 if (err) console.log("Error al cargar la imagen")
                });
            res.send(`<script>alert('El registro ha sido exitoso. Bienvenido, ${nombre}');window.location.href ='/';</script>`)
        }catch(e){
        console.log(`Error: ${e}`)
        }
    }else{
        res.send("<script>alert('Las contraseñas no coinciden');window.location.href = '/registro';</script>");
    }
});

app.get("/skater", async (req,res)=>{
    const respuesta = await getSkaters();
    res.statusCode = 201;
    res.send(JSON.stringify(respuesta));
});

app.put("/skaters", async (req,res) =>{
    const {id, estado} =req.body;
    try{
        const result = await revisionSkater(id, estado);
        res.status(200).send(result);
    }catch(e){
        res.status(500).send({
            error: `Error, algo salio mal... ${e}`,
            code: 500,
        })
    }
})



//ROUTES
//app.use(require('../routes/index'));







