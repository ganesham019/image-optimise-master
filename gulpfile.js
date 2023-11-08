const pkg = require("./package.json");
const gulp = require("gulp");
const $ = require("gulp-load-plugins")({
  pattern: ["*"],
  scope: ["devDependencies"],
});
// optimise [jpeg, png, svg, gif] files with imagemin (unlimited)
function imagemin() {
  return gulp
    .src(pkg.paths.src.img + "**/*.{gif,png,jpg,jpeg,svg}")
    .pipe($.newer(pkg.paths.dist.img))
    .pipe(
      $.imagemin(
        [
          $.imagemin.gifsicle({ interlaced: true, optimize: 2 }),
          $.imagemin.mozjpeg({ quality: 65, smooth: 2, progressive: true }),
          $.imageminPngquant({
            quality: [0.5, 0.7],
            speed: 1,
            strip: true,
          }),
          $.imagemin.svgo({
            plugins: [
              { removeViewBox: false },
              { removeDimensions: true },
              { removeRasterImages: true },
            ],
          }),
        ],
        {
          verbose: true,
        }
      )
    )
    .pipe(
      $.size({
        showFiles: true,
        showTotal: false,
      })
    )
    .pipe(gulp.dest(pkg.paths.dist.img));
}

// generate and optimise [webp] files
function webp() {
  return gulp
    .src(pkg.paths.src.img + "**/*.{png,jpg,jpeg}")
    .pipe($.newer(pkg.paths.dist.img))
    .pipe($.webp({}))
    .pipe(
      $.size({
        showFiles: true,
        showTotal: false,
      })
    )
    .pipe(gulp.dest(pkg.paths.dist.img));
}

// combo task assigned to npm run command
exports.imageoptimise = gulp.series(webp, imagemin);
exports.imageoptimisewebp = gulp.series(webp);
exports.imageoptimiseimage = gulp.series(imagemin);
