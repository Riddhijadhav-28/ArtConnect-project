import Artist from "../models/ArtistProfile.js";

export const createArtistProfile = async(req,res) =>{
    try{
        const {artistName, bio, profileImage, genres, socialLinks} = req.body

        const userId = req.user.id;

        const existingArtist = await Artist.findOne({ user: userId});

        if(existingArtist){
            return res.status(400).json({
                success: false,
                message: "Artist Profile Already Exists",
            });
        }

        const artist = await Artist.create({
            user: userId,
            artistName,
            bio,
            profileImage,
            genres,
            socialLinks,
        });

        return res.status(201).json({
            success: true,
            message: "Artist Profile craeted successfully",
            artist,
        });


    }catch(err){
        return res.status(500).json({
            success: false,
            message: err.message
        })
    }
}

export const getMyArtistProfile = async(req,res) => {
    try{
        const userId = req.user.id;

        const artist = await Artist.findOne({ user: userId });

        if(!artist){
            return res.status(404).json({
                success: false,
                message: "Artist profile not found",
            });
        }

        return res.status(200).json({
            success: true,
            artist,
        });
    }catch(err){
        return res.status(500).json({
            success: false,
            message: err.message,
        });
    }
}

export const updateArtistProfile = async(req,res) => {
    try{
        const userId = req.user.id;

        const artist = await Artist.findOne({user: userId});

        if(!artist){
            return res.status(404).json({
                success: false,
                message: "Artist profile not found",
            });
        }

        const { artistName, bio, profileImage, genres, socialLinks } = req.body;

        artist.artistName = artistName || artist.artistName;
        artist.bio = bio || artist.bio;
        artist.profileImage = profileImage || artist.profileImage;
        artist.genres = genres || artist.genres;
        artist.socialLinks = socialLinks || artist.socialLinks;

        await artist.save();

        return res.status(200).json({
            success: true,
            message: "Artist profile updated successfully!",
            artist,
        });

    }catch(error){
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
}

export const getAllArtists = async(req,res) => {
    try{
        const { search, page=1, limit=10, sort } = req.query
        let query = {};
        let sortQuery = {};

        const pageNumber = Number(page);
        const limitNumber = Number(limit);

        const skip = (pageNumber - 1)* limitNumber;


        if(search){
            query={
                $or: [
                    {
                        artistName:{
                            $regex: search, $options: "i"
                        }
                    },
                    {
                        genres:{
                            $regex: search, $options: "i"
                        }
                    }
                ]
            };
        }

        if(sort === "newest"){
            sortQuery = {createdAt: -1};
        }else if(sort === "oldest"){
            sortQuery = { createdAt: 1};
        }else{
            sortQuery= { createdAt: -1};
        }

        const artists = await Artist.find(query).sort(sortQuery).skip(skip).limit(limitNumber);
        const totalArtists = await Artist.countDocuments(query);

        return res.status(200).json({
            success: true,
            totalArtists,
            currentPage: pageNumber,
            totalPages: Math.ceil(totalArtists/ limitNumber),
            artists
        });
        
    }catch(error){
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
}

export const getArtistById = async(req,res) => {
    try{
        const {id} = req.params;

        const artist = await Artist.findById(id);

        if(!artist){
            return res.status(404).json({
                success: false,
                message: "Artist not found",
            })
        }

        res.status(200).json({
            success: true,
            artist,
        });
        
    }catch(error){
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
}