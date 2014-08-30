module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    jshint: {
      options: {
        jshintrc: true,
      },
      all: {
        files: {
          src: [
            "Gruntfile.js",
            "app/**/*.js",
            "test/**/*.js"
          ]
        }
      }
    },

    mocha: {
      options: {
        reporter: 'Nyan', // Duh!
        run: true
      }
    }
  });

  grunt.loadNpmTasks("grunt-contrib-jshint");
  grunt.loadNpmTasks("grunt-mocha");

  grunt.registerTask("lint", ["jshint"]);
  grunt.registerTask("test", "Run Mocha tests.", function() {
    // If not --test option is specified, run all tests.
    var test_case = grunt.option("test") || "**/*";

    grunt.config.set("mocha.browser", ["test/" + test_case + ".html"]);
    grunt.task.run("mocha");
  });
};
