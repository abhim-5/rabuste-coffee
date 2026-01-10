const fs = require("fs");
const path = require("path");

const galleryPath = path.join(__dirname, "public", "gallery");
const sourceFile = path.join(galleryPath, "1.jpg");

const targets = ["7.jpg", "8.jpg", "9.jpg", "10.jpg", "11.jpg", "12.jpg"];

targets.forEach((target) => {
    const targetPath = path.join(galleryPath, target);
    try {
        fs.copyFileSync(sourceFile, targetPath);
        console.log(`Copied 1.jpg to ${target}`);
    } catch (err) {
        console.error(`Error copying to ${target}:`, err);
    }
});
