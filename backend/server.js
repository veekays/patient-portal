const express = require("express");
const app = express();
const port = 5000;
const multer = require("multer");
const csv = require("csvtojson");
const cors = require("cors");
const path = require("path");

const filePath = path.resolve("./uploads/data.csv");

app.use(cors());

const schema = [
  {
    name: "id",
    displayName: "ID",
  },
  {
    name: "name",
    displayName: "Name",
  },
  {
    name: "age",
    displayName: "Age",
  },
  {
    name: "gender",
    displayName: "Gender",
  },
  {
    name: "contact",
    displayName: "Contact",
  },
];

const storage = multer.diskStorage({
  destination: function (request, file, callback) {
    callback(null, "./uploads/");
  },
  filename: function (request, file, callback) {
    callback(null, "data.csv");
  },
});

const upload = multer({ storage: storage });

const sortData = (schema, data, sortingList = []) => {
  const sortedData = [...data];
  sortingList.forEach((l) => {
    const sIndex = schema.findIndex((s) => s.name === l.name);
    if (sIndex !== -1) {
      function compare(a, b) {
        if (a[l.name] < b[l.name]) {
          return -1;
        }
        if (a[l.name] > b[l.name]) {
          return 1;
        }
        return 0;
      }
      sortedData.sort(compare);
      if (l.type === "desc") sortedData.reverse();
    }
  });
  return sortedData;
};

const transformData = (data, options) => {
  const { page = 1, pageSize = 5, searchTerm = "", sortingList } = options;

  const onSearch = (d, searchTerm = "") => {
    return d.name.toLowerCase().match(searchTerm.toLowerCase());
  };

  const searchedData = data.filter((d) => onSearch(d, searchTerm));
  const sortedData = sortData(schema, searchedData, sortingList);

  const intPage = parseInt(page);
  const intSize = parseInt(pageSize);

  if (intPage && intSize) {
    const start = (intPage - 1) * intSize;
    const end = start + intSize;
    const slicedData = sortedData.slice(start, end);
    return {
      schema,
      totalCount: sortedData.length,
      count: sortedData.length,
      data: slicedData,
    };
  }
  return data;
};

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.post("/upload", upload.single("file"), (req, res) => {
  res.status(200).send({ message: "Your File has been uploaded sucessfully" });
});

app.get("/patient", (req, res) => {

  csv()
    .fromFile(filePath)
    .then((jsonObj) => {
      const data = transformData(jsonObj, req.query);
      res.status(200).send({ patient_list: data });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send({ message: "server error" });
    });
});

app.get("/patient/:id", (req, res) => {
  const { id } = req.params;
  
  csv()
    .fromFile(filePath)
    .then((jsonObj) => {
      const data = jsonObj.filter((item, i) => item.id === id)[0];
      res.status(200).send(data);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send({ message: "server error" });
    });
});

app.listen(port, () => {
  console.log(`app listening at http://localhost:${port}`);
});
