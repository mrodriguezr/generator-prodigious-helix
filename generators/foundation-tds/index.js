'use strict';
var generators = require('yeoman-generator');
var yosay = require('yosay');
var chalk = require('chalk');
var path = require('path');
var guid = require('node-uuid');

module.exports = generators.Base.extend({

    prompting: function() {
        this.log(yosay(
            'Welcome to the slick ' + chalk.red.bold('Prodigious Helix') + ' generator!'
        ));

        console.log('INFO: .NET Framework 4.5');
        console.log('INFO: MVC 5.2.3');
        console.log('');
        console.log(chalk.red.bold('YOU MUST RUN THIS GENERATOR AS AN ADMINISTRATOR.'));
        console.log('');

        return this.prompt([{
            type: 'input',
            name: 'solutionName',
            message: 'Enter the name of your Solution:',
            default: 'Sitecore'
        }, {
            type: 'input',
            name: 'foundationTitle',
            message: 'Enter the name of your existing Foundation module:'
        }, {
            type: 'input',
            name: 'tdsProject',
            message: 'Enter the name of your TDS module (Content, Core, Master):'
        }, {
            type: 'input',
            name: 'sitecoreDb',
            message: 'Enter the Sitecore database name(core, master):'
        }]).then(function(answers) {
            this.props = answers;
            this.props.tdsGuid = guid.v4();
        }.bind(this));
    },
    writing: function() {
        var targetPath = path.join('src', 'Foundation', this.props.foundationTitle);
        console.log('Target Path: ' + targetPath);
        console.log('');

        // TDS Project
        this.fs.copyTpl(
            this.templatePath('Tds.scproj'),
            this.destinationPath(path.join(targetPath,
                'tds',
                this.props.solutionName + '.Foundation.' + this.props.foundationTitle + '.' + this.props.tdsProject,
                this.props.solutionName + '.Foundation.' + this.props.foundationTitle + '.' + this.props.tdsProject + '.scproj')),
            this.props
        );
    },
    end: function() {
        console.log('');
        console.log('Your TDS project ' + chalk.red.bold(this.props.tdsProject) + ' has been created');
        console.log('');
        console.log('You will need to add your TDS project to your Visual Studio solution.');
        console.log('');
    }
});