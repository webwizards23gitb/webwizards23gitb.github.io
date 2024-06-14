const cheerio = require("cheerio");
const path = require("path");
const fs = require("fs");

function deleteExtraSpace(stringValue) {
  return stringValue.replace(/\s+/g, ' ').trim();
}

function getRandInteger(min, max) {
  return Math.floor(Math.random() * (max - min) ) + min;
}

function getImagePath(imageUrl) {
  const url = new URL(imageUrl);
  const savedPath = path.basename(url.pathname);
  return savedPath;
}

async function downloadTourImage(imageUrl) {
  try {
    const savedPath = "images/" + getImagePath(imageUrl);
    const fileStream = fs.createWriteStream(savedPath);
    const response = await fetch(imageUrl);
    const stream = new WritableStream({
      write: chunk => {
        fileStream.write(chunk)
      }
    });
    const body = response.body;
    body.pipeTo(stream);
    return "assets/images/" + getImagePath(imageUrl)
  } catch (exception) {
    console.log(exception);
  }
}

async function parseHotel(counter, $, hotelHTML) {
  const pictureUrl = $(".hotel img", hotelHTML).attr("src");
  const picture = await downloadTourImage(pictureUrl);
  const id = counter;
  const title = $(".tend", hotelHTML).text();
  const price = $(".price span", hotelHTML).text();
  return {
    id,
    picture,
    title: deleteExtraSpace(title),
    price
  };
}

async function main() {
  const content = fs.readFileSync("documents/hotels.html");
  const $ = cheerio.load(content);
  const hotelsHTML = $(".col1");
  const hotels = [];
  var counter = 1;
  for (const hotelHTML of hotelsHTML) {
    const tour = await parseHotel(counter, $, hotelHTML);
    counter++;
    hotels.push(tour);
    if (counter === 17) {
      break;
    }
  }
  const jsonData = JSON.stringify(hotels, null, 2);
  fs.writeFileSync("data/hotels.json", jsonData);
}

main();
