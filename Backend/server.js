import express from 'express';
import http from 'http';
import {Server} from 'socket.io';
import {YSocketIO} from 'y-socket.io/dist/server';


const app = express();
const server = http.createServer(app);


app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(express.static("public"));

const io = new Server(server,{
    cors:{
        origin:'*',
        methods : ['GET','POST']
    }
});

const ySocketIO = new YSocketIO(io);
ySocketIO.initialize();

app.get('/',(req,res)=>{
    res.status(200).json({
        message:"hello World",
        success : true
    })
});

app.get('/health',(req,res)=>{
    res.status(200).json({
        message : "ok",
        success : true
    })
})

server.listen(3000,()=>{
    console.log("Server is running on Port 3000");
})