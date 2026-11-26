# Publish maximumjames.net with GitHub Pages

To preview a local copy on your Mac, open the site folder in Terminal and run `python3 -m http.server 8000`. Open [localhost:8000](http://localhost:8000) to check the layout and navigation. The homepage links to **Selected Works** and **Client Work**. Each page shows a two-column video grid on desktop and a single column on smaller screens. Add your videos in `videos.js`. Test YouTube playback from the hosted site so the player gets the web address it needs.

## 1. Add your videos

1. If the video is already on YouTube, copy its **Share** link. Public and unlisted videos work with **Allow embedding** enabled in **YouTube Studio → Content → video → Show more**. Anyone who can open your portfolio can watch and share an unlisted video from it.
2. If the video is on Frame.io, use the clip’s **… → Download → Original** menu if you have download access. You can also use a finished export you already have. Upload the file to YouTube with visibility set to **Unlisted**. For a new export from Premiere, choose **H.264 (.mp4)**. YouTube can also take a finished ProRes file.
3. Open `videos.js` in a text editor or use the pencil icon on GitHub. Add a title and a full YouTube video link to the appropriate list. Place the entries in the order you want visitors to see them. The sample lines that start with `//` are comments.

```js
const portfolioVideos = {
  selectedWorks: [
    { title: "My short film", url: "PASTE_FIRST_YOUTUBE_LINK" },
  ],
  clientWork: [
    { title: "Client project title", url: "PASTE_SECOND_YOUTUBE_LINK" },
  ],
};
```

Replace each `PASTE_…` value with the full link. To add another video, copy an entry and change its title and URL. A normal `youtube.com/watch` link or `youtu.be` share link works. The site generates the embedded player from the URL.

If you want the browser’s player, use a stable, public HTTPS URL to an H.264 MP4 whose file path ends in `.mp4`. A local `videos/my-film.mp4` path also works if you upload the `videos` folder with the site. For a native MP4 player, you can add `poster: "my-thumbnail.jpg"` to its entry and upload that image. Keep local video clips small. GitHub’s browser uploader accepts files up to 25 MiB apiece, and GitHub Pages limits site size and bandwidth. The Frame.io project and public Share URLs open Frame.io pages. Use individual YouTube or direct MP4 links for the video grid.

[YouTube embedding](https://support.google.com/youtube/answer/171780) · [YouTube visibility](https://support.google.com/youtube/answer/157177) · [YouTube upload formats](https://support.google.com/youtube/troubleshooter/2888402) · [Frame.io download instructions](https://help.frame.io/en/articles/9101084-how-can-i-download-files) · [GitHub upload limits](https://docs.github.com/en/repositories/working-with-files/managing-large-files/about-large-files-on-github) · [GitHub Pages limits](https://docs.github.com/en/pages/getting-started-with-github-pages/github-pages-limits)

## 2. Publish the files on GitHub Pages

1. Open [maxxjamez/maximumjames-dot-net](https://github.com/maxxjamez/maximumjames-dot-net). If you are starting over, [create a public repository](https://github.com/new) under `maxxjamez` and turn on **Add README** to initialize the `main` branch. Public repositories can use GitHub Pages on GitHub Free.
2. On the **Code** tab, select **Add file → Upload files**. Upload the site files and folders to the top level of the repository and click **Commit changes**. Each page folder (`selected-works/`, `client-work/`, and `contact/`) contains an `index.html` file. The three matching `.html` files at the top level forward previously shared links.
3. Open **Settings → Pages**. Under **Build and deployment**, choose **Deploy from a branch**, select **main** and **/(root)**, then click **Save**. Check the **Actions** tab for the Pages deployment. Once it finishes, use the site link in **Pages** to visit both gallery pages and play a video in a private browser window.

[GitHub Pages publishing instructions](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site)

## 3. Add the custom domain in GitHub

GitHub recommends verifying the domain first. Open your GitHub **profile settings → Pages → Add a domain**, enter `maximumjames.net`, and copy the TXT record GitHub gives you into **Advanced DNS → Host Records** for `maximumjames.net` in Namecheap. Return to GitHub and click **Verify** once the TXT record resolves. Keep that TXT record in place.

Then open the **repository’s Settings → Pages**. Under **Custom domain**, enter `maximumjames.net` and click **Save**. GitHub adds the `CNAME` file to `main` automatically. Its contents should be the single line below.

```text
maximumjames.net
```

[GitHub domain verification instructions](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/verifying-your-custom-domain-for-github-pages) · [GitHub custom domain instructions](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site)

## 4. Point Namecheap to GitHub Pages

Open **Namecheap → Domain List → Manage** next to `maximumjames.net` → **Advanced DNS → Host Records**. Add the five records below with **TTL** set to **Automatic**. Replace any existing parking or redirect records for `@` and `www` that conflict with these entries. Keep mail and verification records in place.

| Type | Host | Value |
| --- | --- | --- |
| A Record | `@` | `185.199.108.153` |
| A Record | `@` | `185.199.109.153` |
| A Record | `@` | `185.199.110.153` |
| A Record | `@` | `185.199.111.153` |
| CNAME Record | `www` | `maxxjamez.github.io` |

[Namecheap Host Records instructions](https://www.namecheap.com/support/knowledgebase/article.aspx/319/2237/how-can-i-set-up-an-a-address-record-for-my-domain/) · [GitHub Pages DNS records](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site)

## 5. Turn on HTTPS and check the site

Return to **GitHub repository → Settings → Pages**. When the DNS check succeeds and **Enforce HTTPS** becomes available, turn it on. GitHub says DNS propagation and the HTTPS option can each take up to 24 hours. Open [maximumjames.net](https://maximumjames.net) and [www.maximumjames.net](https://www.maximumjames.net) to check that the home page loads and the `www` address redirects to the main address.

On your Mac, you can check the DNS records from Terminal while you wait.

```bash
dig +short maximumjames.net A
dig +short www.maximumjames.net CNAME
```

[GitHub Pages HTTPS instructions](https://docs.github.com/en/pages/getting-started-with-github-pages/securing-your-github-pages-site-with-https)

For future video updates, edit `videos.js` on GitHub and commit to `main`. GitHub Pages will redeploy the site with the new entries.

## Site sounds and hidden game

`click-sound.js` makes a quiet mechanical mouse click using Web Audio on site clicks and keyboard activations. It is loaded by the home, gallery, and contact pages. YouTube videos begin with a thumbnail play button so the first play click gets the sound too. Browser security prevents the site from adding sounds to controls inside third-party YouTube and game iframes.

On the Contact page, the existing head image opens a hidden, on-site dialog containing **360 Degrees by Stepford**. The game loads only when the head is activated. Close, Escape, or a click outside the dialog dismisses it and removes the player to stop its audio. The subtext reads: “My song Full Circle is featured in the game's shuffled soundtrack.”

The game uses the creator’s official [itch.io playable embed](https://stepford.itch.io/360-degrees), because Newgrounds blocks embedding its player on other domains. Keep the itch.io player attribution and fullscreen controls. The fixed-size game canvas and itch.io footer are scaled together so the complete player fits smaller screens. The dialog markup is in `contact/index.html`; its behavior and layout are in `secret-game.js` and `secret-game.css`.
