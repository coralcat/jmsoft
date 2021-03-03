const gulp = require('gulp')
const nodemon = require('gulp-nodemon')
const browserSync = require('browser-sync')
const babel = require('gulp-babel')
const scss = require('gulp-sass')
const autoprefixer = require('gulp-autoprefixer')
const sourcemaps = require('gulp-sourcemaps')
const del = require('del')
const ghPages = require('gulp-gh-pages')
const nunjucks = require('gulp-nunjucks-render')

const PATH = {
    HTML: './src',
    ASSETS: {
        FONTS: './src/assets/fonts',
        STYLE: './src/assets/css',
        IMAGES: './src/assets/images',
        SCRIPT: './src/assets/js',
        LIB: './src/assets/lib'
    }
}

const DEST_PATH = {
    HTML: './dist',
    ASSETS: {
        FONTS: './dist/assets/fonts',
        STYLE: './dist/assets/css',
        IMAGES: './dist/assets/images',
        SCRIPT: './dist/assets/js',
        LIB: './dist/assets/lib'
    }
}


gulp.task('library', () => {
    return gulp.src(PATH.ASSETS.LIB + '/*.js')
        .pipe(gulp.dest(DEST_PATH.ASSETS.LIB))
})


gulp.task('fonts', () => {
    return gulp.src(PATH.ASSETS.FONTS + '/*.*')
        .pipe(gulp.dest(DEST_PATH.ASSETS.FONTS))
})

gulp.task('images', () => {
    return gulp.src(PATH.ASSETS.IMAGES + '/*.*')
        .pipe(gulp.dest(DEST_PATH.ASSETS.IMAGES))
        .pipe(browserSync.reload({stream: true}))
})

gulp.task('scss', () => {
    const options = {
        outputStyle: 'nested',
        indentType: 'space',
        indentWidth: 4,
        precision: 8,
        sourceComments: true
    }
    return gulp.src(PATH.ASSETS.STYLE + '/**/*.scss')
        .pipe(sourcemaps.init())
        .pipe(scss(options))
        .pipe(autoprefixer({cascade: false}))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(DEST_PATH.ASSETS.STYLE))
        .pipe(browserSync.reload({stream: true}))
})

gulp.task('script', () => {
    return gulp.src(PATH.ASSETS.SCRIPT + '/*.js')
        .pipe(babel({
            "presets": [
                "@babel/preset-env"
            ]
        }))
        .pipe(gulp.dest(DEST_PATH.ASSETS.SCRIPT))
        .pipe(browserSync.reload({stream: true}))
})

gulp.task('html', () => {
    return gulp
        .src(PATH.HTML + '/**/*.html')
        .pipe(nunjucks({
            path: ['./src/templates']
        }))
        .pipe(gulp.dest(DEST_PATH.HTML))
        .pipe(browserSync.reload({stream: true}))
})

gulp.task('clean', () => {
    return del(DEST_PATH.HTML)
})

gulp.task('nodemon', cb => {
    let started = false;
    return nodemon({
        script: 'server.js'
    }).on('start', () => {
        if (!started) {
            cb();
            started = true;
        }
    });
});

gulp.task('browser-sync', gulp.series('nodemon', () => {
        browserSync.init(null, {
            proxy: 'http://localhost:8005',
            port: 8006
        });
    })
);

gulp.task('watch', () => {
    gulp.watch(PATH.HTML + '/**/*.html', gulp.series(['html']))
    gulp.watch(PATH.ASSETS.STYLE + '/**/*.scss', gulp.series(['scss']))
    gulp.watch(PATH.ASSETS.SCRIPT + '/**/*.js', gulp.series(['script']))
})


gulp.task('deploy', () => {
    return gulp
        .src('./dist/**/*')
        .pipe(ghPages())
})

const series = gulp.series([
    'clean',
    'library',
    'images',
    'scss',
    'fonts',
    'script',
    'html',
    gulp.parallel('browser-sync', 'watch')
])


gulp.task('default', series)
