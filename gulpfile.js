'use strict';

var autoprefixer = require('autoprefixer');
var csso = require('gulp-csso');
var del = require('del');
var gulp = require('gulp');
var concat = require('gulp-concat');
var terser = require('gulp-terser');
var livereload = require('gulp-livereload');
var sourcemaps = require('gulp-sourcemaps');
var postcss = require('gulp-postcss');
var gulp = require('gulp');
var compress_images = require('compress-images');
 
// Gulp task to minify CSS files
gulp.task('styles', function () {
  return gulp.src('./src/styles/**/*.css')
    // Auto-prefix css styles for cross browser compatibility
    .pipe(sourcemaps.init())
    .pipe(postcss([autoprefixer()]))
    .pipe(sourcemaps.write('.'))
    // Minify the file
    .pipe(csso())
    // Output
    .pipe(concat('merged.min.css'))
    .pipe(gulp.dest('./src/dist/css'))
    .pipe(livereload());
});

// Gulp task to minify JavaScript files
gulp.task('scripts', function() {
  return gulp.src('./src/js/**/*.js')
    // Minify the file
    .pipe(concat('merged.min.js'))
    .pipe(terser())
    // Output
    .pipe(gulp.dest('./src/dist/js'))
});

// We will be compressing images [jpg] with two algorithms, [webp] and [jpg];
// gulp compress_images
gulp.task('compress_images', async function() {
  return compress_images('./src/assets/img/**/*.{jpg,JPG,jpeg,JPEG,png,svg}', './src/dist/img/', {compress_force: false, statistic: true, autoupdate: true}, false,
    {jpg: {engine: 'webp', command: false}},
    {png: {engine: 'webp', command: false}},
    {svg: {engine: 'svgo', command: '--multipass'}},
    {gif: {engine: false, command: false}}, function(err) { 
      if (err === null){ 
        console.log("Success")
      } else{
        console.error(err);
    }
  });
});

gulp.task('watch', function () {
  livereload.listen();
  gulp.watch('./src/js/**/*.js', gulp.series('scripts'));
  gulp.watch('./src/styles/**/*.css',gulp.series('styles'));
});

// Clean output directory
gulp.task('clean', () => del(['dist']));

// Gulp task to minify all files
gulp.task('default', gulp.series('clean','styles', 'scripts', 'compress_images'));