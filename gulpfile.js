const gulp = require('gulp');
const del = require('del');
const browserSync = require('browser-sync').create();
const size = require('gulp-size');
const sourcemaps = require('gulp-sourcemaps');
const sass = require('gulp-sass')(require('sass'));
const autoprefixer = require('gulp-autoprefixer');
const rename = require("gulp-rename");
const babel = require('gulp-babel');
const uglify = require('gulp-uglify');
const concat = require('gulp-concat');
const newer = require('gulp-newer');
const imagemin = require('gulp-imagemin');

const path = {
    html: {
        src: 'src/*.html',
        dest: 'dist'
    },
    style: {
        src: ['src/sass/**/*.scss', 'src/sass/**/*.sass'],
        dest: 'dist/css'
    },
    script: {
        src: 'src/js/**/*.js',
        dest: 'dist/js'
    },
    images: {
        src: 'src/img/**/*',
        dest: 'dist/img'
    },
};

function clean() {
    return del(['dist/*', '!dist/img']);
}

function html() {
    return gulp.src(path.html.src)
        .pipe(size({
            showFiles:true
        }))
        .pipe(gulp.dest(path.html.dest))
        .pipe(browserSync.stream());
}

function styles() {
    return gulp.src(path.style.src)
        .pipe(sourcemaps.init())
        .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
        .pipe(autoprefixer({
			cascade: false
		}))
        .pipe(rename({
            basename: 'style',
            suffix: '.min'
        }))
        .pipe(sourcemaps.write('.'))
        .pipe(size({
            showFiles:true
        }))
        .pipe(gulp.dest(path.style.dest))
        .pipe(browserSync.stream());
}

function scripts() {
    return gulp.src(path.script.src)
        .pipe(sourcemaps.init())
        .pipe(babel({
            presets: ['@babel/env']
        }))
        .pipe(uglify())
        .pipe(concat('main.min.js'))
        .pipe(sourcemaps.write('.'))
        .pipe(size({
            showFiles:true
        }))
        .pipe(gulp.dest(path.script.dest))
        .pipe(browserSync.stream());
}

function img() {
    return gulp.src(path.images.src)
    .pipe(newer(path.images.dest))
    .pipe(imagemin())
    .pipe(size({
        showFiles:true
    }))
    .pipe(gulp.dest(path.images.dest));
}

function watch() {
    browserSync.init({
        server: {
            baseDir: "./dist"
        }
    });
    gulp.watch(path.html.dest).on('change', browserSync.reload);
    gulp.watch(path.html.src, html);
    gulp.watch(path.style.src, styles);
    gulp.watch(path.script.src, scripts);
    gulp.watch(path.images.src, img);
}


exports.clean = clean;
exports.html = html;

exports.watch = watch;
exports.default = gulp.series(clean, html, gulp.parallel(styles, scripts, img), watch);