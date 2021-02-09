// const express = require('express');
// const multer = require('multer');
// const path = require('path');
// const imagemin = require('imagemin');
// const imageminJpegtran = require('imagemin-jpegtran');
// const imageminPngquant = require('imagemin-pngquant');
// const { AvatarGenerator } = require('random-avatar-generator');
// const generator = new AvatarGenerator();
// const avatar = generator.generateRandomAvatar();
// console.log(avatar);
// const storage = multer.diskStorage({
//   destination: 'draft',
//   filename: function (req, file, cb) {
//     const ext = path.parse(file.originalname).ext;
//     cb(null, Date.now().toString() + ext);
//   },
// });
// const upload = multer({ storage });

// const PORT = 3000;

// const app = express();

// app.use(express.static('static'));

// app.post(
//   '/form-data',
//   upload.single('file_example'),
//   minifyImage,
//   (req, res, next) => {
//     return res.status(200).send();
//   }
// );

// app.listen(PORT, () => {
//   console.log('server started');
// });

// async function minifyImage(req, res, next) {

//   const MINIFIED_DIR = 'static';
//   await imagemin([req.file.path], {
//     destination: MINIFIED_DIR,
//     plugins: [
//       imageminJpegtran(),
//       imageminPngquant({
//         quality: [0.6, 0.8],
//       }),
//     ],
//   });

//   req.file = {
//     ...req.file,
//     path: path.join(MINIFIED_DIR, req.file.filename),
//     destination: MINIFIED_DIR,
//   };
//   next();
// }
