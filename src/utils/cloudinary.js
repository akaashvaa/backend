import {v2 as cloudinary} from 'cloudinary';
import fs from 'fs'

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_SECRET_KEY
});

const uploadOnCloudaniry = async (localFilePath) => {
  try {
    if(!localFilePath) return null
    const response = await cloudinary.uploader.upload(localFilePath,{
      resource_type: "auto"
    })
    console.log("file is uploaded", response.url)
  
    fs.unlinkSync(localFilePath)
    return response
  
  } catch (error) {
    console.log('error while upload', error )
    //remove the locally saved temporarry file as operation got failed
    fs.unlinkSync(localFilePath)
    return null 
  }
}

export {uploadOnCloudaniry}
