var express		= require("express"),
	app			= express(),
	bodyparser 	= require("body-parser"),
	mongoose	= require("mongoose"),
	MethodOverride= require("method-override"),
	sanitizer	= require("express-sanitizer");

mongoose.connect("mongodb://localhost/blog_app", { useNewUrlParser: true }, { useFindAndModify: false });
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyparser.urlencoded({extended: true}));
app.use(MethodOverride("_method"));
app.use(sanitizer());

var blogSchema= new mongoose.Schema({
	title: String,
	image: String,
	body: String,
	created: {type: Date, default: Date.now}
});

var Blog= mongoose.model("Blog", blogSchema);

// Blog.create({
// 	title: "Stack Exchange",
// 	image: "https://images.unsplash.com/photo-1481121749114-c5488c93b0d1?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=400&q=60",
// 	body: "Knowing the concept of stack exchange is a must this days.",
// },function(err,newblog){
// 	if (err) {
// 		console.log(err);
// 	} else {
// 		console.log("New blog added:");
//  		console.log(newblog);
// 	}
// });
app.get("/",function(req,res){
	Blog.find({},function(err,blogs){
		if (err) {
			console.log(err);
		} else {
			res.render("index",{blogs: blogs});
		}
	})	
})

//Restful Routes
app.get("/blogs",function(req,res){
	Blog.find({},function(err,blogs){
		if (err) {
			console.log(err);
		} else {
			res.render("index",{blogs: blogs});
		}
	})	
})


//Route for opening the form to add new blog
app.get("/blogs/new",function(req,res){
	res.render("new");
});

//create route for new blog
app.post("/blogs",function(req,res){
	req.body.blog.body= req.sanitize(req.body.blog.body);

	Blog.create(req.body.blog,function(err,newBlog){
		if (err) {
			console.log(err);
			res.render("new");
		} else {
			res.redirect("blogs");
		}
	})

});

//show route for specific details of a blog
app.get("/blogs/:id",function(req,res){
	Blog.findById(req.params.id,function(err,foundBlog){
			if (err) {
				console.log(err);
				res.redirect("/blogs");
			} else {
				res.render("show",{blog:foundBlog});
			}
	})
});

//edit route that opens the form to edit a post
app.get("/blogs/:id/edit",function(req,res){
	Blog.findById(req.params.id,function(err,foundBlog){
		if (err) {
			console.log(err);
			res.redirect("/blogs");
		} else {
			res.render("edit",{blog: foundBlog});
		}
	})
});

//Update route to update database with the new data
app.put("/blogs/:id",function(req,res){
	req.body.blog.body= req.sanitize(req.body.blog.body);
	Blog.findByIdAndUpdate(req.params.id,req.body.blog,function(err,updatedblog){
		if (err) {
			console.log(err)
			res.redirect("/blogs");
		} else {
			res.redirect("/blogs/"+req.params.id);
		}
	})

});

app.delete("/blogs/:id",function(req,res){
	Blog.findByIdAndRemove(req.params.id,function(err){
		if (err) {
			console.log(err);
			res.redirect("/blogs");
		}else{
			res.redirect("/blogs");
		}
	})
});


app.listen(3000,function(){
	console.log("Server is running...")
});




























