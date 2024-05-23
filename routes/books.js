const express = require('express');
const  router = express.Router();
const { 
    allBooks, 
    bookDetail, 
} = require('../controller/BookController');

router.use(express.json());

router.get('/', allBooks); // 카테고리 목록별 도서 조회 & 전체 도서 조회
router.get('/:id', bookDetail); // 개별 도서 조회

module.exports = router