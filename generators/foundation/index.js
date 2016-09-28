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
            message: 'Enter the name of your Foundation module:'
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
        var targetPath = path.join('src', 'Foundation', this.props.foundationTitle);
        console.log('Target Path: ' + targetPath);

        /*********** CODE ***************/
        this.fs.copy(
            this.templatePath('code/**/*'),
            this.destinationPath(path.join(targetPath, 'code'))
        );

        // csproj
        this.fs.copyTpl(
            this.templatePath('Sitecore.Foundation.csproj'),
            this.destinationPath(path.join(targetPath, 'code', this.props.solutionName + '.Foundation.' + this.props.foundationTitle + '.csproj')),
            this.props
        );

        // AssemblyInfo.cs, project
        this.fs.copyTpl(
            this.templatePath('AssemblyInfo.cs'),
            this.destinationPath(path.join(targetPath, 'code', 'Properties', 'AssemblyInfo.cs')), { assemblyName: this.props.solutionName + '.Foundation.' + this.props.foundationTitle }
        );

        // Publish Profile configuration
        this.fs.copyTpl(
            this.templatePath('Local.pubxml'),
            this.destinationPath(path.join(targetPath, 'code', 'Properties/PublishProfiles', 'Local.pubxml')), { assemblyName: this.props.solutionName + '.Foundation.' + this.props.foundationTitle }
        );

        // config
        this.fs.copyTpl(
            this.templatePath('Foundation.config'),
            this.destinationPath(path.join(targetPath, 'code', 'App_Config', 'Include/' + this.props.solutionName, 'Foundation', 'Foundation.' + this.props.foundationTitle + '.config')),
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
                    this.props.solutionName + '.Foundation.' + this.props.foundationTitle + '.Master',
                    this.props.solutionName + '.Foundation.' + this.props.foundationTitle + '.Master.scproj')),
                this.props
            );
        }
    },
    end: function() {
        console.log('');
        console.log('Solution name ' + chalk.red.bold(this.props.solutionName));
        console.log('Your foundation module ' + chalk.red.bold(this.props.foundationTitle) + ' has been created');
        console.log('');
        console.log('You will need to add your foundation project(s) to your Visual Studio solution.');
        console.log('Then build and publish the foundation project from Visual Studio.');
        console.log('');
    }
});