#!/usr/bin/env node

// const args = process.argv.slice(2);

// console.log("Hello, this is your custom command!");
// console.log("You provided the following arguments:", args);
// console.log("This is command executin begning")
// console.log('command ended')

import fs from "fs/promises";
import * as FSModule from "fs";
import path from "path";
import { createInterface } from "readline";
import * as util from "util";
import axios from "axios";

const readline = createInterface({
  input: process.stdin,
  output: process.stdout,
});

const cssFlexBoxFileUrl =
  "https://raw.githubusercontent.com/umakanth-pendyala/CSS-ARCHIVE/main/flex-box.css";
const questionAsync = util.promisify(readline.question).bind(readline);

const directoryExists = async (directoryPath) => {
  try {
    console.log("inside directory exists function");
    const result = await FSModule.existsSync(directoryPath);
    return result;
  } catch (err) {
    console.log(err);
    return false;
  }
};

const makeDirectory = async (directoryPath) => {
  try {
    await fs.mkdir(directoryPath, { recursive: true });
    console.log("Directory created successfully.");
  } catch (err) {
    console.error("Error while creating directory:", err);
  }
};

const downloadFile = async (fileUrl, fileLocation = "./") => {
  try {
    const axiosResponse = await axios({
      method: "get",
      url: cssFlexBoxFileUrl,
      responseType: 'stream'
    });
    const fileDirectory = "./styles";
    const fileName = path.basename(cssFlexBoxFileUrl);
    const localFilePath = path.join(fileDirectory, fileName);
    const file = FSModule.createWriteStream(localFilePath);
    axiosResponse.data.pipe(file);
    return new Promise((resolve, reject) => {
      file.on("finish", () => {
        resolve("Finished loading data into the file");
      });
      file.on("error", (error) => {
        console.error("Error while loading data into the file", error);
        reject("Error while loading data into the file");
      });
    });
  } catch (e) {
    console.error(e);
    throw new Error(e.message);
  }
};

const main = async () => {
  const directoryPath = path.join(path.resolve(), "styles");
  // console.log('Directory path: ', directoryPath);
  // console.log('Directory exists: ', await directoryExists(directoryPath));
  try {
    if (await directoryExists(directoryPath)) {
      console.log("directory already exists");
      const fileDownloadResponse = await downloadFile(cssFlexBoxFileUrl);
      console.log('DONE !');
    } else {
      console.log("Directory do not exist. Do you want to create a directory named styles");
      const input = await questionAsync("Y /N ? ");
      if (input == "Y") {
        await makeDirectory(directoryPath);
        console.log("Directory created");
        const fileDownloadResponse = await downloadFile(cssFlexBoxFileUrl);
        console.log('DONE !');
      } else if (input == "N") {
        console.log("Process terminated");
      } else {
        console.log("You entered a invalid input. Process is terminated");
      }
    }
  } catch (e) {
    console.log(e);
  } finally {
    process.exit();
  }
};

main();

// (() => {
//   console.log('current directory', __dirname)
//   console.log('hi')
// })();
