const express = require('express')
const mongoose = require('mongoose')
const methodOverride = require('method-override')
const Fruit = require('./models/fruits')


// create express app
const app = express()

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({extended: false}))

// use method-override too add put and delete routes
app.use(methodOverride('_method'))

// parse requestsof content-type - applicaton/json
app.use(express.json())

/* will tell nodejs to look in a folder
   called views for all ejs files */
app.set('view engine', 'ejs') 

// connecting to the database
mongoose.connect('mongodb://localhost/', {useNewUrlParser: true, useUnifiedTopology: true})
.then(() => console.log('Mongodb is running '), (err) => console.log(err))

// define a simple route 
app.get('/', (req, res) => {
    Fruit.find({}, (error, allFruits) => {
        res.render('index', {fruits: allFruits})
    })
})

app.get('/create', (req, res) => {
        res.render('create')
})

app.post('/create', (req, res) => {
    // if checked, req.body.readyToEat is set to 'on'
    if(req.body.readyToEat === 'on'){
        req.body.readyToEat = true
    }
    // if not checked, req.body.readyToEat is undefined
    else {
        req.body.readyToEat = false
    }
    Fruit.create(req.body, (err) => {
        if(err){
            res.send(err)
        }else{
            res.redirect('/')
        }
    })
})


app.get('/:id', (req, res) => {
    Fruit.findById(req.params.id, (err, foundFruit) => {
        res.render('show', {fruit: foundFruit})
    })
})

app.get('/:id/edit', (req, res) => {
    Fruit.findById(req.params.id, (err, foundFruit) => {
        res.render('edit', {fruit: foundFruit})
    })
})

app.put('/:id', (req, res) => {
    if(req.body.readyToEat === 'on'){
        req.body.readyToEat = true
    } else {
        req.body.readyToEat = false
    }
    Fruit.findByIdAndUpdate(req.params.id, req.body, {new:true}, (err, updatedModel) => {
        res.redirect('/')
    })
})

app.delete('/:id', (req, res) => {
    Fruit.findByIdAndRemove(req.params.id, (err, data) => {
        // redirect back to fruits index
        res.redirect('/')
    })
})

// listen for requests
app.listen(3000, () => {
    console.log('listening on port 3000')
})