module.exports = function(grunt) {
  require('load-grunt-tasks')(grunt); // npm install --save-dev load-grunt-tasks

  grunt.initConfig({
    // this task updates js files when you edit them, debugging for a specific platform
    watch: {
      scripts: {
        files: ['test-www/platforms/windows/www/js/*.js',
          'test-www/platforms/windows/www/index.html'
        ],
        tasks: ['sync'],
        options: {
          spawn: false,
        },
      },
    },
    sync: {
      main: {
        files: [{
          cwd: 'test-www/platforms/windows/www',
          src: [
            '**', /* Include everything */
            '!plugins/**', /* exclude plugins dir */
            '!bower_components/**'
          ],
          dest: 'test-www/www',
        }],
        //pretend: true, // Don't do any IO. Before you run the task with `updateAndDelete` PLEASE MAKE SURE it doesn't remove too much.
        verbose: true // Display log messages when copying files
      }
    }
  });
  grunt.registerTask('default', ["watch"]);
}
