const ShoppingListService = require("../src/shopping-list-service");
const knex = require("knex");

describe(`shopping-list Service object`, function() {
  let db;
  let testItems = [
    {
      id: 1,
      price: "5.01",
      date_added: new Date("2029-01-22T16:28:32.615Z"),
      name: "First test post!",
      catagory:
        "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Natus consequuntur deserunt commodi, nobis qui inventore corrupti iusto aliquid debitis unde non.Adipisci, pariatur.Molestiae, libero esse hic adipisci autem neque ?"
    },
    {
      id: 2,
      date_added: new Date("2100-05-22T16:28:32.615Z"),
      name: "Second test post!",
      price: "5.01",
      catagory:
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Cum, exercitationem cupiditate dignissimos est perspiciatis, nobis commodi alias saepe atque facilis labore sequi deleniti. Sint, adipisci facere! Velit temporibus debitis rerum."
    },
    {
      id: 3,
      date_added: new Date("1919-12-22T16:28:32.615Z"),
      name: "Third test post!",
      price: "5.01",
      catagory:
        "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Possimus, voluptate? Necessitatibus, reiciendis? Cupiditate totam laborum esse animi ratione ipsa dignissimos laboriosam eos similique cumque. Est nostrum esse porro id quaerat."
    }
  ];

  before(() => {
    db = knex({
      client: "pg",
      connection: process.env.TEST_DB_URL
    });
  });

  afterEach(() => db("shopping_list").truncate());

  after(() => db.destroy());

  context(`Given 'shopping_list' has data`, () => {
    beforeEach(() => {
      return db.into("shopping_list").insert(testItems);
    });

    it(`getAllItems() resolves all items from 'shopping_list' table`, () => {
      return ShoppingListService.getAllItems(db).then(actual => {
        expect(actual).to.eql(
          testItems.map(item => ({
            ...item,
            date_added: new Date(item.date_added)
          }))
        );
      });
    });

    it(`getById() resolves an item by id from 'shopping_list' table`, () => {
      const thirdId = 3;
      const thirdTestItem = testItems[thirdId - 1];
      return ShoppingListService.getById(db, thirdId).then(actual => {
        expect(actual).to.eql({
          id: thirdId,
          price: thirdTestItem.price,
          name: thirdTestItem.name,
          catagory: thirdTestItem.catagory,
          date_added: thirdTestItem.date_added
        });
      });
    });
    it(`deleteItem() removes an item by id from 'shopping_list' table`, () => {
      const itemId = 3;
      return ShoppingListService.deleteItem(db, itemId)
        .then(() => ShoppingListService.getAllItems(db))
        .then(allItems => {
          // copy the test items array without the "deleted" item
          const expected = testItems.filter(item => item.id !== itemId);
          expect(allItems).to.eql(expected);
        });
    });
    it(`updateItem() updates an item from the 'shopping_list' table`, () => {
      const idOfItemToUpdate = 3;
      const newItemData = {
        name: "updated name",
        price: "10.99",
        catagory: "updated catagory",
        date_added: new Date()
      };
      return ShoppingListService.updateItem(db, idOfItemToUpdate, newItemData)
        .then(() => ShoppingListService.getById(db, idOfItemToUpdate))
        .then(item => {
          expect(item).to.eql({
            id: idOfItemToUpdate,
            ...newItemData
          });
        });
    });
  });
  context(`Given 'shopping_list' has no data`, () => {
    it(`getAllItems() resolves an empty array`, () => {
      return ShoppingListService.getAllItems(db).then(actual => {
        expect(actual).to.eql([]);
      });
    });
  });
  it(`insertItem() inserts an item and resolves the item with an 'id'`, () => {
    const newItem = {
      name: "Test new name",
      catagory: "Test new catagory",
      price: "2.15",
      date_added: new Date("2020-01-01T00:00:00.000Z")
    };
    return ShoppingListService.insertItem(db, newItem).then(actual => {
      expect(actual).to.eql({
        id: 1,
        name: newItem.name,
        price: newItem.price,
        catagory: newItem.catagory,
        date_added: new Date(newItem.date_added)
      });
    });
  });
});
