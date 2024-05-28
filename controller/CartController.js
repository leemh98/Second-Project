const conn = require('../mariadb'); // db 모듈
const {StatusCodes} = require('http-status-codes'); // status code 모듈

// 장바구니 담기
const addToCart = (req, res) => {
    const {book_id, quantity, user_id} = req.body;

    let sql = `INSERT INTO cartItems (book_id, quantity, user_id) VALUES (?, ?, ?)`;
    let values = [book_id, quantity, user_id];
    conn.query(sql, values,
        (err, results) => {
            if(err) {
                console.log(err);
                return res.status(StatusCodes.BAD_REQUEST).end();
            }

            return res.status(StatusCodes.OK).json(results);
        }
    )
};

// 장바구니 아이템 목록 조회
const getCartItems = (req, res) => {
    const {user_id, selected} = req.body; // selected = [1, 3] // 배열형태

    let sql = `SELECT cartItems.id, book_id, title, summary, quantity, price 
                FROM cartItems LEFT JOIN books 
                ON cartItems.book_id = books.id
                WHERE user_id=? AND cartItems.id IN (?)`;
    conn.query(sql, [user_id, selected], // [user_id, ...selected] => [user_id, 1, 3]의 형태로 들어감
        (err, results) => {
            if(err) {
                console.log(err);
                return res.status(StatusCodes.BAD_REQUEST).end();
            }

            return res.status(StatusCodes.OK).json(results);
        }
    )
};

const removeCartItem = (req, res) => {
    const {id} = req.params; // cartItemId

    let sql = `DELETE FROM cartItems WHERE id = ?`;
    conn.query(sql, id,
        (err, results) => {
            if(err) {
                console.log(err);
                return res.status(StatusCodes.BAD_REQUEST).end();
            }

            return res.status(StatusCodes.OK).json(results);
        }
    )
};

module.exports = {addToCart, getCartItems, removeCartItem}