"""Build every page of src/ into a self-contained file: output/themes/<theme>/index.html and output/index.html.

Each theme page becomes a standalone HTML player, and src/index.html the home page that links to them. The
stylesheets, scripts, fonts and images of each page are inlined so it opens offline; a single player file plays
with no other file, while the home page links to the players below it: output/ mirrors src/, so the
relative links stay the same. Each page's social.png, written by `make social`, is copied next to it. A home page
card with the hidden attribute is dropped from the build: its theme is unlisted, but still built and reachable.

Each theme's Markdown version for coding agents, src/themes/<theme>.md, written by `make markdown`, is copied to
output/themes/<theme>.md, next to the theme folder, and the theme page links to it with
<link rel="alternate" type="text/markdown" href="/themes/<theme>.md">, so that an agent reading the page finds the
text of the video. The href is an absolute path, as the site is served at a domain root. The same text, as HTML,
goes into the body of the theme page: a transcript out of sight but read by screen readers and search engines,
which find the rest of the text inside JavaScript only. The frames are captured from src/, never from output/: the
transcript never shows in a video. The <title> of a built theme page also gets the site name, "<title> | Temporal
Shorts", for browser tabs and search results; the home page title starts with it already.

The site icon, src/favicon.svg, and its PNG version for phones, src/apple-touch-icon.png, written by
`make social`, are copied to the root of output/, and every page links to them by absolute path.

Link previews on social networks need absolute URLs: when the SITE_URL environment variable holds the root URL of
the deployed site, set by the Pages workflow, each page also gets a canonical link and the link preview tags of
social networks (Open Graph, X card), then structured data for search engines (JSON-LD): the home page as a
WebSite of the listed themes, each theme page as a LearningResource, its audience from <meta name="audience">, with
its breadcrumb trail. These keep the bare title. output/ also gets a sitemap.xml of the home page and the listed
themes, and a robots.txt that points to it. Each sitemap URL carries as <lastmod> the date of the last commit that
changed the page's own content (src/index.html; a theme folder and its Markdown version), read with git; a
shallow clone or a tree without git gets none. Without SITE_URL, the pages are built with none of these, and the
build deletes the sitemap.xml and robots.txt of an earlier one. Standard library only.

  python scripts/build_html.py
  SITE_URL=https://example.com python scripts/build_html.py
"""
import base64
import json
import os
import re
import shutil
import subprocess
import sys
from html import escape, unescape
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from common import (CRAWLER_FILES, HOME_PAGE, OUTPUT, ROOT, SITE_ICONS, SRC, built_page, page_sources,
                    theme_markdown, theme_names, theme_page)

SITE_NAME = "Temporal Shorts"
# The preview image of a page lives next to it, in src/ and output/ alike, so its URL is the page URL + this name.
SOCIAL_IMAGE = "social.png"
SOCIAL_IMAGE_WIDTH, SOCIAL_IMAGE_HEIGHT = 1200, 630

# Structured data (JSON-LD, schema.org) for search engines. The author and publisher are a person: the site is no
# official Temporal site.
SCHEMA_CONTEXT = "https://schema.org"
AUTHOR = {"@type": "Person", "name": "Alexandre Roman", "url": "https://www.linkedin.com/in/alexandre-roman"}
LANGUAGE = "en"
LEARNING_RESOURCE_TYPE = "Animated explainer video"
# What each theme's video is about, besides Temporal itself: one or two topics per theme, which a new theme adds.
THEME_TOPICS = {
    "meet-temporal": ["Durable Execution", "Temporal Cloud"],
    "durable-execution": ["Durable Execution", "Workflow"],
    "human-in-the-loop": ["Human-in-the-loop", "Approval workflow"],
    "durable-ai-agents": ["AI agent", "Durable Execution"],
    "agent-harness": ["AI agent", "Temporal Agent Harness"],
}

MIME_TYPES = {
    ".woff2": "font/woff2",
    ".svg": "image/svg+xml",
    ".jpg": "image/jpeg",
}

