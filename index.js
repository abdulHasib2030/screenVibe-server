 const express = require('express');
 const cors = require('cors');

const app = express()
app.use(express.json())
app.use(cors())
const port = process.env.PORT || 5000;

app.get('/', (req, res)=>{

    res.send("This is Running SceenVide")
})

app.listen(port, ()=>{
    console.log("Coffee server running");
})



