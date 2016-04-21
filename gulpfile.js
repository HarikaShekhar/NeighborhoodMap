// Load plugins
var gulp = require('gulp'),
    htmlmin   = require('gulp-htmlmin'),
    cssnano = require('gulp-cssnano'),
    jshint = require('gulp-jshint'),
    uglify = require('gulp-uglify'),
    imagemin = require('gulp-imagemin'),
    del = require('del');

//Paths
var paths = {
    "all": "dist/*",
    "build": "dist/",
    "html": {
        "source": "*.html",
        // "target": "/"
    },
    "styles": {
        "source": "styles/styles.css",
        "target": "styles"
    },
    "scripts": {
        "source": "scripts/js/app.js",
        "target": "scripts/js"
    },
    "libs": {
        "source": "scripts/libs/*.js",
        "target": "scripts/libs"
    },
    "images": {
        "source": "images/*",
        "target": "images"
    }
};

//html minify
gulp.task('html', function() {
    return gulp.src(paths.html.source)
    .pipe(htmlmin({ collapseWhitespace: true, removeComments: true }))
    .pipe(gulp.dest(paths.build));
});

//styles minify
gulp.task('styles', function() {
    return gulp.src(paths.styles.source)
    .pipe(cssnano())
    .pipe(gulp.dest(paths.build + paths.styles.target));
});

//scripts minify
gulp.task('scripts', function() {
    return gulp.src(paths.scripts.source)
    .pipe(jshint())
    .pipe(jshint.reporter('default'))
    .pipe(uglify())
    .pipe(gulp.dest(paths.build + paths.scripts.target));
});

//copies libraries
gulp.task('libs', function() {
    return gulp.src(paths.libs.source)
    .pipe(uglify())
    .pipe(gulp.dest(paths.build + paths.libs.target));
});

//images compression
gulp.task('images', function() {
    return gulp.src(paths.images.source)
    .pipe(imagemin({
        progressive: true,
        optimizationLevel: 5
    }))
    .pipe(gulp.dest(paths.build + paths.images.target));
});

//clean
gulp.task('clean', function () {
    del([paths.all]);
});

//task creates the build
gulp.task('default', ['clean'], function() {
    gulp.start('html','styles', 'scripts', 'libs', 'images');
});