# Relative to the stylesheet, as the browser resolves them.
FONT_URL = re.compile(r"url\((fonts/[^)]+)\)")
# Paths are relative to the page, e.g. ../../engine.js or scenes/01-llm-call.js in a theme page.
SCRIPT_TAG = re.compile(r'<script src="([^"]+)"></script>')
STYLESHEET_TAG = re.compile(r'<link rel="stylesheet" href="([^"]+)">')
# an asset file, in src/assets/ or one of its folders (assets/languages/go.svg)
ASSET_REF = re.compile(r"assets/[\w.-]+(?:/[\w.-]+)*")
DATA_URI = re.compile(r"data:[^\"')\s]+")
TITLE_TAG = re.compile(r"<title>(.*?)</title>", re.DOTALL)
DESCRIPTION_TAG = re.compile(r'<meta name="description" content="([^"]*)">')
# Who a theme's video is for, e.g. "Developers": read for the structured data, required on every theme page.
AUDIENCE_TAG = re.compile(r'<meta name="audience" content="([^"]*)">')
# A link carrying the standard hidden attribute, whatever its other attributes. The lookahead ends the attribute
# name, and the leading whitespace starts it, so that an href such as themes/hidden-x/ never matches.
HIDDEN_LINK_TAG = r'<a\s[^>]*\shidden(?=[\s>=])[^>]*>'
# A whole home page card of an unlisted theme, with its indentation and line break. Cards hold no nested <a>, so
# the card ends at the first </a>.
HIDDEN_CARD = re.compile(r'^[ \t]*' + HIDDEN_LINK_TAG + r'.*?</a>[ \t]*\n', re.DOTALL | re.MULTILINE)
# The theme a home page card links to, e.g. themes/meet-temporal/.
CARD_THEME = re.compile(r'\shref="themes/([^/"]+)/"')

# Absolute paths from the site root, like the player's home button: the site is served at a domain root.
ICON_LINKS = """
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<link rel="apple-touch-icon" href="/apple-touch-icon.png">"""

# The blocks of a theme's Markdown version (see export_markdown.py), separated by blank lines: the # title and the
# ## chapter headings, the "[Watch ...](...)" links to the player, and paragraphs of prose.
MARKDOWN_HEADING = re.compile(r"(#+) (.+)")
WATCH_LINK = re.compile(r"\[Watch [^\]]*\]\([^)]*\)")
# A backslash escape: in CommonMark, a backslash before any ASCII punctuation character stands for that character.
MARKDOWN_ESCAPE = re.compile(r"\\([!-/:-@\[-`{-~])")
# The standard visually hidden pattern: the transcript takes no room on screen, yet screen readers and search engine
# crawlers read it, which display:none or the hidden attribute would prevent. The style is inline because the
# transcript exists in the built pages only: a rule in styles.css, a video input, would invalidate every MP4 and SRT.
TRANSCRIPT_STYLE = ("position:absolute;width:1px;height:1px;overflow:hidden;clip-path:inset(50%);white-space:nowrap;"
                    "margin:-1px;padding:0;border:0")
TRANSCRIPT_TAG = '<article class="transcript"'


def data_uri(path):
    mime = MIME_TYPES.get(path.suffix)
    if mime is None:
        sys.exit(f"ERROR: no MIME type known for {path.name}")
    encoded = base64.b64encode(path.read_bytes()).decode("ascii")
    return f"data:{mime};base64,{encoded}"


def inline_assets(text):
    """Replace every assets/<file> reference with a data URI."""
    def replace(match):
        path = SRC / match.group(0)
        if not path.is_file():
            sys.exit(f"ERROR: missing asset {path}")
        return data_uri(path)

    return ASSET_REF.sub(replace, text)


def source_path(base_dir, relative_path):
    """Resolve a reference found in a file of base_dir; exit if it points outside src/."""
    path = (base_dir / relative_path).resolve()
    if not path.is_relative_to(SRC):
        sys.exit(f"ERROR: {relative_path} (from {base_dir}) points outside {SRC}")
    return path


def inline_fonts(css, css_dir):
    """Replace each fonts/<file> URL with a data URI."""
    def replace(match):
        path = source_path(css_dir, match.group(1))
        if not path.is_file():
            sys.exit(f"ERROR: missing font file {path}\nRun `bash scripts/fonts.sh` to download the fonts.")
        return f"url({data_uri(path)})"

    return FONT_URL.sub(replace, css)


def read_source(path):
    if not path.is_file():
        sys.exit(f"ERROR: missing source file {path}")
    return path.read_text(encoding="utf-8")


def inline_stylesheets(html, page_dir):
    """Replace each <link rel="stylesheet"> with an inline <style> block, its fonts and assets inlined."""
    def replace(match):
        stylesheet = source_path(page_dir, match.group(1))
        css = inline_fonts(inline_assets(read_source(stylesheet)), stylesheet.parent)
        return f"<style>\n{css}\n</style>"

    return STYLESHEET_TAG.sub(replace, html)


