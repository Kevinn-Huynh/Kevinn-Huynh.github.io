KEVIN HUYNH PORTFOLIO (multi-page site)

Pages
  index.html     home (live circuit instrument + featured projects)
  projects.html  all projects with tag filters and search
  project.html   one page per project (opens as project.html#project-slug)
  about.html     experience, skills, education
  contact.html   email, LinkedIn, message form
  assets/        site.css, site.js, instrument.js and data.js (all your content)
  images/        your pictures

Preview on your computer
  Unzip, then double-click index.html.

ADD A PROJECT
  1. Put your pictures in the images folder (small JPGs, under 300 KB each is plenty).
  2. Open assets/data.js in any text editor (Notepad, VS Code).
  3. Find the PROJECTS list. Copy a whole { ... } entry, paste it after another entry
     (keep the comma between entries) and edit it. The order in the file is the order on the site.
  4. Give it a new slug (lowercase letters, numbers, hyphens). Its page is project.html#your-slug
  5. Save, refresh your browser, check it. Then upload the changed files to GitHub.

  Image:  { type: "image", src: "images/photo.jpg", alt: "what it shows", caption: "label", wide: true }
  Chart:  { type: "chart", title: "Pack current", xLabel: "Time (s)", yLabel: "Current (A)",
            x: [0, 60, 120], series: [ { name: "Endurance", y: [10, 85, 70] } ] }
  Charts take up to 3 lines (series). Hover over a chart on the site to read values.

PUBLISH ON GITHUB PAGES
  1. Create a GitHub account (your username becomes your address).
  2. New repository named exactly  yourusername.github.io  and set it to Public.
  3. Upload everything from this folder: index.html, projects.html, project.html, about.html,
     contact.html, the assets folder and the images folder (drag the files and folders in together).
  4. Settings > Pages > Deploy from a branch > main > / (root) > Save.
  5. Wait a minute or two, then open https://yourusername.github.io

UPDATE THE LIVE SITE
  In your repository click Add file > Upload files, drag in the changed files
  (usually assets/data.js and any new images) and Commit changes.
