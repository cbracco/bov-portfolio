'use strict'

//
// Dependencies
//

import gulp from 'gulp'
import gulpLoadPlugins from 'gulp-load-plugins'
import browserSync from 'browser-sync'
import del from 'del'
import runSequence from 'run-sequence'
import util from 'gulp-util'

//
// Configuration
//

const plugins = gulpLoadPlugins()

const config = {
  assets: 'assets',
  dest: 'dest'
}

//
// Tasks
//

// Default
gulp.task('default', ['serve'])

// Serve
gulp.task('serve', ['build'], () => {
  // initialize browser-sync for .dev|docs/
  browserSync.init({
    server: {
      baseDir: config.dest,
      reloadOnRestart: true,
      open: false
    }
  })

  // watch for file changes and inject|reload
  gulp.watch(config.assets + '/**/*.{gif,jpg,jpeg,png,svg}', ['images', browserSync.reload])
  gulp.watch(config.assets + '/**/*.scss', ['styles'])
  gulp.watch(['index.html', config.assets + '/**/*.js'], ['html', browserSync.reload])
})

// Build
gulp.task('build', (callback) => {
  runSequence(
    'clean',
    [
      'html',
      'scripts',
      'styles'
    ],
    'images',
    callback
  )
})

// Clean
// Remove generated folders and files
gulp.task('clean', () => {
  return del.sync(config.dest)
})

// HTML
gulp.task('html', () => {
  return gulp.src('index.html')
    .pipe(gulp.dest(config.dest))
})

// Images
gulp.task('images', () => {
  return gulp.src(config.assets + '/**/*.{gif,jpg,jpeg,png,svg}')
    .pipe(plugins.changed(config.dest + '/assets/'))
    .pipe(plugins.imagemin())
    .pipe(gulp.dest(config.dest + '/assets/'))
})

// Scripts
gulp.task('scripts', () => {
  return gulp.src([config.assets + '/scripts/libs/**/*.js', config.assets + '/scripts/main.js'])
    .pipe(plugins.concat('bundle.js'))
    .pipe(plugins.uglify().on('error', util.log))
    .pipe(plugins.rename({ suffix: '.min' }))
    .pipe(gulp.dest(config.dest + '/assets/scripts/'))
})

// Styles
gulp.task('styles', () => {
  return gulp.src(config.assets + '/styles/main.scss')
    .pipe(plugins.sass())
    .pipe(plugins.cleanCss())
    .pipe(plugins.rename({
      basename: 'bundle',
      suffix: '.min'
    }))
    .pipe(gulp.dest(config.dest + '/assets/styles/'))
    .pipe(browserSync.reload({ stream: true }))
})

// Deploy
gulp.task('deploy', ['build'], () => {
  return gulp.src(config.dest + '/**/*')
    .pipe(plugins.ghPages())
})
