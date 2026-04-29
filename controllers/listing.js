const Listing = require("../models/listing");
const axios = require("axios");


module.exports.index = async(req,res)=>{
    const allListings=await Listing.find({});
    res.render("./listings/index.ejs",{allListings})
         
   };

   module.exports.renderNewForm = (req,res)=>{
     res.render("./listings/new.ejs")
 
 };

 module.exports.showListing = async(req,res)=>{
      let {id}=req.params;
     const listing=await Listing.findById(id).populate({path: "reviews", populate: {path: "author",}}).populate("owner");
     if(!listing){
       req.flash("error", "Listing you requested for does not exist!");
       res.redirect("/listings");
     } else{
     res.render("./listings/show.ejs",{listing});   
     }
    };


 module.exports.createListing = async(req,res)=>{
    let url = req.file.path;
    let filename = req.file.filename;
    let {location} = req.body.listing;
    const mapUrl = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(location)}&format=json&limit=1`;
    const response = await axios.get(mapUrl,{headers: {"User-Agent": "Wanderlust_project"}});
    const newListing=new Listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image = {url, filename};
    if(response.data && response.data.length >0){
      const lat = parseFloat(response.data[0].lat);
      const lon = parseFloat(response.data[0].lon);
      
      newListing.geometry = {
        type: "Point",
        coordinates: [lat, lon]
      };

    }else{
      newListing.geometry = {
        type: "point",
        coordinates: [26.8467, 80.9462]      
      };
    }


    await newListing.save();
    req.flash("success", "New Listing Created!");
    res.redirect("/listings");
  };

  module.exports.renderEditForm = async(req,res)=>{
       let {id}=req.params;
      const listing=await Listing.findById(id);

       if(!listing){
        req.flash("error", "Listing you requested for does not exist!");
        res.redirect("/listings");
       }
       

       let originalImageUrl = listing.image.url;
          originalImageUrl = originalImageUrl.replace("/upload", ("/upload/w_250"))
      res.render("./listings/edit.ejs",{listing, originalImageUrl});   
          
     };


 module.exports.UpdateListing = async(req,res)=>{
       let {id}=req.params;
      let listing =  await Listing.findByIdAndUpdate(id,{...req.body.listing});

      let location = req.body.listing.location;      
      const mapUrl = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(location)}&format=json&limit=1`;
      const response = await axios.get(mapUrl,{headers: {"User-Agent": "Wanderlust_project"}});

      if(response.data && response.data.length >0){
        const lat = parseFloat(response.data[0].lat);
        const lon = parseFloat(response.data[0].lon);
      
         listing.geometry = {
          type: "Point",
          coordinates: [lat, lon]
         };
        };
       if(typeof req.file !== "undefined"){
        let url = req.file.path;
        let filename = req.file.filename;
        listing.image = {url, filename};
       }
       await listing.save();
       req.flash("success", "Listing Updated!");
       res.redirect(`/listings/${id}`);
  
    };

 module.exports.destroylisting = async(req,res)=>{
     let {id}=req.params;
     await Listing.findByIdAndDelete(id);
     req.flash("success", "Listing Deleted!");
     res.redirect("/listings");
   };