var gulp = require('gulp'),
    path = require('path'),
    spawn = require('child_process').spawn,
    browserSync = require('browser-sync'),
    jasmineNode = require('gulp-jasmine-node'),
    node;


gulp.task('server', function() {
  if (node) node.kill()
  node = spawn('node', ['app.js'], {stdio: 'inherit'})
  node.on('close', function (code) {
    if (code === 8) {
      gulp.log('Error detected, waiting for changes...');
    }
  });
})

gulp.task('browser-sync', function() {
	browserSync.init(null, {
		proxy: "http://localhost:8000",
        files: ["public/**/*.*"],
        browser: "google chrome",
        port: 8000,
	});
});

gulp.task('test', function () {
  return gulp.src(['spec/*[sS]pec.js']).pipe(jasmineNode({
      timeout: 10000
  }));
});

gulp.task('dev',function() {
  process.env.PORT="8000";
  gulp.run('default')
  gulp.run('browser-sync')
});

gulp.task('default', function() {
  gulp.run('server')

  gulp.watch(['./app.js', './api/**/*.js', './core/**/*.js'], function() {
    gulp.run('server')
  })

})

// clean up if an error goes unhandled.
process.on('exit', function() {
    if (node) node.kill()
})
