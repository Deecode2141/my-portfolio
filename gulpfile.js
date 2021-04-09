const { src, dest, watch, series, parallel } = require('gulp');
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const browserSync = require('browser-sync').create();
const reload = browserSync.reload;
const cleanCSS = require('gulp-clean-css');
const sourcemaps = require('gulp-sourcemaps');
const imagemin = require('gulp-imagemin');
const concat = require('gulp-concat');
const terser = require('gulp-terser');


function compileSass(done) {
  src('./src/scss/**/*.scss')
  .pipe(sass().on('error', sass.logError))
  .pipe(autoprefixer({
            overrideBrowserslist: ['last 2 versions']
        }))
  .pipe(dest('./dist/css'))
  .pipe(browserSync.stream())
 done();
}

function browsersyncServe(cb) {
    browserSync.init({
        server: './dist',
        notify: false,
        open: false
    })
    cb();
}

function browsersyncReload(cb) {
    browserSync.reload();
    cb();
}

function watchSass() {
   watch('./src/scss/**/*.scss', series(compileSass, browsersyncReload))
}

function minifyCss(done) {
  src('./dist/css/*.css')
  .pipe(sourcemaps.init())
  .pipe(cleanCSS())
  .pipe(sourcemaps.write())
  .pipe(dest('./dist/css'))
 done();
}

function imgTask(done){
  src('src/images/*')
  .pipe(imagemin())
  .pipe(dest('dist/images'))
  done();
}

function jsTask(done){
  src('src/js/**/*.js')
  .pipe(sourcemaps.init())
  .pipe(concat('index.js'))
  .pipe(terser())
  .pipe(sourcemaps.write('.'))
  .pipe(dest('dist/js'))
  done();
}


exports.default = series(parallel(
    compileSass,
    browsersyncServe,
    jsTask,
    imgTask
 ),
 watchSass
);

exports.production = series(
    minifyCss
)
