/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-var-requires */
const mongoose = require('mongoose');
const fs = require("fs");
const csv = require("csv-parser");

const readXlsxFile = require('read-excel-file/node')


// Readable Stream.
// readXlsxFile(fs.createReadStream('/path/to/file')).then((rows) => {
//     // `rows` is an array of rows
//     // each row being an array of cells.
// })

// // Buffer.
// readXlsxFile(Buffer.from(fs.readFileSync('/path/to/file'))).then((rows) => {
//     // `rows` is an array of rows
//     // each row being an array of cells.
// })


async function main() {
    try {
        mongoose.set("strictQuery", false);
        mongoose.connect('mongodb://127.0.0.1:27017/doan', () => {
            console.log("Connected to MongoDB");
        });
        const WordModel = mongoose.model('Word', new mongoose.Schema({
            word: { type: String, required: true },
            gp_audio_url: { type: String, required: false },
            us_audio_url: { type: String, required: false },
            meaning: { type: String, required: false },
            ipa: { type: String, required: false },
            index: { type: Number, required: true }
        }, {
            timestamps: true
        }));
        // Works
        // File path.
        readXlsxFile('./data_final.xlsx').then(async (rows) => {
            rows.map(async (el, index) => {
                if (el[0] && el[1] && el[2] && el[3] && el[4]) {
                    const newWord = new WordModel({
                        word: el[0],
                        gp_audio_url: el[1],
                        us_audio_url: el[2],
                        ipa: el[3],
                        meaning: el[4],
                        index: index
                    })
                    await newWord.save()
                }
            })
        })

        WordModel.findOne(function (error, result) { /* ... */ });
    } catch (error) {
        console.log('error', error);
    }
}

main()