def inline_scripts(html, page_dir):
    """Replace each <script src="..."> with an inline <script> block holding the file content."""
    def replace(match):
        js = inline_assets(read_source(source_path(page_dir, match.group(1))))
        # A literal "</script" would close the inline block early; "<\/" means the same inside JS.
        js = js.replace("</script", "<\\/script")
        return f"<script>\n{js}\n</script>"

    return SCRIPT_TAG.sub(replace, html)


def site_url():
    """The root URL of the deployed site, from SITE_URL, without a trailing slash; empty when unset."""
    return os.environ.get("SITE_URL", "").strip().rstrip("/")


def public_url(source, site):
    """The URL of a page on the site: its folder, e.g. <site>/themes/<theme>/, never index.html."""
    folder = source.parent.relative_to(SRC)
    path = "".join(f"{part}/" for part in folder.parts)
    return f"{site}/{path}"


def page_text(html, source, pattern, what):
    """The text matched by pattern in the page, entities decoded and whitespace collapsed; exit if it is missing."""
    match = pattern.search(html)
    if match is None:
        sys.exit(f"ERROR: {source} has no {what}")
    # The page text is HTML already: unescape it first, so that an entity such as &amp; is not escaped twice.
    return " ".join(unescape(match.group(1)).split())


def page_title(html, source):
    return page_text(html, source, TITLE_TAG, "<title>")


def attribute(text):
    """Plain text escaped for a double-quoted attribute."""
    # Inside double quotes, only " needs escaping on top of &, < and >: an apostrophe stays readable.
    return escape(text, quote=False).replace('"', "&quot;")


def insert_after_description(html, tags):
    """Insert tags right after the description, at the top of <head>.

    The tags start with a line break and end without one, to sit on their own lines.
    """
    description_end = DESCRIPTION_TAG.search(html).end()
    return html[:description_end] + tags + html[description_end:]


def markdown_link(theme):
    """The link to the theme's Markdown version.

    At the top of <head>, as an agent may read only the start of a page that the inlined fonts make large. The
    href is an absolute path from the site root, /themes/<theme>.md, like the player's home button: the site is
    served at a domain root.
    """
    return f'\n<link rel="alternate" type="text/markdown" href="/themes/{theme}.md">'


def social_tags(url, title, description):
    """The canonical link and the link preview tags of social networks (Open Graph, X card) of the page at url."""
    title = attribute(title)
    description = attribute(description)
    return f"""
<link rel="canonical" href="{url}">
<meta property="og:type" content="website">
<meta property="og:site_name" content="{SITE_NAME}">
<meta property="og:title" content="{title}">
<meta property="og:description" content="{description}">
<meta property="og:url" content="{url}">
<meta property="og:image" content="{url}{SOCIAL_IMAGE}">
<meta property="og:image:width" content="{SOCIAL_IMAGE_WIDTH}">
<meta property="og:image:height" content="{SOCIAL_IMAGE_HEIGHT}">
<meta property="og:image:alt" content="{title}">
<meta name="twitter:card" content="summary_large_image">"""


def home_structured_data(site, description):
    """The home page as a schema.org WebSite whose parts are the listed themes, named after their page <title>."""
    parts = []
    for theme in listed_themes():
        page = theme_page(theme)
        title = page_title(read_source(page), page)
        parts.append({"@type": "LearningResource", "name": title, "url": public_url(page, site)})
    return {
        "@context": SCHEMA_CONTEXT,
        "@type": "WebSite",
        "name": SITE_NAME,
        "url": public_url(HOME_PAGE, site),
        "description": description,
        "inLanguage": LANGUAGE,
        "author": AUTHOR,
        "publisher": AUTHOR,
        "hasPart": parts,
    }


