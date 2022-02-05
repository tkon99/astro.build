import { parse, isBefore } from 'date-fns';

export async function getAllPosts() {
  const files = await import.meta.glob("./blog/**/*.md");
  const posts = (
    await Promise.all(
      Object.values(files).map((importFile: any, index) =>
        importFile().then((res) => {
          const { title, description, authors, publishDate } = res.frontmatter;
          const href = Object.keys(files)
            [index].replace(/^\./, "")
                .replace(/\.md$/, "");
          return {
            title,
            description,
            authors,
            publishDate: parse(publishDate, "MMMM d, yyyy", new Date()),
            href,
          };
        })
      )
    )
  ).sort((a, b) => {
    if (isBefore(a.publishDate, b.publishDate)) return 1;
    if (isBefore(b.publishDate, a.publishDate)) return -1;
    return 0;
  });
  return posts;
}


export async function getAllLegalPages() {
  const files = await import.meta.glob("./legal/**/*.md");
  const posts = 
    await Promise.all(
      Object.values(files).map((importFile: any) => importFile())
    );
  return posts;
}
