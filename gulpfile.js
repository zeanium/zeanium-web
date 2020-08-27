var gulp = require('gulp'),
	uglify = require('gulp-uglify'),
	concat = require('gulp-concat');

gulp.task('uglify', function(){
	return gulp.src(['src/*.js'])
		.pipe(uglify())
		.pipe(gulp.dest('dist/minx'));
});

gulp.task('concat', gulp.series('uglify', function () {
	return gulp.src(['src/Cookie.js', 'src/Data.js', 'src/DOM.js', 'src/Draggable.js', 'src/Http.js', 'src/Store.js'])
		.pipe(concat('zn.web.js'))
		.pipe(gulp.dest('dist/'));
}));

gulp.task('concat-minx', gulp.series('uglify', function () {
	return gulp.src(['dist/minx/Cookie.js', 'dist/minx/Data.js', 'dist/minx/DOM.js', 'dist/minx/Draggable.js', 'dist/minx/Http.js', 'dist/minx/Store.js'])
		.pipe(concat('zn.web.minx.js'))
		.pipe(gulp.dest('dist/'));
}));

//建立一个默认执行的任务，这个任务顺序执行上面创建的N个任务
gulp.task('default', gulp.series('concat', 'concat-minx'));