const express = require('express');
const  router = express.Router();
const { addLike, removeLike } = require('../controller/LikeController');

router.use(express.json());

router.post('/:id', addLike);   // 좋아요 추가 // id는 책의 id 값
router.delete('/:id', removeLike); // 좋아요 삭제

module.exports = router