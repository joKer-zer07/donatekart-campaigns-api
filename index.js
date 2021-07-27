const express = require("express");
const app = express();
const routes = require("./routes");

//routes
app.use("/api", routes);

// port
const port = process.env.PORT || 8000;

app.listen(port, () => {
  console.log(`App is running on port ${port}`);
});
