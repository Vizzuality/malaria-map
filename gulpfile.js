var gulp = require('gulp');

var server = require('gulp-server-livereload');
gulp.task('server', function() {
  gulp.src('./').pipe(server({ livereload: true, port: 9000 }));
});