def theme_structured_data(theme, site, title, description, audience):
    """A theme page as a schema.org LearningResource, part of the site, and the breadcrumb trail from the home page."""
    topics = THEME_TOPICS.get(theme)
    if topics is None:
        sys.exit(f"ERROR: {theme} has no entry in THEME_TOPICS (scripts/build_html.py): add the topics of its video")
    url = public_url(theme_page(theme), site)
    home_url = public_url(HOME_PAGE, site)
    resource = {
        "@type": "LearningResource",
        "name": title,
        "description": description,
        "url": url,
        "image": f"{url}{SOCIAL_IMAGE}",
        "inLanguage": LANGUAGE,
        "learningResourceType": LEARNING_RESOURCE_TYPE,
        "about": [{"@type": "Thing", "name": topic} for topic in ["Temporal", *topics]],
        "audience": {"@type": "Audience", "audienceType": audience},
        "isPartOf": {"@type": "WebSite", "name": SITE_NAME, "url": home_url},
        "author": AUTHOR,
    }
    breadcrumbs = {
        "@type": "BreadcrumbList",
        "itemListElement": [
            {"@type": "ListItem", "position": 1, "name": SITE_NAME, "item": home_url},
            {"@type": "ListItem", "position": 2, "name": title, "item": url},
        ],
    }
    return {"@context": SCHEMA_CONTEXT, "@graph": [resource, breadcrumbs]}


def structured_data_script(data):
    """A JSON-LD block holding structured data for search engines."""
    # A literal "</" could close the block early, as in inline_scripts(); "<\/" means the same in JSON.
    text = json.dumps(data, indent=2, ensure_ascii=False).replace("</", "<\\/")
    return f'\n<script type="application/ld+json">\n{text}\n</script>'


def head_tags(source, site, title, description, audience):
    """The tags the build adds right after the description, at the top of <head>; the ones with URLs need a site.

    In this order: the site icons, the theme's Markdown version, the canonical link and the link preview tags,
    then the structured data. They go ahead of the inlined fonts and scripts: link preview crawlers, such as Slack's,
    read only the start of a page.
    """
    tags = ICON_LINKS
    if source != HOME_PAGE:
        tags += markdown_link(source.parent.name)
    if not site:
        return tags
    tags += social_tags(public_url(source, site), title, description)
    if source == HOME_PAGE:
        data = home_structured_data(site, description)
    else:
        data = theme_structured_data(source.parent.name, site, title, description, audience)
    return tags + structured_data_script(data)


def add_title_suffix(html, title):
    """Append the site name to the <title> of a theme page, in browser tabs and search results.

    The home page title starts with it already. The link preview tags and the structured data keep the bare title,
    next to their own site name.
    """
    suffixed = f"<title>{escape(title, quote=False)} | {SITE_NAME}</title>"
    return TITLE_TAG.sub(lambda match: suffixed, html, count=1)


def markdown_version(theme):
    """The theme's Markdown version, written by `make markdown` and committed; exit if it is missing."""
    markdown = theme_markdown(theme)
    if not markdown.is_file():
        sys.exit(f"ERROR: missing Markdown version {markdown}\nRun `make markdown` to write it, then commit it.")
    return markdown


def markdown_text(text):
    """The plain text of a Markdown block: whitespace collapsed and backslash escapes resolved."""
    return MARKDOWN_ESCAPE.sub(r"\1", " ".join(text.split()))


def transcript_html(markdown):
    """The text of a theme's Markdown version as a visually hidden <article>, for screen readers and search engines.

    The title becomes an <h1>, each chapter heading an <h2>, each paragraph a <p>. The links to the player are
    dropped: a link hidden from sight but reachable with the Tab key would trap keyboard users.
    """
    elements = []
    for block in markdown.read_text(encoding="utf-8").strip().split("\n\n"):
        if WATCH_LINK.fullmatch(block):
            continue
        heading = MARKDOWN_HEADING.fullmatch(block)
        if heading is None:
            tag = "p"
            text = block
        elif len(heading.group(1)) <= 2:
            tag = f"h{len(heading.group(1))}"
            text = heading.group(2)
        else:
            sys.exit(f"ERROR: {markdown} holds a heading deeper than ##, which the transcript does not expect: "
                     f"{block!r}")
        elements.append(f"<{tag}>{escape(markdown_text(text), quote=False)}</{tag}>")
    if not elements or not elements[0].startswith("<h1>"):
        sys.exit(f"ERROR: {markdown} does not start with a # title")
    body = "\n".join(elements)
    return f'{TRANSCRIPT_TAG} style="{TRANSCRIPT_STYLE}">\n{body}\n</article>\n'


def add_transcript(html, source, markdown):
    """Insert the transcript at the start of the scripts of <body>, after the stage, out of sight.

    The scenes hold the text of a theme inside JavaScript, which search engines may not run: the transcript gives
    them that text as HTML. Only the built pages carry it: the frames are captured from src/, so it never shows in a
    video.
    """
    body_start = html.find("<body")
    if body_start == -1:
        sys.exit(f"ERROR: {source} has no <body>")
    first_script = SCRIPT_TAG.search(html, body_start)
    if first_script is None:
        sys.exit(f"ERROR: {source} has no <script src> in its <body>, before which the transcript goes")
    insert_at = first_script.start()
    return html[:insert_at] + transcript_html(markdown) + html[insert_at:]


