/* todo en uno y lo minifica*/
// const gulp = require('gulp');
// const sass = require("gulp-sass");
// const concat = require('gulp-concat');
// const cssmin = require('gulp-cssmin');
// const rename = require('gulp-rename');

// gulp.task("default", () =>{
// 	console.log('corre')
// })

// gulp.task('sass', function () {
//   return gulp.src('src/style/**/*.css')
//     .pipe(sass().on('error', sass.logError))
//     .pipe(concat('all.css'))
//     .pipe(cssmin())
//     .pipe(rename({suffix: '.min'}))
//     .pipe(gulp.dest('dist/css'));
// });
/* todo en uno y lo minifica*/





/* minifica y usa solo las clases que se usan en los html*/
const gulp = require('gulp');
const uncss = require('gulp-uncss');
const sass = require('gulp-sass');
const concat = require('gulp-concat');
const nano = require('gulp-cssnano');
const clean = require('gulp-clean');

/*para comprimir imagenes*/
const imagemin = require('gulp-imagemin'); //Compresor de imágenes  
const imageminPngcrush = require('imagemin-pngcrush'); //Optimiza las imágenes .PNG  
const watch = require('gulp-watch'); //Sirve para mantener vigilando los cambios de una tarea  
const notify = require('gulp-notify'); //Muestra un mensaje callback


gulp.task('clean', function () {
    return gulp.src('dist/css/all.css', {read: false})
        .pipe(clean());
});

gulp.task('uncss', function () {
    return gulp.src('src/style/**/*.css')
        .pipe(sass().on('error', sass.logError))
        .pipe(concat('all.css'))
        .pipe(uncss({
            html: ['views/**/*.html']
        }))
        .pipe(nano())
        .pipe(gulp.dest('dist/css'));
});

/*ESCUCHA TODOS LOS CAMBISO EN CSS*/
gulp.task('default', () =>{
	gulp.watch('src/style/**/*.css',['uncss']);
});

/*ejecuta las 2 tareas "en caso de error de permisos al eliminar archivos"*/
gulp.task('all',['clean','uncss']);









//Tarea para Comprimir Imagenes
gulp.task('comprimir-imagenes', function(){  
    return watch('./images/**/*', function () { //Comprueba si hay cambios en la carpeta y subcarpetas de images
        gulp.src('./images/*.{png,jpg,jpeg,gif,svg}') //Ruta donde buscara las imágenes con extensiones .{png,jpg,jpeg,gif,svg} a comprimir
        .pipe(
            imagemin({
              plugins:[imageminPngcrush()] //Optimiza la conversión de imágenes PNG
            }))
        .pipe(gulp.dest('dist/images')) //Ruta donde se guardaran la imágenes comprimidas
        .pipe(notify("Ha finalizado la compresión de imágenes!")); //Muestra un mensaje cuando termina la tarea
    });
});

//Tarea por Defecto
gulp.task('images',['comprimir-images']);  
