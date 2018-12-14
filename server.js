const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server)
let tempInputArr = [];
let allTempInput = [];
let maxInputArr = [];
let timer = null;
//serve static pages
app.use('/', express.static(__dirname + '/'));

//render index.html
app.get('/', (req, res) => {
    res.render("index")
})

//creates a js object of value counts
const createMap = (arr) =>{
    let maxMap = {};
    if(arr.length === 0){
        return;
    }

    arr.forEach(userInput => {
        if(maxMap.hasOwnProperty(userInput)){
              maxMap[userInput] += 1;
        }else{
          maxMap[userInput] = 1;
        }
    });
    return maxMap;
  }

//returns the value with the highest occurrence count
  const maxOccurrence = (arr)=>{
      let maxObj = createMap(arr);
      let valuesArr = Object.values(maxObj).sort((a, b) => a-b);
      let maxCount = valuesArr[valuesArr.length - 1];

    
      for(let k in maxObj){
          if(maxObj[k] === maxCount){
            return k;
          }
          
      }
  }



//initialize socket.io
io.on('connection', (socket)=> {

    //add max values every 5 seconds
    timer = setInterval(() => {
        if(tempInputArr.length > 0){
            maxInputArr.push(maxOccurrence(tempInputArr));
            tempInputArr = [];
        }        
    },5000)
    
    //monitor user input
    socket.on('userInput', (data) => {
        tempInputArr.push(data.key);
        allTempInput.push(data.key);
    });
    //return last ten highest
    socket.on('getMaxValues', (data) => {
        let lastTen = maxInputArr.length < 10 ? maxInputArr: maxInputArr.slice(maxInputArr.length - 10)
        socket.emit('displayMaxValues', lastTen.length > 0 ? lastTen:"There are no values to display");
        
    });
    //reset all on disconnect
    socket.on('disconnect', () => {
        console.log('disconnecting.....')
        clearInterval(timer);
        maxInputArr = [];
        allTempInput = []
    });
  });
server.listen(3000, ()=>console.log(`listening on port 3000`));