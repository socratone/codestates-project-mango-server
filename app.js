/*eslint-disable*/
const express = require('express');
const app = express();
const routes = require('./controllers');
const bodyParser = require('body-parser');
const cors = require('cors');
const db = require('./db');
const moment = require('moment');
const fs = require('fs');
const multer = require('multer');

var UploadDir = './uploads/' + moment().format('YYYY') + '/' + moment().format('MM') + '/' + moment().format('DD');
/* 폴더 생성 하기 */
var oMDIR = (req, res, next ) => {
  fs.mkdir('./uploads/' + moment().format('YYYY'), 0775, function(err){ return true; });
  fs.mkdir('./uploads/' + moment().format('YYYY') + '/' + moment().format('MM'), 0775, function(err){ return true; });
  fs.mkdir('./uploads/' + moment().format('YYYY') + '/' + moment().format('MM') + '/' + moment().format('DD'), 0775, function(err){ return true; });
  next();
};
/* 폴더 생성 사용 등록 */
app.use(oMDIR);
/* 스토리지 설정 */
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '_' + file.originalname);
  },
});
// 파일 필터 적용 이미지 일 경우에만 업로드

const upload = multer({storage: storage, fileFilter : ( req, file, cb ) => {
  console.log(file.mimetype.indexOf('image'));
  if (file.mimetype.indexOf('image') === -1){
    cb(null, false);
  }
  else{ cb(null, true);	}
} });

app.use(express.json());
app.get('/', function (req, res) {
  var responseText = moment().format('YYYY') + '/' + moment().format('MM') + '/' + moment().format('DD');
  res.send(responseText);
});
app.post('/upload', upload.single('file'), (req, res) => {
  var bFlag = false;
  if( typeof JSON.stringify(req.file) != 'undefined' ){ bFlag = true; }
  res.json( { file : JSON.stringify(req.file), result : bFlag } );
});
app.use(bodyParser.json());
app.use(cors({
  origin : [
    'http://localhost:3000', 
    'http://localhost:3001', 
    "http://mango-client.s3-website.ap-northeast-2.amazonaws.com"
  ],
  methods:['GET', 'POST']
}));

app.use('/signin', routes.signin);
app.use('/signup', routes.signup);
app.use('/signout', routes.signout);
app.use('/refresh', routes.refresh);
app.post('/ratingMusic', routes.ratingMusic);
app.get('/getMusiclists', routes.getMusiclists);
app.post('/postMusiclist', routes.postMusiclist);
app.post('/addMusic', routes.addMusic);
app.post('/deleteMusic', routes.deleteMusic);
app.post('/delRatingMusic', routes.delRatingMusic);
app.get('/getRatingMusiclist', routes.getRatingMusiclist);
app.post('/postRatingMusiclist', routes.postRatingMusiclist);
app.use('/deleteMusiclist', routes.deleteMusiclist);
app.get('/recommendedMusic', routes.recommendedMusic);
app.post('/rename', routes.rename);

const open = app.listen(3000, () => {
  console.log('3000 port start');
});

module.exports = open;

/*eslint-disable*/
/* 기본 저장 위치 */

