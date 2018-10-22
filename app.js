var express = require("express"),
    bodyParser = require("body-parser"),
    methodOverride = require("method-override"),
    expressSanitizer = require("express-sanitizer"),
    mongoose = require("mongoose"),
    express = require("express"),
    app = express();

// Connect to database
mongoose.connect("mongodb://localhost/restful_blog_app");

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(expressSanitizer());
app.use(methodOverride("_method"));

var blogSchema = new mongoose.Schema({
    
    title: String,
    image: String,
    body: String,
    created: {type: Date, default: Date.now}
});

var Blog = mongoose.model("Blog", blogSchema);

// RESTful ROUTES

// ROOT - Redirect to index
app.get("/", (req, res) => {

    res.redirect("/blogs");
});

// INDEX - Show all blogs
app.get("/blogs", (req, res) => {

    Blog.find({}, function(err, blogs) {

        if(err) {
            
            console.log(err)
        } else {

            res.render("index", {blogs: blogs});
        }
    });
});

// NEW - Render the form to create a new blog
app.get("/blogs/new", (req, res) => {

    res.render("new");    
});

// CREATE - Create the new blog from the new form
app.post("/blogs", (req, res) => {

    // Sanitize the blog's body
    req.body.blog.body = req.sanitize(req.body.blog.body);
    
    Blog.create(req.body.blog, (err, newBlog) => {

        if(err) {
            res.render("new");

        } else {
            res.redirect("/blogs");
        }
    });
});

// SHOW - Shows a specific blog
app.get("/blogs/:id", (req, res) => {

    Blog.findById(req.params.id, (err, foundBlog) => {

        if(err) {
            res.redirect("/blogs");

        } else {
            res.render("show", {blog: foundBlog});
        }
    });
});

// EDIT - Shows the form to edit a blog
app.get("/blogs/:id/edit", (req, res) => {

    Blog.findById(req.params.id, (err, foundBlog) => {

        if(err) {
            res.redirect("/blogs");

        } else {
            res.render("edit", {blog: foundBlog});
        }
    });
});

// UPDATE - Updates a blog from the edit form
app.put("/blogs/:id", (req, res) => {

    // Sanitize the blog's body
    req.body.blog.body = req.sanitize(req.body.blog.body);

    Blog.findByIdAndUpdate(req.params.id, req.body.blog, (err, foundBlog) => {

        if(err) {
            res.redirect("/blogs");

        } else {
            res.redirect("/blogs/" + req.params.id);
        }
    });
});

// DELETE - Deletes a blog
app.delete("/blogs/:id", (req, res) => {

    Blog.findByIdAndRemove(req.params.id, (err) => {

        if(err) {
            res.redirect("/blogs");

        } else {
            res.redirect("/blogs");   
        }
    });
});


// The server starts listening
app.listen(3000, "localhost", () => {

    console.log("Server started running...");
});