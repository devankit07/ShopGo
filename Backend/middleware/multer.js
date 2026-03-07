import multer from 'multer';

const storage = multer.memoryStorage();

//single upload
export const singleUpload = multer({storage}).single("file")

//mulltiple upload (no hard image count limit)
export const mulltipleUpload = multer({storage}).array("files");