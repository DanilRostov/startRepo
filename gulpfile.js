"use strict"

// Параметры для gulp-autoprefixer
let autoprefixerList = [
    'Chrome >= 45',
	'Firefox ESR',
	'Edge >= 12',
	'Explorer >= 10',
	'iOS >= 9',
	'Safari >= 9',
	'Android >= 4.4',
	'Opera >= 30'
];

// Функция вывода ошибки
function log(error) {
    console.log([
        '',
        "----------ERROR MESSAGE START----------",
        ("[" + error.name + " in " + error.plugin + "]"),
        error.message,
        "----------ERROR MESSAGE END----------",
        ''
    ].join('\n'));
    this.end();
}

// Инициализация Gulp плагинов 
const gulp = require('gulp');
const sass = require('gulp-sass');
const pug = require('gulp-pug');
const browserSync = require('browser-sync');
const autoprefixer = require('gulp-autoprefixer');
const concat = require('gulp-concat');
const sourcemaps = require('gulp-sourcemaps');
const cleanCSS = require('gulp-clean-css');
const uglify = require('gulp-uglify');

// Сборка CSS
gulp.task('sass', () => {
	return gulp.src('./src/scss/style.scss')
		.pipe(sourcemaps.init())
		.pipe(sass().on('error', sass.logError))
		.pipe(autoprefixer({
			browsers: autoprefixerList
		}))
		.pipe(cleanCSS())
		.pipe(sourcemaps.write())
		.pipe(gulp.dest('./dist/css'))
		.pipe(browserSync.reload({stream: true}))
});

// Компиляци Pug в HTML
gulp.task('pug', () => {
	return gulp.src('./src/pug/*.pug')
		.pipe(pug({pretty:true}))
		.on('error', log)
		.pipe(gulp.dest('./dist'))
})

// Сборка JS
gulp.task('scripts', function() {
	return gulp.src('./src/js/*.js')
		.pipe(sourcemaps.init())
		.pipe(concat('index.js'))
		.pipe(uglify())
		.pipe(sourcemaps.write())
		.pipe(gulp.dest('./dist/js'))
		.pipe(browserSync.reload({stream: true}))
});

// Запуск сервера
gulp.task('browser-sync', () => {
    browserSync({
        server: {baseDir: 'dist'},
        notify: false
    });
});

// Задача start
gulp.task('s', ['browser-sync', 'scripts', 'sass', 'pug'], () => {
	gulp.watch('./src/js/*.js', ['scripts']);
	gulp.watch('./src/pug/**/*.pug', ['pug']);
	gulp.watch('./src/scss/*.scss', ['sass']);
	gulp.watch('./dist/*.html', browserSync.reload);
});