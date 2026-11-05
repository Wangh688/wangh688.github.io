# Hao Wang

An English-only academic homepage for an undergraduate student at Zhengzhou University. Plain HTML, CSS, and JavaScript; no build step or dependencies.

## Edit the content

Update `site-data.js`:

- `profile`: name, affiliation, role, portrait, English biography paragraphs, and optional links.
- `researchInterests`: an array of English research topics.
- `publications`: publications in the order you want them displayed.
- `news`, `experience`, and `awards`: empty arrays hide the corresponding sections.

Unprovided information remains empty. The homepage contains no sample publications or invented credentials. An empty portrait path hides the photograph area. Empty email, Scholar, and CV values hide those links.

The initial HTML also contains the confirmed basic information for visitors without JavaScript. When changing the name, affiliation, or research interests, update those fallback texts and the metadata in `index.html` as well.

## Add a publication

Add an object to `publications`. Replace empty strings with accurate information. The title is required; other fields are optional.

```javascript
{
  title: "",
  authors: [
    { name: "Hao Wang", isSelf: true, marker: "" }
  ],
  year: "",
  venue: "",
  shortVenue: "",
  badges: [],
  image: "",      // e.g. ./assets/papers/paper-name.png
  imageAlt: "",
  url: "",
  links: { pdf: "", code: "", project: "", dataset: "", video: "" },
  highlight: "",
  description: "",
  bibtex: ""      // use a template string for a multiline citation
}
```

The publication layout uses a figure on the left and title, authors, venue, year, and resource links on the right. On narrow screens, the figure moves above the text. Figures use `object-fit: contain` so diagrams are not cropped. The author's own name is emphasized. Missing links are omitted. Year filtering, search, and expandable/copyable BibTeX appear when publications are supplied.

Use relative asset paths starting with `./assets/` to support both a GitHub Pages project path and a future root-domain site.

## Optional sections

```javascript
news: [{ date: "", text: "", url: "" }],
experience: [{ period: "", title: "", organization: "", description: "" }],
awards: [{ year: "", title: "" }]
```

## Preview

Open `index.html` directly, or run:

```shell
python -m http.server 4173 --bind 127.0.0.1
```

Then visit `http://127.0.0.1:4173/`. All assets are local. There are no external font, script, or stylesheet dependencies.

## GitHub Pages

In **Settings → Pages → Build and deployment**, choose **Deploy from a branch**, select **main** and **/ (root)**, then save. The included `.nojekyll` file enables plain static publishing.

With the repository named `haoW.github.io`, the expected project URL is `https://wangh688.github.io/haoW.github.io/`. Check Settings → Pages for the actual deployment status. To use `https://wangh688.github.io/`, rename the repository to `wangh688.github.io`.

## Design references

The page follows the restrained academic structure of [Jiaxuan Zou's homepage](https://jiaxuanzou0714.github.io/), with publication presentation inspired by [Yi Xiao's homepage](https://xy-boy.github.io/). The implementation is original and does not copy either person's biography, photographs, or publications.
