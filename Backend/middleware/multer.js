import multer from 'multer';

const storage = multer.memoryStorage();

//single upload
export const singleUpload = multer({storage}).single("file")

//mulltiple upload upto 5 images
export const mulltipleUpload = multer({storage}).array("files",5);