def check_transcript(html):
    # Once, in <body>: a page without it would show search engines no text, a second copy would repeat it.
    if html.count(TRANSCRIPT_TAG) != 1 or html.find(TRANSCRIPT_TAG) < html.find("<body"):
        sys.exit("ERROR: the theme page does not hold exactly one transcript in its <body>")


def copy_social_image(source, out):
    """Copy the preview image of a page next to its build: it is linked by URL, never inlined."""
    image = source.parent / SOCIAL_IMAGE
    if not image.is_file():
        sys.exit(f"ERROR: missing social preview image {image}\nRun `make social` to write it, then commit it.")
    shutil.copyfile(image, out.parent / SOCIAL_IMAGE)


def copy_site_icons():
    """Copy the site icon and its PNG version for phones to the root of output/, where every page links to them."""
    for name in SITE_ICONS:
        icon = SRC / name
        if not icon.is_file():
            sys.exit(f"ERROR: missing site icon {icon}\nsrc/favicon.svg is a source file; `make social` writes "
                     "src/apple-touch-icon.png from it: run it, then commit the image.")
        shutil.copyfile(icon, OUTPUT / name)


def hidden_themes():
    """The unlisted themes: those whose home page card carries the hidden attribute."""
    themes = []
    for card in HIDDEN_CARD.finditer(read_source(HOME_PAGE)):
        link = CARD_THEME.search(card.group(0))
        if link is None:
            sys.exit(f"ERROR: a hidden card of {HOME_PAGE} links to no themes/<theme>/ folder")
        themes.append(link.group(1))
    return themes


def listed_themes():
    """The themes the home page lists: every theme but the unlisted ones."""
    hidden = hidden_themes()
    return [theme for theme in theme_names() if theme not in hidden]


def page_content_paths(source):
    """The files and folders that hold a page's own content, whose last commit dates the page in the sitemap.

    The home page is src/index.html; a theme page is its folder, src/themes/<theme>/ (its page, scenes and
    helpers), and its Markdown version, src/themes/<theme>.md. The shared sources (engine.js, styles.css,
    shared.js, assets) are left out on purpose: <lastmod> tells of a change of the page's own content.
    """
    if source == HOME_PAGE:
        return [HOME_PAGE]
    theme = source.parent.name
    return [source.parent, theme_markdown(theme)]


def git(*args):
    """The output of a git command run in the project, stripped; None if git is missing or the command fails."""
    try:
        result = subprocess.run(["git", *args], cwd=ROOT, capture_output=True, text=True)
    except FileNotFoundError:
        return None
    if result.returncode != 0:
        return None
    return result.stdout.strip()


def last_change_dates(pages):
    """The committer date of the last commit that changed each page's own content, by page; None without git history.

    Dates come from commits only: uncommitted changes are ignored, and a page whose content no commit touches gets
    None. A shallow clone, such as the default checkout of GitHub Actions, holds a single commit, whose date would
    stand for every file: no date beats a wrong one.
    """
    shallow = git("rev-parse", "--is-shallow-repository")
    if shallow is None:
        print("Skipped <lastmod> in sitemap.xml: no git repository, or no git")
        return None
    if shallow == "true":
        print("Skipped <lastmod> in sitemap.xml: the clone is shallow, its dates are not those of the last changes")
        return None
    dates = {}
    for page in pages:
        paths = [str(path.relative_to(ROOT)) for path in page_content_paths(page)]
        # Strict ISO 8601 with the committer's offset, e.g. 2026-10-13T10:15:00+02:00: a W3C datetime.
        dates[page] = git("log", "-1", "--format=%cI", "--", *paths) or None
    return dates


def sitemap(site):
    """The sitemap of the home page and the listed theme pages; the unlisted themes stay out of search engines' way.

    Each URL carries the date of the last commit that changed the page's own content as <lastmod>, when the git
    history gives it (see last_change_dates()).
    """
    pages = [HOME_PAGE, *(theme_page(theme) for theme in listed_themes())]
    dates = last_change_dates(pages) or {}
    lines = ['<?xml version="1.0" encoding="UTF-8"?>', '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">']
    for page in pages:
        lastmod = ""
        if dates.get(page):
            lastmod = f"<lastmod>{dates[page]}</lastmod>"
        lines.append(f"  <url><loc>{escape(public_url(page, site))}</loc>{lastmod}</url>")
    lines.append("</urlset>")
    return "\n".join(lines) + "\n"


