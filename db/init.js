const db = require("./connection");

db.wipe();

db.insert("Apple", 5, "Very red. Or green")
db.insert("Orange", 5, "Very orange")
db.insert("Yellow", 3, "Lemons")

db.readAll((error, results) => {
    if (error) throw error;
    
    console.log(results);
    db.disconnect();
});