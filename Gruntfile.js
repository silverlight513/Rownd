/*global module:false*/
module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    // Metadata.
    pkg: grunt.file.readJSON('package.json'),
    banner: '/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> */',

    less: {
      dev: {
        files: {
          "style.css" : "styles/style.less"
        }
      }
    },

    uglify: {
      scripts: {
        files: {
          'libs/main.min.js' : ['node_modules/jquery/dist/jquery.min.js', 'scripts/main.js']
        }
      }
    },

    cssmin: {
      target: {
        files: {
          'style.min.css': ['style.css']
        }
      }
    },

    watch: {
      less: {
        files: ['styles/*.less'],
        tasks: ['less', 'cssmin']
      },
      js: {
        files: ['scripts/*.js'],
        tasks: ['uglify']
      }
    }

  });

  // Load all of Grunt's dependencies
  require('matchdep')
    .filterDev('grunt-*')
    .forEach(grunt.loadNpmTasks);

  grunt.registerTask('default', [
    'uglify',
    'less',
    'cssmin',
    'watch']
  );

};