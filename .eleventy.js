import EleventyVitePlugin from "@11ty/eleventy-plugin-vite";
import Image from "@11ty/eleventy-img";
import path from "path";
import fs from "fs";

// Simple Vite plugin to copy non-HTML files (like sitemap.xml) after build
function copyNonHtmlFiles() {
  return {
    name: 'copy-non-html-files',
    closeBundle() {
      const eleventyTempDir = path.resolve(process.cwd(), '.11ty-vite');
      const outputDir = path.resolve(process.cwd(), 'dist');
      const filesToCopy = ['sitemap.xml', 'robots.txt'];

      filesToCopy.forEach(file => {
        const src = path.join(eleventyTempDir, file);
        const dest = path.join(outputDir, file);
        if (fs.existsSync(src)) {
          fs.copyFileSync(src, dest);
        }
      });
    }
  };
}

export default function (eleventyConfig) {
  // Vite Plugin with configuration
  eleventyConfig.addPlugin(EleventyVitePlugin, {
    viteOptions: {
      publicDir: "public", // Static assets copied as-is
      plugins: [copyNonHtmlFiles()],
      build: {
        emptyOutDir: false, // Preserve Eleventy files
        rollupOptions: {
          input: {
            main: path.resolve(process.cwd(), "src/assets/js/main.js"),
          },
        },
      },
      server: {
        middlewareMode: true,
        host: '0.0.0.0',
        fs: {
          allow: [process.cwd()],
          strict: false
        }
      }
    },
  });

  // Copy static assets with proper path mapping
  // Vite will process CSS through PostCSS/Tailwind during build
  eleventyConfig.addPassthroughCopy({ "src/assets/images": "assets/images" });
  eleventyConfig.addPassthroughCopy({ "src/assets/fonts": "assets/fonts" });
  eleventyConfig.addPassthroughCopy({ "src/assets/css": "assets/css" });
  eleventyConfig.addPassthroughCopy({ "src/assets/js": "assets/js" });

  // Watch targets
  eleventyConfig.addWatchTarget("src/assets/css/");
  eleventyConfig.addWatchTarget("src/assets/js/");

  // Shortcode for current year
  eleventyConfig.addShortcode("year", () => `${new Date().getFullYear()}`);

  // Custom filter to find item by attribute value
  eleventyConfig.addFilter("find", function (array, attr, value) {
    if (!array || !Array.isArray(array)) return null;
    return array.find(item => item[attr] === value);
  });

  // Date filter with multiple format support
  eleventyConfig.addFilter("date", function (date, format) {
    const d = new Date(date);
    if (format === "%Y-%m-%d") {
      return d.toISOString().split('T')[0];
    }
    if (format === "%B %d, %Y") {
      return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    }
    if (format === "%B %Y") {
      return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long' });
    }
    return d.toISOString();
  });

  // Head filter - limit array to first N items
  eleventyConfig.addFilter("head", function (array, n) {
    if (!array || !Array.isArray(array)) return [];
    return array.slice(0, n);
  });

  // Title case filter
  eleventyConfig.addFilter("titleCase", function (str) {
    if (!str) return '';
    return str.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  });

  // Responsive image shortcode — AVIF/WebP/JPEG with srcset, async-generated at build time.
  // Usage: {% image "src/assets/images/people/founder.png", "Manish K Sah, Founder & CEO", "50vw" %}
  //
  // KNOWN QUIRK: files these shortcodes generate must already exist on disk before Vite's
  // asset-graph scan runs, or Vite won't discover/hash/copy them into dist and every <img>
  // referencing them 404s. Vite scans BEFORE this same build's template pass finishes writing
  // them. `npm run build` therefore runs eleventy twice — pass 1 generates the files (and may
  // produce a dist/ with broken image refs, which is fine, it's discarded), pass 2 finds them
  // already on disk and Vite hashes them correctly. eleventy-img caches by content hash, so
  // the second pass is fast, not a full re-encode. Do not "simplify" this to a single build.
  eleventyConfig.addAsyncShortcode("image", async function (src, alt, sizes = "100vw", widths = [480, 768, 1200, 1800]) {
    if (!alt && alt !== "") {
      throw new Error(`Missing alt text for image: ${src}`);
    }
    // Output lands inside src/assets/images/optimized/ — the SAME tree already covered
    // by the existing `addPassthroughCopy({ "src/assets/images": "assets/images" })` rule
    // below. A separate top-level cache dir (e.g. .image-cache/) does NOT reliably survive
    // this Vite plugin's build (its passthrough-copy target and the plugin's actual working
    // dir disagree) — proven by testing. Generated, so it's gitignored; safe to delete anytime.
    const metadata = await Image(src, {
      widths: [...widths, null], // null = original width, for the fallback
      formats: ["avif", "webp", "jpeg"],
      outputDir: "./src/assets/images/optimized/",
      urlPath: "/assets/images/optimized/",
      filenameFormat: (id, srcPath, width, format) => {
        const name = path.basename(srcPath, path.extname(srcPath));
        return `${name}-${width}w.${format}`;
      },
    });
    const fallback = metadata.jpeg[metadata.jpeg.length - 1];
    return Image.generateHTML(metadata, {
      alt,
      sizes,
      loading: "lazy",
      decoding: "async",
      width: fallback.width,
      height: fallback.height,
    });
  });

  // Same as above but eager + high fetch priority, for the one hero-critical image per page.
  eleventyConfig.addAsyncShortcode("imageEager", async function (src, alt, sizes = "100vw", widths = [480, 768, 1200, 1800]) {
    const metadata = await Image(src, {
      widths: [...widths, null],
      formats: ["avif", "webp", "jpeg"],
      outputDir: "./src/assets/images/optimized/",
      urlPath: "/assets/images/optimized/",
      filenameFormat: (id, srcPath, width, format) => {
        const name = path.basename(srcPath, path.extname(srcPath));
        return `${name}-${width}w.${format}`;
      },
    });
    const fallback = metadata.jpeg[metadata.jpeg.length - 1];
    return Image.generateHTML(metadata, {
      alt,
      sizes,
      loading: "eager",
      fetchpriority: "high",
      decoding: "async",
      width: fallback.width,
      height: fallback.height,
    });
  });

  return {
    dir: {
      input: "src",
      output: "dist",
      includes: "_includes",
      layouts: "_includes/layouts",
      data: "_data",
    },
    templateFormats: ["njk", "md", "html"],
    htmlTemplateEngine: "njk",
    markdownTemplateEngine: "njk",
  };
}
