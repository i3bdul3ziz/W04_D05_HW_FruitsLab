# FULL CRUD MongoDB and NodeJS with Express
<br>

For a starter: 
1. Create a new app 
1. Set up your server 

### Creating the Application
#### 1. Fire up your terminal and create a new folder for the application.

```bash
$ mkdir fruits
```

#### 2. Initialize the application with a package.json file

Go to the root folder of your application and type npm init to initialize your app with a package.json file.

```bash
$ cd fruits
$ npm init
```
<br> 


#### 3. Install dependencies

We will need express, mongoose modules in our application. Let’s install them by typing the following command -
```bash
$ npm install express mongoose --save
```

Our application folder now has a package.json file and a node_modules folder -
```bash
fruits
    └── node_modules/
    └── package.json
 ```
 <br> 

### Setting up the web server
<br> 

Let’s now create the main entry point of our application. Create a new file named server.js in the root folder of the application with the following contents -

 ```bash
 const express = require('express');

// create express app
const app = express();

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: false }));

// parse requests of content-type - application/json
app.use(express.json())

// define a simple route
app.get('/', (req, res) => {
your code here
});

// listen for requests
app.listen(3000, () => {
    console.log("Server is listening on port 3000");
});
```
 <br> 

First, We import express module. [Express](https://www.npmjs.com/package/express), as you know, is a web framework that we’ll be using for building the REST APIs.
Then, We create an express app, and add two parsing middlewares using express’s ```app.use()``` method. A middleware is a function that has access to the request and response objects. It can execute any code, transform the request object, or return a response.

Then, We define a simple GET route which returns a welcome message to the clients.

Finally, We listen on port 3000 for incoming connections.
<br> 
<br> 

#### All right! Let’s now run the server and go to http://localhost:3000 to access the route we just defined.

```bash
$ node server.js 
Server is listening on port 3000
```

## Connect Express to Mongo

1. Inside server.js:

```javascript
const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/', {useNewUrlParser : true , useUnifiedTopology: true } )
.then(()=> console.log('Mongodb is running'),(err)=> console.log(err) );
```

## Create Fruits Model

1. `mkdir models`
1. `touch models/fruits.js`
1. Create the fruit schema

```javascript
const mongoose = require('mongoose');

const fruitSchema = new mongoose.Schema({
    name:  { type: String, required: true },
    color:  { type: String, required: true },
    readyToEat: Boolean
});

const Fruit = mongoose.model('Fruit', fruitSchema);

module.exports = Fruit;
```

## Have Create Route Create data in MongoDB

Inside server.js:

```javascript
const Fruit = require('./models/fruits.js');
//... and then farther down the file
app.post('/fruits/', (req, res)=>{
    if(req.body.readyToEat === 'on'){ //if checked, req.body.readyToEat is set to 'on'
        req.body.readyToEat = true;
    } else { //if not checked, req.body.readyToEat is undefined
        req.body.readyToEat = false;
    }
    Fruit.create(req.body, (error, createdFruit)=>{
        res.send(createdFruit);
    });
});
```

## Create Index Route

```javascript
app.get('/fruits', (req, res)=>{
    res.send('index');
});
```

`touch views/index.ejs`

```html
<!DOCTYPE html>
<html>
    <head>
        <meta charset="utf-8">
        <title></title>
    </head>
    <body>
        <h1>Fruits index page</h1>
    </body>
</html>
```

Render the ejs file

```javascript
app.get('/fruits', (req, res)=>{
    res.render('index.ejs');
});
```

## Have Index Route Render All Fruits

```javascript
app.get('/fruits', (req, res)=>{
    Fruit.find({}, (error, allFruits)=>{
        res.render('index.ejs', {
            fruits: allFruits
        });
    });
});
```

Update the ejs file:

```html
<!DOCTYPE html>
<html>
    <head>
        <meta charset="utf-8">
        <title></title>
    </head>
    <body>
        <h1>Fruits index page</h1>
        <ul>
            <% for(let i = 0; i < fruits.length; i++){ %>
                <li>
                    The <%=fruits[i].name; %> is  <%=fruits[i].color; %>.
                    <% if(fruits[i].readyToEat === true){ %>
                        It is ready to eat
                    <% } else { %>
                        It is not ready to eat
                    <% } %>
                </li>
            <% } %>
        </ul>
    </body>
</html>
```

Add a link to the create page:

```html
<nav>
    <a href="/fruits/new">Create a New Fruit</a>
</nav>
```

## Have Create Route redirect to Index After Fruit Creation

Inside the create route

```javascript
Fruit.create(req.body, (error, createdFruit)=>{
    res.redirect('/fruits');
});
```

## Have Index Page Link to Show Route

```html
<li>
    The
    <a href="/fruits/<%=fruits[i].id; %>">
        <%=fruits[i].name; %>
    </a>
    is  <%=fruits[i].color; %>.
    
    <% if(fruits[i].readyToEat === true){ %>
        It is ready to eat
    <% } else { %>
        It is not ready to eat
    <% } %>
</li>
```

## Create Show Route

```javascript
app.get('/fruits/:id', (req, res)=>{
    Fruit.findById(req.params.id, (err, foundFruit)=>{
        res.send(foundFruit);
    });
});
```

## Create show.ejs

1. `touch views/show.ejs`
1. Add HTML

```html
<!DOCTYPE html>
<html>
    <head>
        <meta charset="utf-8">
        <title></title>
    </head>
    <body>
        <h1>Fruits show page</h1>
        The <%=fruit.name; %> is  <%=fruit.color; %>.
        <% if(fruit.readyToEat === true){ %>
            It is ready to eat
        <% } else { %>
            It is not ready to eat
        <% } %>
        <nav>
            <a href="/fruits">Back to Fruits Index</a>
        </nav>
    </body>
</html>
```

Render the ejs

```javascript
app.get('/fruits/:id', (req, res)=>{
    Fruit.findById(req.params.id, (err, foundFruit)=>{
        res.render('show.ejs', {
            fruit:foundFruit
        });
    });
});
```


# Delete and Update

Edit/Update:

1. Create a link to the edit route
1. Create an edit route
1. Create an PUT route
1. Have the edit page send a PUT request
1. Make the PUT Route Update the Model in MongoDB
1. Make the PUT Route Redirect Back to the Index Page

> D - For Delete
## Create a Delete Button

In your index.ejs file

```html
<li>
    The <a href="/fruits/<%=fruits[i].id; %>"><%=fruits[i].name; %></a> is  <%=fruits[i].color; %>.
    <% if(fruits[i].readyToEat === true){ %>
        It is ready to eat
    <% } else { %>
        It is not ready to eat
    <% } %>
    <!--  ADD DELETE FORM HERE-->
    <form>
        <input type="submit" value="DELETE"/>
    </form>
</li>
```

## Create a Delete Route

```javascript
app.delete('/fruits/:id', (req, res)=>{
    res.send('deleting...');
});
```

## Have the Delete Button send a DELETE request to the server

When we click "DELETE" on our index page (index.ejs), the form needs to make a DELETE request to our DELETE route.

The problem is that forms can't make DELETE requests.  Only POST and GET.  We can fake this, though.  First we need to install an npm package called `method-override`

```
npm install method-override
```

Now, in our server.js file, add:

```javascript
//include the method-override package
const methodOverride = require('method-override');
//...
//after app has been defined
//use methodOverride.  We'll be adding a query parameter to our delete form named _method
app.use(methodOverride('_method'));
```

Now go back and set up our delete form to send a DELETE request to the appropriate route

```html
<form action="/fruits/<%=fruits[i].id; %>?_method=DELETE" method="POST">
```

## Make the Delete Route Delete the Model from MongoDB

Also, have it redirect back to the fruits index page when deletion is complete

```javascript
app.delete('/fruits/:id', (req, res)=>{
    Fruit.findByIdAndRemove(req.params.id, (err, data)=>{
        res.redirect('/fruits');//redirect back to fruits index
    });
});
```

## Create a link to an edit route

In your `index.ejs` file:

```html
<a href="/fruits/<%=fruits[i].id; %>/edit">Edit</a>
```

## Create an edit route/page

First the route:

```javascript
app.get('/fruits/:id/edit', (req, res)=>{
    Fruit.findById(req.params.id, (err, foundFruit)=>{ //find the fruit
        res.render(
    		'edit.ejs',
    		{
    			fruit: foundFruit //pass in found fruit
    		}
    	);
    });
});
```

Now the EJS:

```html
<!DOCTYPE html>
<html>
    <head>
        <meta charset="utf-8">
        <title></title>
    </head>
    <body>
        <h1>Edit Fruit Page</h1>
        <form>
    		<!--  NOTE: the form is pre-populated with values for the server-->
    		Name: <input type="text" name="name" value="<%=fruit.name%>"/><br/>
    		Color: <input type="text" name="color" value="<%=fruit.color%>"/><br/>
    		Is Ready To Eat:
            <input type="checkbox" name="readyToEat"
                <% if(fruit.readyToEat === true){ %>
                    checked
                <% } %>
            />
            <br/>
            <input type="submit" name="" value="Submit Changes"/>
        </form>
    </body>
</html>
```

## Create an PUT route

```javascript
app.put('/fruits/:id', (req, res)=>{
    if(req.body.readyToEat === 'on'){
        req.body.readyToEat = true;
    } else {
        req.body.readyToEat = false;
    }
    res.send(req.body);
});
```

## Have the edit page send a PUT request

In the `edit.ejs`

```html
<form action="/fruits/<%=fruit.id%>?_method=PUT" method="POST">
```

## Make the PUT Route Update the Model in MongoDB

```javascript
app.put('/fruits/:id', (req, res)=>{
    if(req.body.readyToEat === 'on'){
        req.body.readyToEat = true;
    } else {
        req.body.readyToEat = false;
    }
    Fruit.findByIdAndUpdate(req.params.id, req.body, {new:true}, (err, updatedModel)=>{
        res.send(updatedModel);
    });
});
```

## Make the PUT Route Redirect Back to the Index Page

```javascript
Fruit.findByIdAndUpdate(req.params.id, req.body, (err, updatedModel)=>{
    res.redirect('/fruits');
});
```


