/*eslint no-const: "off"*/
const gulp = require('gulp');
const sourcemaps = require('gulp-sourcemaps');
const babel = require('gulp-babel');
const eslint = require('gulp-eslint');
const size = require('gulp-size');
const del = require('del');
const child_process = require('child_process');

const serverDir = 'server';
const buildDir = 'dist';

const serverModules = [
    `${serverDir}/**/*.js`,
    `${serverDir}/config/**/*`,
    `${serverDir}/views/**/*`
];

const serverScript = `${buildDir}/${serverDir}/server.js`;

// build server modules
gulp.task('build:server', ['lint:server', 'copy:server'], () => {
    return gulp.src('server/**/*.js')
        .pipe(sourcemaps.init())
        .pipe(babel())
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(`${buildDir}/${serverDir}`));
});

gulp.task('copy:server', ()=> {
    return gulp.src([`${serverDir}/config/**/*`, `${serverDir}/views/**/*`] , {base: `${serverDir}`})
        .pipe(gulp.dest(`${buildDir}/${serverDir}`))
});

// lint server modules
gulp.task('lint:server', () => {
    return gulp.src(`${serverDir}/**/*.js`)
        .pipe(eslint())
        .pipe(eslint.format());
});

//clean dist server modules
gulp.task('clean', ()=> {
    return del([`${buildDir}/${serverDir}`]);
});

//alternative for building server-side scripts
gulp.task('build', ['build:server'], () => {
    return gulp.src(`${buildDir}/${serverDir}/**/*`)
        .pipe(size({title: 'build', gzip: true}));
});

//build and watch server modules for changes
gulp.task('watch', ['build'], () => {
    return gulp.watch(serverModules, ['build']);
});

//set the default task (build only server modules)
gulp.task('default', ['clean'], () => {
    return gulp.start('build');
});

gulp.task('serve', ['build'], function() {
    let server, options, execArgv = [];
    //get debug argument
    const debug = process.execArgv.filter(function(x) { return /^--inspect(-brk)?=\d+$/.test(x); })[0];
    //if process is running in debug mode (--debug or --debug-brk arguments)
    if (debug) {
        //find debug port
        const debugPort = parseInt(/^--inspect(-brk)?=(\d+)$/.exec(debug)[2]);
        //get execution arguments except --debug or --debug-brk
        execArgv = process.execArgv.filter(function(x) { return !/^--inspect(-brk)?=\d+$/.test(x); }).splice(0);
        //push debug argument (while increasing debug port by 1)
        execArgv.push(debug.substr(0,debug.indexOf('=')+1)+(debugPort+1));
    }
    else {
        //otherwise get execution arguments
        execArgv = process.execArgv.splice(0);
    }
    //build child process options
    options = {
        //get parent process env variables
        env:process.env,
        //get execution arguments
        execArgv:execArgv
    };
    //start child process (an express application)
    server = child_process.fork(serverScript,options);
    //watch for server module changes
    return gulp.watch(serverModules, function() {
        //wait for process to exit
        server.on('exit', function() {
            //build server
            gulp.run('build', function() {
                //start child process (express application)
                server = child_process.fork(serverScript,options);
            });
        });
        //kill child process and wait to build server again
        server.kill("SIGINT");
    });
});