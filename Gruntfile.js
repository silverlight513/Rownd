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

    watch: {
      less: {
        files: ['styles/*.less'],
        tasks: ['less']
      }
    }

  });

  // Load all of Grunt's dependencies
  require('matchdep')
    .filterDev('grunt-*')
    .forEach(grunt.loadNpmTasks);

  grunt.registerTask('default', [
    'less',
    'watch']
  );

};