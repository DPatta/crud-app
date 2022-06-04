let express = require("express");
let router = express.Router();
let conn = require("../lib/db");

router.get("/", async (req, res, next) => {
  try {
    conn.query("SELECT * FROM books ORDER BY id", (err, { rows }) => {
      if (err) throw err;
      res.render("books", { data: rows });
      //   conn.end();
    });
  } catch (err) {
    req.flash("error", err);
    res.render("books", { data: "" });
  }
});

// display add book page
router.get("/add", (req, res, next) => {
  res.render("books/add", {
    name: "",
    author: "",
  });
});

//ADD new book
router.post("/add", (req, res, next) => {
  let name = req.body.name;
  let author = req.body.author;
  let errors = false;

  if (name.length === 0 || author.length === 0) {
    errors = true;
    // set flash messages
    req.flash("error", "Please enter name and author");
    //red to add.jad with flash message
    res.render("books/add", {
      name: name,
      author: author,
    });
  }
  //no error

  if (!errors) {
    let form_data = {
      name: name,
      author: author,
    };

    //insert

    try {
      conn.query(
        "INSERT INTO books (name, author) VALUES ($1, $2)",
        [form_data.name, form_data.author],
        (err, _rs) => {
          if (err) throw err;
          req.flash("success", "Book successfully added");
          res.redirect("/books");
          //   conn.end();
        }
      );
    } catch (err) {
      req.flash("error", err);
      res.render("books/add", {
        name: form_data.name,
        author: form_data.author,
      });
    }
  }
});

// edit book page
router.get("/edit/(:id)", (req, res, next) => {
  let id = req.params.id;

  try {
    conn.query("SELECT * FROM books WHERE id = $1", [id], (err, { rows }) => {
      if (rows.length == 0) {
        req.flash("error", "Book not found with id = " + id);
        res.redirect("/books");
      } else {
        res.render("books/edit", {
          title: "Edit book",
          id: rows[0].id,
          name: rows[0].name,
          author: rows[0].author,
        });
      }
      //   conn.end();
    });
  } catch (err) {
    req.flash("error", err);
    res.render("/books", {
      name: form_data.name,
      author: form_data.author,
    });
  }
});

//update book
router.post("/update/:id", (req, res, next) => {
  let id = req.params.id;
  let name = req.body.name;
  let author = req.body.author;
  let errors = false;

  if (name.length === 0 || author.length === 0) {
    errors = true;
    req.flash("error", "Please enter name and author");
    res.render("books/edit", {
      id: req.params.id,
      name: name,
      author: author,
    });
  }
  //no error
  if (!errors) {
    let form_data = {
      name: name,
      author: author,
    };
    //update query
    try {
      conn.query(
        "UPDATE books SET name=$1, author=$2 WHERE id =$3",
        [form_data.name, form_data.author, id],
        (err, _rs) => {
          if (err) throw err;
          req.flash("success", "Book successfully updated");
          res.redirect("/books");
        }
      );
    } catch (err) {
      req.flash("error", err);
      res.render("books/edit", {
        id: req.params.id,
        name: form_data.name,
        author: form_data.author,
      });
    }
  }
});

//delete book
router.get("/delete/(:id)", (req, res, next) => {
  let id = req.params.id;
  try {
    conn.query("DELETE FROM books WHERE id =$1", [id], (err, _rs) => {
      if (err) throw err;
      req.flash("success", "Bookssuccessfully deleted! ID =" + id);
      res.redirect("/books");
    });
  } catch (err) {
    req.flash("error", err);
    res.redirect("/books");
  }
});
module.exports = router;
