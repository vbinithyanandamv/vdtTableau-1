const gulp = require('gulp');
const babel = require('gulp-babel');
const sass = require('gulp-sass');
const concat = require("gulp-concat");
const ts = require('gulp-typescript');
const del = require('del');
const umd = require('gulp-umd');

sass.compiler = require('node-sass');

function cleanDist() {
	return del([
		'./dist',
		'./css',
	])
}

// function compileBabel() {
// 	return gulp.src(['src/**/*.tsx', 'src/**/*.ts'])
// 		.pipe(babel())
// 		.pipe(gulp.dest('dist/'))
// }

function buildTypes() {
	var tsProject = ts.createProject('./tsconfig.json', {
		declaration: true,
	});

	var tsResult = tsProject.src()
		.pipe(tsProject());

	return tsResult.dts.pipe(gulp.dest('dist/types'));
}

function concatTypes() {
	return gulp
		.src([
			'dist/types/**/*.d.ts'
		])
		.pipe(concat("index.d.ts"))
		.pipe(gulp.dest("./dist"));
}

function moveLib(){
	return gulp.src(['node_modules/@visualbi/vdt/**/*']).pipe(gulp.dest('dist/public/lib/vdt'));
}
function moveEditorCss() {
	return gulp.src(['node_modules/@visualbi/vdt-editor/dist/css/*.css']).pipe(gulp.dest('dist/public/css'));
}
function moveCss() {
	return gulp.src(['public_code/**/*.css']).pipe(gulp.dest('dist/public/css'));
}

function copyPublic(){
	return gulp.src(['public_code/**/*']).pipe(gulp.dest('dist/public'));
}

function copyTrex(){
	return gulp.src(['*.trex']).pipe(gulp.dest('dist/'));
}

function compileSCSS() {
	return gulp.src('src/styles/*.scss')
		.pipe(sass().on('error', sass.logError))
		.pipe(gulp.dest('css'));
}

function copyCSS() {
	return gulp.src(['src/styles/*.css'])
		.pipe(gulp.dest('css/'))
}

const compileCSS = gulp.series(compileSCSS, copyCSS);
const copyFiles = gulp.series(copyPublic, moveLib, moveEditorCss, moveCss, copyTrex);
const generateTypes = gulp.series(buildTypes, concatTypes);

exports.build = gulp.series(cleanDist, copyFiles, generateTypes);