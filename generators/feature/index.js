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
            name: 'featureTitle',
            message: 'Enter the name of your Feature module:'
        }, {
            type: 'confirm',
            name: 'createTdsProject',
            message: 'Create TDS project?:',
            default: true
        }]).then(function(answers) {
            this.props = answers;
            this.props.projectGuid = '{' + guid.v4() + '}';
            this.props.tdsGuid = guid.v4();
        }.bind(this));
    },
    writing: function() {
        var targetPath = path.join('src', 'Feature', this.props.featureTitle);
        console.log('Target Path: ' + targetPath);

        /*********** CODE ***************/
        this.fs.copy(
            this.templatePath('code/**/*'),
            this.destinationPath(path.join(targetPath, 'code'))
        );

        // csproj
        this.fs.copyTpl(
            this.templatePath('Sitecore.Feature.csproj'),
            this.destinationPath(path.join(targetPath, 'code', this.props.solutionName + '.Feature.' + this.props.featureTitle + '.csproj')),
            this.props
        );

        // AssemblyInfo.cs, project
        this.fs.copyTpl(
            this.templatePath('AssemblyInfo.cs'),
            this.destinationPath(path.join(targetPath, 'code', 'Properties', 'AssemblyInfo.cs')), { assemblyName: this.props.solutionName + '.Feature.' + this.props.featureTitle }
        );

        // Publish Profile configuration
        this.fs.copyTpl(
            this.templatePath('Local.pubxml'),
            this.destinationPath(path.join(targetPath, 'code', 'Properties/PublishProfiles', 'Local.pubxml')), { assemblyName: this.props.solutionName + '.Foundation.' + this.props.featureTitle }
        );

        // config
        this.fs.copyTpl(
            this.templatePath('Feature.config'),
            this.destinationPath(path.join(targetPath, 'code', 'App_Config', 'Include/' + this.props.solutionName, 'Feature', 'Feature.' + this.props.featureTitle + '.config')),
            this.props
        );

        // TDS Project
        if (this.props.createTdsProject) {
            this.fs.copy(
                this.templatePath('tds/**/*'),
                this.destinationPath(path.join(targetPath, 'tds'))
            );

            // tds csproj
            this.fs.copyTpl(
                this.templatePath('Tds.Master.scproj'),
                this.destinationPath(path.join(targetPath,
                    'tds',
                    this.props.solutionName + '.Feature.' + this.props.featureTitle + '.Master',
                    this.props.solutionName + '.Feature.' + this.props.featureTitle + '.Master.scproj')),
                this.props
            );
        }
    },
    end: function() {
        console.log('');
        console.log('Solution name ' + chalk.red.bold(this.props.solutionName));
        console.log('Your Feature module ' + chalk.red.bold(this.props.featureTitle) + ' has been created');
        console.log('');
        console.log('You will need to add your Feature project(s) to your Visual Studio solution.');
        if (this.props.createTdsProject) {
            console.log('You will need to add your TDS project(s) to your Visual Studio solution.');
        }
        console.log('Then build and publish the Feature project from Visual Studio.');
        console.log('');
    }
});