var express = require('express');
var router = express.Router();

/* GET photos listing. */
router.get('/', function(req, res, next) {
  Photo.find({}, (err, photos) => {
    if (err) return next(err);

    res.render('photos', {
      title: 'Photos',
      photos,
    });
  });
});

/* upload form */
router.get('/upload', function(req, res) {
  res.render('photos/upload', {
    title: 'Photo upload'
  });
});

/* image upload */
const multer = require('multer');
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, req.app.get('photosPath'));
  },
  filename: function(req, file, cb) {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});
const upload = multer({ storage: storage });
const fs = require('fs');
const Photo = require('../model/Photo');
const path = require('path');
router.post('/upload', upload.single("image"), (req, res, next) => {
  const photoPath = req.app.get('photosPath'); // 找到全局定义的 photos 变量
  const obj = {
    img: {
      data: fs.readFileSync(path.join(photoPath, req.file.filename)),
      contentType: "image/png"
    }
  };

  const newImage = new Photo({ // image 变量是为了后面渲染图片的时候使用，具体是利用 base64 去渲染图片
    name: req.body.name,
    path: path.join(photoPath, req.file.filename),
    image: obj.img
  });
  newImage.save((err) => {
    if (err) return next(err);

    res.redirect("/");
  });
});

/* image download */
router.get('/photo/:id/download', (req, res, next) => {
  Photo.findById(req.params.id, (err, photo) => {
    if (err) return next(err);

    // res.sendFile(photo.path); // 传输数据，浏览器会解析数据
    res.download(photo.path, photo.name+'.png'); // 触发浏览器下载并且设定下载的文件名
  })
});

module.exports = router;