def robots_txt(site):
    """Let every crawler in, and point it to the sitemap."""
    return f"User-agent: *\nAllow: /\n\nSitemap: {site}/sitemap.xml\n"


def write_crawler_files(site):
    """Write sitemap.xml and robots.txt at the root of output/; without a site, delete those of an earlier build.

    Both need absolute URLs, so they exist only on the deployed site: a stale pair left by a build with SITE_URL
    would point a local server to the deployed one.
    """
    if not site:
        for name in CRAWLER_FILES:
            (OUTPUT / name).unlink(missing_ok=True)
        return
    for name, text in (("sitemap.xml", sitemap(site)), ("robots.txt", robots_txt(site))):
        path = OUTPUT / name
        path.write_text(text, encoding="utf-8")
        print(path)


def check_self_contained(html):
    # Strip the data URIs first: a base64 payload could contain "fonts/" by pure chance.
    leftover = DATA_URI.sub("", html)
    for marker in ("fonts/", "assets/", "<script src=", 'rel="stylesheet"'):
        if marker in leftover:
            sys.exit(f"ERROR: the output still references {marker!r}")


def drop_hidden_cards(html):
    """Remove each home page card that carries the hidden attribute: the page keeps no link to an unlisted theme."""
    return HIDDEN_CARD.sub("", html)


def check_no_hidden_cards(html):
    # Searches for the opening tag alone: a card that drop_hidden_cards() missed, e.g. sharing a line with another
    # tag, would otherwise leak the link to an unlisted theme.
    if re.search(HIDDEN_LINK_TAG, html):
        sys.exit("ERROR: the home page still holds a link with the hidden attribute")


def check_social_tags_first(html):
    """Exit unless og:image comes before the first inline style or script, within reach of link preview crawlers."""
    image_tag = html.find('<meta property="og:image"')
    if image_tag == -1:
        sys.exit("ERROR: the output has no og:image tag")
    for block in ("<style", "<script"):
        block_start = html.find(block)
        if block_start != -1 and block_start < image_tag:
            sys.exit(f"ERROR: the og:image tag comes after the first {block}: link preview crawlers would miss it")


def build_page(source, site):
    """Write the self-contained build of a page of src/ to the same relative path under output/."""
    html = read_source(source)
    # Read with or without a site, so that a page missing one of them fails on pull requests too.
    title = page_title(html, source)
    description = page_text(html, source, DESCRIPTION_TAG, '<meta name="description" content="...">')
    if source == HOME_PAGE:
        audience = None
        markdown = None
        html = drop_hidden_cards(html)
        check_no_hidden_cards(html)
    else:
        audience = page_text(html, source, AUDIENCE_TAG, '<meta name="audience" content="...">')
        markdown = markdown_version(theme=source.parent.name)
    html = insert_after_description(html, head_tags(source, site, title, description, audience))
    if markdown is not None:
        html = add_title_suffix(html, title)
    html = inline_assets(html)
    # After the assets: a subtitle that mentions an assets/ path must stay text.
    if markdown is not None:
        html = add_transcript(html, source, markdown)
        check_transcript(html)
    html = inline_stylesheets(html, source.parent)
    html = inline_scripts(html, source.parent)
    check_self_contained(html)
    if site:
        check_social_tags_first(html)

    out = built_page(source)
    out.parent.mkdir(parents=True, exist_ok=True)
    copy_social_image(source, out)
    if markdown is not None:
        shutil.copyfile(markdown, built_page(markdown))
    out.write_text(html, encoding="utf-8")
    print(f"{out} ({out.stat().st_size / 1024:.0f} KB)")


def main():
    site = site_url()
    if not site:
        print("Skipped the social tags, canonical links, sitemap.xml and robots.txt: SITE_URL is unset")
    # The files of the site root come first, and page_sources() lists the home page last, on purpose: the Makefile
    # uses output/index.html as the target of the whole build, so it must be written only once every other file is,
    # and never be older than any of them.
    OUTPUT.mkdir(exist_ok=True)
    copy_site_icons()
    write_crawler_files(site)
    for source in page_sources():
        build_page(source, site)


if __name__ == "__main__":
    main()
