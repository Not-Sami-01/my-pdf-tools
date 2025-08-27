# 📄 PDF Tools

A simple and modern **Express.js** application for working with PDF files.  
This project provides a set of tools to manage, process, and serve PDF-related functionality.

---

## 🚀 Features

- Built with **Node.js + Express.js**
- Clean project structure with TypeScript support
- EJS templating for dynamic pages
- Organized views with reusable components
- Environment variable support (`.env`)
- Ready for deployment

---

## 📂 Project Structure

my-pdf-tools/
│-- src/
│ │-- server.ts # Main server file
│ │-- routes/ # Express routes
│ │-- views/ # EJS templates
│ │ │-- components/ # Reusable components (header, footer, etc.)
│ │ └-- pages/ # Page templates
│-- dist/ # Compiled JS (ignored in git)
│-- .env # Environment variables
│-- .gitignore
│-- package.json
│-- tsconfig.json
│-- README.md

---

## 🛠️ Installation

Clone the repository:

```bash
git clone https://github.com/Not-Sami-01/my-pdf-tools.git
cd my-pdf-tools
```

Install dependencies:

```bash
npm install
```

Build the project:

```bash
npm run build
```

Start the server:

```bash
npm start
```

Run in development mode:

```bash
npm run dev
```

⚙️ Environment Variables

Create a .env file in the root directory and add the required variables:

PORT=3000

🌐 Usage

Once the server is running, open your browser and visit:

http://localhost:3000

You’ll see the PDF Tools homepage.

📜 Scripts

npm run dev → Run the server in development mode with auto-reload

npm run build → Compile TypeScript to JavaScript (dist/ folder)

npm start → Run the compiled server

🤝 Contributing

Pull requests are welcome! For major changes, please open an issue first to discuss what you’d like to change.

📄 License

This project is licensed under the MIT License.
