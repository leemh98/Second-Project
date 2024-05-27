const conn = require('../mariadb'); // db 모듈
const {StatusCodes} = require('http-status-codes'); // status code 모듈

// (카테고리별, 신간 여부) 전체 도서 목록 조회
const allBooks = (req, res) => {
    let {category_id, news, limit, currentPage} = req.query;
    
    // limit : page 당 도서 수            ex) 3
    // currentPage : 현재 몇 페이지 인지   ex) 1, 2, 3 ...
    // offset :                              0, 3, 6, 9, 12 ...
    //                                       limit * (currentPage-1)

    let offset = limit * (currentPage - 1);

    let sql = "SELECT *, (SELECT count(*) FROM likes WHERE liked_book_id = books.id) AS likes FROM books";
    let values = [];
    if (category_id && news){
        sql += " WHERE category_id=? AND pub_date BETWEEN DATE_SUB(NOW(), INTERVAL 1 MONTH) AND NOW()";
        values = [category_id];
    }
    else if (category_id) {
        sql += " WHERE category_id=?";
        values = [category_id];
    }
    else if (news) {
        sql += " WHERE pub_date BETWEEN DATE_SUB(NOW(), INTERVAL 1 MONTH) AND NOW()";
    }

    sql += " LIMIT ? OFFSET ?";
    values.push(parseInt(limit), offset);
    // 카테고리와 신간이 둘다 없으면 전체(요약된) 도서 리스트 -> 프론트엔드에서 필요한 정보만 선별해 출력

    conn.query(sql, values,
        (err, results) => {
            if(err) {
                console.log(err);
                return res.status(StatusCodes.BAD_REQUEST).end();
            }

            if(results.length)
                return res.status(StatusCodes.OK).json(results);
            else
                return res.status(StatusCodes.NOT_FOUND).end();
        }
    ) 
};

const bookDetail = (req, res) => { // 개별 도서 조회
    let {user_id} = req.body;;
    let book_id = req.params.id;

    let sql = `SELECT *, 
                    (SELECT count(*) FROM likes WHERE liked_book_id = books.id) AS likes,
                    (SELECT EXISTS(SELECT * FROM likes WHERE user_id=? AND liked_book_id=?)) AS liked
                FROM books 
                LEFT JOIN category 
                ON books.category_id = category.category_id 
                WHERE books.id=?`;
    let values = [user_id, book_id, book_id]
    conn.query(sql, values,
        (err, results) => {
            if(err) {
                console.log(err);
                return res.status(StatusCodes.BAD_REQUEST).end();
            }

            if(results[0])
                return res.status(StatusCodes.OK).json(results[0]);
            else
                return res.status(StatusCodes.NOT_FOUND).end();
        }
    )
};

module.exports = {
    allBooks,
    bookDetail,
};