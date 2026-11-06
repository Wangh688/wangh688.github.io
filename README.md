# Hao Wang

An English-only academic homepage for an undergraduate student at Zhengzhou University. Plain HTML, CSS, and JavaScript; no build step or dependencies.

## Edit the content

Update `site-data.js`:

- `profile`: name, affiliation, role, portrait, English biography paragraphs, and optional links.
- `researchInterests`: an array of English research topics.
- `publications`: publications in the order you want them displayed.
- `news`, `experience`, and `awards`: empty arrays hide the corresponding sections.

Unprovided information remains empty. The homepage contains no sample publications or invented credentials. An empty portrait path hides the photograph area. Empty email, Scholar, and CV values hide the optional contact links; the CV navigation tab remains available.

The initial HTML also contains the confirmed basic information for visitors without JavaScript. When changing the name, affiliation, or research interests, update those fallback texts and the metadata in `index.html` as well.

## CV page

The CV navigation tab opens the standalone page at [https://wangh688.github.io/cv/](https://wangh688.github.io/cv/). It currently displays an availability message, with no placeholder resume or inactive download button.

When the real CV is ready, add the PDF under `assets/cv/` and replace the message in `cv/index.html` with the document or its download link. Set `profile.cv` in `site-data.js` to the PDF path if you also want a direct link in the homepage's contact area.

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

The homepage is published at [https://wangh688.github.io/](https://wangh688.github.io/). The repository is named `wangh688.github.io` to serve the account-level GitHub Pages site. Check Settings → Pages for deployment status.

## Design references

The page follows the restrained academic structure of [Jiaxuan Zou's homepage](https://jiaxuanzou0714.github.io/), with publication presentation inspired by [Yi Xiao's homepage](https://xy-boy.github.io/). The implementation is original and does not copy either person's biography, photographs, or publications.

The blue aperture favicon adapts [Lucide's Aperture icon](https://lucide.dev/icons/aperture), derived from Feather. Its colors and stroke width are adjusted for this site; the original license notices are included in [assets/LICENSE-lucide.txt](assets/LICENSE-lucide.txt).
