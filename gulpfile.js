var gulp = require('gulp')
var exec = require('child_process').exec

gulp.task('generate-docs', function (cb) {
  exec('node lib/docsGenerator.js', cb)
})

gulp.task('prepublish', ['generate-docs'])
