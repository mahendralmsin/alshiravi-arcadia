// Import required plugins
const gulp = require("gulp");
const sass = require("gulp-sass")(require("sass"));
const autoprefixer = require("gulp-autoprefixer");
const cleanCSS = require("gulp-clean-css");
const uglify = require("gulp-uglify");
const htmlmin = require("gulp-htmlmin");
const imagemin = require("gulp-imagemin");
const concat = require("gulp-concat");
const rename = require("gulp-rename");
const browserSync = require("browser-sync").create();
const del = require("del");
const fileInclude = require("gulp-file-include");

// Paths to project folders
const paths = {
  html: {
    src: "src/**/*.html",
    dest: "dist/",
  },
  styles: {
    src: "src/css/**/*.scss",
    dest: "dist/css/",
  },
  scripts: {
    src: "src/js/**/*.js",
    dest: "dist/js/",
  },
  images: {
    src: "src/images/**/*",
    dest: "dist/images/",
  },
};

// Clean the dist folder
function clean() {
  return del(["dist"]);
}

// Compile SCSS to CSS
function styles() {
  return gulp
    .src(paths.styles.src)
    .pipe(sass().on("error", sass.logError))
    .pipe(autoprefixer({ cascade: false }))
    .pipe(cleanCSS())
    .pipe(rename({ suffix: ".min" }))
    .pipe(gulp.dest(paths.styles.dest))
    .pipe(browserSync.stream());
}

// Minify and include HTML partials
function html() {
  return gulp
    .src(["src/*.html"])
    .pipe(
      fileInclude({
        prefix: "@@",
        basepath: "@file",
      })
    )
    .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(gulp.dest(paths.html.dest))
    .pipe(browserSync.stream());
}

// Minify and copy JavaScript
function scripts() {
  return gulp
    .src(paths.scripts.src)
    .pipe(concat("app.js"))
    .pipe(uglify())
    .pipe(rename({ suffix: ".min" }))
    .pipe(gulp.dest(paths.scripts.dest))
    .pipe(browserSync.stream());
}

// Optimize images
function images() {
  return gulp
    .src(paths.images.src)
    .pipe(imagemin())
    .pipe(gulp.dest(paths.images.dest));
}

// Watch files for changes
function watchFiles() {
  browserSync.init({
    server: {
      baseDir: "./dist",
    },
  });
  gulp.watch(paths.styles.src, styles);
  gulp.watch(paths.scripts.src, scripts);
  gulp.watch("src/**/*.html", html);
  gulp.watch(paths.images.src, images);
}

// Define complex tasks
const build = gulp.series(clean, gulp.parallel(styles, scripts, html, images));
const watch = gulp.series(build, watchFiles);

// Export tasks
exports.clean = clean;
exports.styles = styles;
exports.scripts = scripts;
exports.html = html;
exports.images = images;
exports.build = build;
exports.watch = watch;
exports.default = build;
