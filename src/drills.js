const knex = require("knex");
require("dotenv").config();

const knexInstance = knex({
  client: "pg",
  connection: process.env.DB_URL
});

function textSearch(text) {
  knexInstance
    .select("name")
    .from("shopping_list")
    .where("name", "ILIKE", `%${text}%`)
    .then(res => console.log(res));
}

// textSearch("burger");

function paginateList(pageNumber) {
  const productsperpage = 6;
  const offset = productsperpage * (pageNumber - 1);
  knexInstance
    .select("name")
    .from("shopping_list")
    .limit(productsperpage)
    .offset(offset)
    .then(res => console.log(res));
}

// paginateList(5);

function getItemsAfter(daysAgo) {
  knexInstance
    .select("name", "date_added")
    .from("shopping_list")
    .where(
      "date_added",
      ">",
      knexInstance.raw(`now() - '?? days'::INTERVAL`, daysAgo)
    )
    .then(res => console.log(res));
}
// getItemsAfter(1);

function getTotalCost() {
  knexInstance
    .select("category", knex.raw("SUM(price)"))
    .from("shopping_list")
    .groupBy("category")
    .then(res => console.log(res));
}

getTotalCost();

knexInstance("shopping_list").select("*");
console.log("knex and driver installed correctly");
