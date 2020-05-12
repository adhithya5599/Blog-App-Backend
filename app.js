var express=require('express');
var app=express();
var mongoose=require('mongoose');
var bodyParser=require('body-parser');
var methodOverride=require('method-override');
const options={
	 useUnifiedTopology: true, 
	 useNewUrlParser: true 
};

//Config
mongoose.connect("mongodb://localhost/blog-app",options);
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));
app.set("view engine","ejs");
app.use(methodOverride("_method"));

var blogSchema=new mongoose.Schema(
{
	name:String,
	image:String,
	body:String,
	created:{type:Date,default:Date.now}
});

var Blog=mongoose.model("Blog",blogSchema);

/*Blog.create(
{
	name:"Test Blog",
	image:"https://us.123rf.com/450wm/pavelstasevich/pavelstasevich1811/pavelstasevich181101065/112815953-stock-vector-no-image-available-icon-flat-vector.jpg?ver=6",
	body:"This is a test blog"
});*/

//RestFul Routes

//Index Route
app.get("/",function(req,res)
{
	res.redirect("/blogs");
});

app.get("/blogs",function(req,res)
{
	Blog.find({},function(err,blogs)
	{
		if(err)
		{
			console.log("Error!!!");
		}
		else
		{
			res.render("index",{blogs:blogs});
		}
	});

});

//New Route
app.get("/blogs/new",function(req,res)
{
	res.render("new");
});

//Create route
app.post("/blogs",function(req,res)
{
	Blog.create(req.body.blog,function(err,newBlog)
	{
		if(err)
		{
			res.render("new");
		}
		else
		{
			res.redirect("/blogs");
		}
	});
});

//Show route
app.get("/blogs/:id",function(req,res)
{
	Blog.findById(req.params.id,function(err,foundBlog)
	{
		if(err)
		{
			res.redirect("/blogs");
		}
		else
		{
			res.render("show",{blog:foundBlog});
		}
	});
});

//Edit Route
app.get("/blogs/:id/edit",function(req,res)
{
	Blog.findById(req.params.id,function(err,foundBlog)
	{
		if(err)
		{
			res.redirect("/blogs");
		}
		else
		{
			res.render("edit",{blog:foundBlog});
		}
	});
});

//Update Route
app.put("/blogs/:id",function(req,res)
{
	Blog.findByIdAndUpdate(req.params.id,req.body.blog,function(err,updatedBlog)
	{
		if(err)
		{
			res.redirect("/blogs");
		}
		else
		{
			res.redirect("/blogs/"+req.params.id);
		}
	});
});

//Destroy
app.delete("/blogs/:id",function(req,res)
{
	Blog.findByIdAndRemove(req.params.id,function(err)
	{
		if(err)
		{
			res.redirect("/blogs");
		}
		else
		{
			res.redirect("/blogs");
		}
	});
});

app.listen(3000,function()
{
	console.log("Blog App server started!");
});