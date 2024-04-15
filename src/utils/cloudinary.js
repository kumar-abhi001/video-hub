import {v2 as cloudinary} from 'cloudinary';
import fs from 'fs';

//console.log(process.env.MONGO_URI);
          
cloudinary.config({ 
  cloud_name: 'dyuxgims3', 
  api_key: '547518521151434', 
  api_secret: 'p9lC75dW4r1Zw89BJjNeiByWylU' 
});
const uploadOnCloudinary = async (localFilePath) => {
    try {
        if (!localFilePath) return null;

        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto"
        })
        return response.url;
    } catch (error) {
        fs.unlinkSync(localFilePath);
        console.log("ERROR in upload file on cloudinary ", error);
        return null;
    }
}

export { uploadOnCloudinary };