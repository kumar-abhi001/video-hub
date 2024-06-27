
import '../Database/database.js';
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import auth from './auth.js';
import Channel from './channel.js';
import Videos from './videos.js';
import Likes from './likes.js';
import Comments from './comments.js';
import Studio from './studio.js';

const router = express.Router();

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));
router.use(auth);
router.use(Channel);
router.use(Videos);
router.use(Likes);
router.use(Comments);
router.use(Studio);

router.get("/", (req, res) => {
  res.send("Welcome to Youtube App Backend!");
});

export default router;
