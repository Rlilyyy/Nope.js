var gulp = require("gulp");
var uglify = require("gulp-uglify");
var jshint = require("gulp-jshint");
var rename = require("gulp-rename");

gulp.task("jshint", function() {
    gulp.src("Nope.js")
        .pipe(jshint())
        .pipe(jshint.reporter("default"));
});

gulp.task("compress", function() {
    gulp.src("Nope.js")
        .pipe(rename("Nope.min.js"))
        .pipe(uglify())
        .pipe(gulp.dest("gulpJS/"));
});

gulp.task("default", ["jshint", "compress"]);
