const cheerio = require("cheerio");
const path = require("path");
const fs = require("fs");

const tourType = "vietnamTours";

function deleteExtraSpace(stringValue) {
  return stringValue.replace(/\s+/g, ' ').trim();
}

function getRandInteger(min, max) {
  return Math.floor(Math.random() * (max - min) ) + min;
}

function getImagePath(tourImageUrl) {
  const url = new URL(tourImageUrl);
  const savedPath = path.basename(url.pathname);
  return savedPath;
}

async function downloadTourImage(tourImageUrl) {
  try {
    const savedPath = "images/" + getImagePath(tourImageUrl);
    const fileStream = fs.createWriteStream(savedPath);
    const response = await fetch(tourImageUrl);
    const stream = new WritableStream({
      write: chunk => {
        fileStream.write(chunk)
      }
    });
    const body = response.body;
    body.pipeTo(stream);
    return "assets/images/" + getImagePath(tourImageUrl)
  } catch (exception) {
    console.log(exception);
  }
}

async function parseTour(tourId, $, tour) {
  const pictureUrl = $(".mda-box-img img[class='lazy']", tour).attr("src").replace("//", "https://");
  const picture = await downloadTourImage(pictureUrl);
  const id = tourId;
  const title = $(".mda-box-name ", tour).text();
  const source = $(".mda-box-lb", tour).text();
  const description = $(".des", tour).text();
  const price = $(".mda-price > .mda-money-red", tour).text();
  const schedule = getRandInteger(10, 30) + "/" + getRandInteger(6, 12) + "/2024";
  const last = $(".mda-time > span:nth-child(2)", tour).text();
  const slots = "Còn " + getRandInteger(5, 15).toString() + " chỗ";
  return {
    id,
    picture,
    title,
    source,
    description: deleteExtraSpace(description),
    schedule,
    price,
    last,
    slots
  };
}

async function main() {
  const content = fs.readFileSync("documents/" + tourType + ".html");
  const $ = cheerio.load(content);
  const toursHTML = $(".col");
  const tours = [];
  var tourId = 1;
  for (const tourHTML of toursHTML) {
    const tour = await parseTour(tourId, $, tourHTML);
    tourId++;
    tours.push(tour);
    if (tourId === 25) {
      break;
    }
  }
  const jsonData = JSON.stringify(tours, null, 2);
  fs.writeFileSync("data/" + tourType + ".json", jsonData);
}

main();
