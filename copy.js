const fs = require("fs");
const path = require("path");

const sourceDir = path.join("src", "templates");
const destDir = path.join("dist", "templates");

// Recursively copy all contents
async function copyRecursive(src, dest) {
  const stat = await fs.promises.stat(src);

  if (stat.isDirectory()) {
    await fs.promises.mkdir(dest, { recursive: true });
    const entries = await fs.promises.readdir(src);
    for (const entry of entries) {
      const srcPath = path.join(src, entry);
      const destPath = path.join(dest, entry);
      await copyRecursive(srcPath, destPath);
    }
  } else {
    await fs.promises.copyFile(src, dest);
  }
}

// Main logic
(async () => {
  try {
    if (fs.existsSync(destDir)) {
      fs.rmSync(destDir, { recursive: true, force: true });
    }
    await copyRecursive(sourceDir, destDir);
    console.log("Templates copied successfully.");
  } catch (err) {
    console.error("Error copying templates:", err);
  }
})();
