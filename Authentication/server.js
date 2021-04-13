const express = require("express");

// connect to database
require("./config/dbConnect");

const app = express();
app.use(express.json());

app.use("/auth", require("./routers/authRouter"));
//user
app.use("/user", require("./routers/usersRouter"));


app.listen(4000, () => console.log("Server Up And Running"));