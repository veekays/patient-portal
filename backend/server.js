const express = require('express')
const app = express()
const port = 5000;
var multer = require('multer')
var csv = require("csvtojson");
const fs = require("fs")
var cors = require('cors');
var currentDir = "./uploads"

var fetchFile = ""


app.use(cors())

var storage = multer.diskStorage({
    destination: function (request, file, callback) {
        callback(null, './uploads/');
    },
    filename: function (request, file, callback) {
        callback(null, file.originalname)
    }
});

var upload = multer({ storage: storage });
const schema = [
    {
        name: "id",
        displayName: "ID"
    },
    {
        name: "name",
        displayName: "Name"
    },
    {
        name: "age",
        displayName: "Age"
    },
    {
        name: "gender",
        displayName: "Gender"
    },
    {
        name: "contact",
        displayName: "Contact"
    },
]

const sortData = (schema, data, sortingList = []) => {
    const sortedData = [...data];
    sortingList.forEach(l => {
        const sIndex = schema.findIndex(s => s.name === l.name);
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
            if (l.type === 'desc') sortedData.reverse();
        }
    });
    return sortedData;
};

const transformData = (data, options) => {
    const { filterList = {},
        page = 1,
        pageSize = 5,
        searchTerm = "",
        sortingList } = options

    const onSearch = (d, searchTerm = '') => {
        return (
            d.name.toLowerCase().match(searchTerm.toLowerCase())
        );
    }

    const searchedData = data.filter(d => onSearch(d, searchTerm));
    const sortedData = sortData(schema, searchedData, sortingList);

    if (page && pageSize) {
        const start = (page - 1) * pageSize;
        const end = start + pageSize;
        const slicedData = sortedData.slice(start, end);
        return {
            schema,
            count: sortedData.length,
            data: slicedData,
        }
    }
    return data;

}

app.get('/', (req, res) => {
    res.send('Hello World!')
})
app.post('/upload', upload.single('file'), (req, res) => {
    fetchFile = req.file.path;
    res.status(200).send({ message: "Your File has been uploaded sucessfully" })

})

app.get('/patient', (req, res) => {


    if (fetchFile === "") {
        res.status(200).send({ patient_list: [], message: "No patient data found" })
    } else
        csv()
            .fromFile(fetchFile)
            .then((jsonObj) => {
                const data = transformData(jsonObj, req.query)
                res.status(200).send({ patient_list: data })
            })

})


app.get('/patient/:id', (req, res) => {

    const { id } = req.params
    if (fetchFile === "") {
        res.status(200).send({ patient_list: [], message: "No patient data found" })
    } else
        csv()
            .fromFile(fetchFile)
            .then((jsonObj) => {
                const data = jsonObj.filter((item, i)=> item.id === id)[0];
                res.status(200).send(data)
            })

})

app.listen(port, () => {
    console.log(`app listening at http://localhost:${port}`)
})