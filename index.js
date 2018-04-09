var bodyParser = require("body-parser"),
    methodOverride = require("method-override"),
    expressSanitizer = require("express-sanitizer"),
    mongoose = require("mongoose"),
    express = require("express"),
    app = express();


// CONFIGURATION
mongoose.connect("mongodb://localhost/restful_blog_app")

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true}));
app.use(expressSanitizer());
app.use(methodOverride("_method"));

// MONGOOSE MODEL CONFIG
var blogSchema = new mongoose.Schema({
    
    title: String,
    image: String,
    body: String,
    created: { type: Date, default: Date.now() }
});

var Blog = mongoose.model("Blog", blogSchema);

// RESTFUL ROUTES

// REDIRECT HOME
app.get("/", function(req, res){
    res.redirect("/blogs");
});

// HOME
app.get("/blogs", function(req, res) {

    Blog.find({}, function(err, blogs) {

        if(err) {
            console.log("Error finding the posts.");

        } else {
            res.render("index", { blogs: blogs });
        }
    });
});

// NEW POST
app.get("/blogs/new", function(req, res) {
    res.render("new");
});

// CREATE ROUTE
app.post("/blogs", function(req, res) {

    req.body.blog.body = req.sanitize(req.body.blog.body);

    // CREATE A POST
    Blog.create(req.body.blog, function(err, newBlog) {

        if(err) {
            res.render("new");

        } else {
            res.redirect("/blogs");
        }

    });
});

// SHOW ROUTE
app.get("/blogs/:id", function(req, res) {

    Blog.findById(req.params.id, function(err, foundPost) {

        if(err) {
            res.redirect("/blogs");

        } else {
            res.render("show", { blog: foundPost });
        }
    });
});

// EDIT ROUTE
app.get("/blogs/:id/edit", function(req, res) {
   
    Blog.findById(req.params.id, function(err,foundPost) {

        if(err) {
            res.redirect("/blogs");

        } else {
            res.render("edit", { blog: foundPost});
        }
    });
});

// UPDATE ROUTE
app.put("/blogs/:id", function(req, res) {

    req.body.blog.body = req.sanitize(req.body.blog.body);

    Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, updatePost) {

        if(err) {
            res.redirect("/blogs");
        } else {
            res.redirect("/blogs/" + req.params.id);
        }
    });
});

// DELETE ROUTE
app.delete("/blogs/:id", function(req, res) {

    Blog.findByIdAndRemove(req.params.id, function(err) {

        if(err) {
            res.redirect("/blogs/" + req.params.id);

        } else {
            res.redirect("/blogs");
        }
    });
});

app.listen(3000, () => console.log('Server has started successfully.'));